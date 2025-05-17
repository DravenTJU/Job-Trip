这是一个针对 `backend/src/controllers/jobController.ts` 的重构计划，旨在实现您提出的三个目标：

**`jobController.ts` 重构计划**

**目标：**

1.  移除 `createJobFromExtension` 中原有的 `userToken` 鉴权逻辑，统一使用 `protect` 中间件。
2.  将 `createJobsBatch` 和 `createJobFromExtension` 两个函数的功能合并到新的 `createJobs` 函数中（或增强现有的 `createJobsBatch`），使其能够处理单个职位对象或职位对象数组的输入。
3.  统一代码风格，通过提取共享逻辑到辅助函数来减少重复代码。

**前提：**

  * 所有相关的API路由（包括原先调用 `createJobFromExtension` 和 `createJobsBatch` 的路由）都将通过 `protect` 中间件进行鉴权，确保 `req.user` 对象在控制器中可用。
  * 前端或插件端在调用新的创建职位接口时，将通过标准的 `Authorization: Bearer <token>` 请求头传递JWT。

**重构步骤：**

**第一阶段：准备工作和辅助函数提取**

1.  **创建核心职位处理辅助函数 `_processJobData`**

      * **目的**：封装单个职位数据的处理逻辑，包括数据校验、公司信息处理、职位创建/查找、用户职位关联以及历史记录创建。
      * **输入参数**：
          * `jobData: any`：单个职位的数据对象（与前端或插件发送的结构一致）。
          * `userId: string`：当前操作用户的 ID。
          * `companyCache: Map<string, string>` (可选, 用于批量处理时缓存公司ID，避免重复查询)。
      * **核心逻辑**：
          * **数据提取与校验**：从 `jobData` 中提取所有必要的职位字段（`platform`, `title`, `companyName`, `location`, `sourceId`, `sourceUrl`, `description`, `salary`, `jobType`, `status` (作为初始申请状态), `source`, `requirements`, `deadline`, `notes`, `companyInfo` 等）。进行必要的格式校验。
          * **公司处理 ( `_findOrCreateCompany` 辅助函数)**：
              * 根据 `jobData.companyName` 和 `userId` (以及可选的 `jobData.companyInfo`) 查找或创建公司。
              * 返回公司ID。可以利用 `companyCache` 优化批量处理。
          * **职位唯一性检查**：检查具有相同 `sourceId` (如果提供) 和 `userId` 的 `Job` 是否已存在。如果存在，则不创建新的 `Job`，但可能仍需创建或更新 `UserJob` 关联。
          * **创建 `Job` 文档**：如果职位是新的，则使用提取的数据和获取到的 `companyId` 创建 `Job` 文档，`createdBy` 设为 `userId`。
          * **创建/更新 `UserJob` 文档**：
              * 查找用户是否已与此职位（通过 `jobId`）关联。
              * 如果未关联，则创建新的 `UserJob` 文档，包含 `userId`, `jobId`, 以及从 `jobData` 或默认值获取的 `status` (例如, `'new'`)。
              * 如果已关联，根据需求可以考虑是否更新某些字段 (例如 `notes`)，或者直接跳过。
          * **创建 `ApplicationHistory` 文档**：为新的 `UserJob` 关联记录初始状态。
      * **返回值**：
          * 成功时：返回包含 `{ job: IJob, userJob: IUserJob, applicationHistory: IApplicationHistory, company: ICompany }` 的对象。
          * 失败或跳过时（如重复）：返回包含错误信息或处理状态的对象，例如 `{ error: string, jobDetails: any }` 或 `{ skipped: true, reason: string, jobDetails: any }`。
      * **位置**：此函数可以作为 `jobController.ts` 内的私有辅助函数。

2.  **创建辅助函数 `_findOrCreateCompany`** (如果尚未存在或需要优化)

      * **目的**：根据公司名称和可选的公司信息，为特定用户查找或创建公司记录。
      * **输入参数**：`companyName: string`, `userId: string`, `companyInfo?: any`, `companyCache?: Map<string, string>`。
      * **逻辑**：
          * 优先从 `companyCache` 中查找。
          * 如果未找到，则在数据库中根据 `name` 和 `createdBy: userId` 查找公司。
          * 如果仍未找到，则使用 `companyName` 和 `companyInfo` 创建新公司，`createdBy: userId`。
          * 将结果存入 `companyCache`。
          * 返回公司ID。
      * **位置**：`jobController.ts` 内的私有辅助函数。

**第二阶段：合并和重构主要控制器函数**

1.  **重构/创建 `createJobs` (替代 `createJobsBatch` 和 `createJobFromExtension`)**

      * **目的**：统一处理单个或批量职位创建请求。
      * **函数签名**：`export const createJobs = async (req: Request, res: Response, next: NextFunction) => { ... }`
      * **输入**：`req.body` 可以是一个职位数据对象，也可以是一个包含多个职位数据对象的数组（例如 `req.body.jobs` 或直接 `req.body` 是数组）。
      * **核心逻辑**：
          * **获取 `userId`**：从 `req.user._id` 获取用户ID。如果 `req.user` 不存在，则通过 `next(new AppError('User not authenticated', 401));` 返回错误（理论上 `protect` 中间件会处理）。
          * **判断输入类型**：检查 `req.body` (或 `req.body.jobs`) 是单个对象还是数组。
              * 将单个对象包装成单元素数组，以便后续统一处理。
          * **初始化结果收集器**：`const createdJobsResults: any[] = []; const errors: any[] = [];`
          * **初始化 `companyCache`**：`const companyCache = new Map<string, string>();`
          * **遍历职位数据**：对于数组中的每个职位数据对象：
              * 调用 `await _processJobData(jobDataItem, userId, companyCache);`
              * 根据 `_processJobData` 的返回结果，将成功创建的职位信息添加到 `createdJobsResults`，将错误或跳过的信息添加到 `errors`。
          * **构建响应**：
              * 如果原始输入是单个对象，且处理成功，可以返回单个创建的职位信息 (HTTP 201)。
              * 如果原始输入是数组，或单个对象处理失败/跳过，返回包含 `createdJobs` 和 `errors` 的批量处理结果 (HTTP 200 或 207 Multi-Status)。
      * **移除 `userToken` 逻辑**：由于所有调用此接口的请求都已通过 `protect` 中间件，不再需要检查和处理 `req.body.userToken`。

2.  **移除旧函数**：

      * 删除 `createJobFromExtension` 函数。
      * 删除旧的 `createJobsBatch` 函数（如果新函数命名为 `createJobs`，或者直接修改 `createJobsBatch`）。

**第三阶段：更新路由和测试**

1.  **更新 `jobRoutes.ts`**：

      * 移除 `/extension` 路由。
      * 修改原 `/batch` 路由（或创建新路由，例如 `/` POST 请求），使其指向新的 `createJobs` (或重构后的 `createJobsBatch`) 函数。
      * 确保此路由受到 `protect` 中间件的保护。
        ```typescript
        // Example in jobRoutes.ts
        // import { createJobs, /* other job controller functions */ } from '../controllers/jobController';
        // import { protect } from '../middleware/authMiddleware';

        // router.post('/', protect, createJobs); // Handles both single and batch job creation
        ```

2.  **代码风格和一致性检查**：

      * 通读 `jobController.ts`，确保所有函数遵循一致的异步处理模式 ( `async/await` )。
      * 使用一致的错误处理方式 (例如，都通过 `next(error)` 或 `next(new AppError(...))` 传递错误)。
      * 确保变量命名、注释风格等保持一致。
      * 移除不必要的 `console.log` 和注释掉的代码。

3.  **全面测试**：

      * **单元测试**：
          * 测试 `_findOrCreateCompany` 辅助函数。
          * 测试 `_processJobData` 辅助函数，覆盖各种场景（新职位、用户已有关联的职位、新公司、现有公司、数据不完整等）。
          * 测试新的 `createJobs` 函数，覆盖单个职位创建成功/失败、批量职位创建（全部成功、部分成功、全部失败、处理重复项）等场景。
      * **集成测试**：测试API端点，确保在有无 `Authorization` 头、单个职位数据、批量职位数据等情况下的正确响应。
      * **前端/插件端调整**：确保前端应用和浏览器插件更新其API调用方式，以适应新的端点和请求/响应结构，并使用标准的JWT Bearer token进行认证。

**预期效果：**

  * `jobController.ts` 更加简洁，核心的职位创建逻辑被封装和复用。
  * 移除了特定于插件的 `userToken` 认证方式，所有职位创建操作都依赖标准的 `protect` 中间件进行用户认证。
  * 提供了一个统一的入口点 (`createJobs` 或增强的 `createJobsBatch`) 来处理单个和批量的职位创建，简化了API接口。
  * 提高了代码的可维护性和可读性。

