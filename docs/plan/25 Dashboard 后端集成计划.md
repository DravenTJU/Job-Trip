这是一个将 `frontend/src/pages/DashboardPage.tsx` 与后端集成的计划，主要关注拉取和展示用户相关的职位数据。

**目标：**

将职位追踪面板 (`DashboardPage.tsx`) 从纯前端静态展示转变为动态显示用户通过 JobTrip 应用追踪的实际职位数据。用户可以根据职位状态（如 "New", "Applied", "Interviewing", "Offer", "Rejected" 等）查看和管理他们的职位列表。

**集成计划步骤：**

1.  **理解前端现有结构 (`DashboardPage.tsx`)**
    * 分析当前组件如何组织和展示职位卡片（`DraggableJobCard`）和状态列（`DroppableColumn`）。
    * 确定当前用于存储和管理职位数据的状态管理方式（可能是组件内部 state，或者 Redux）。
    * 了解现有的数据结构，特别是职位对象（`Job` 类型）的字段。

2.  **API 服务层对接 (`frontend/src/services/`)**
    * **确认 API 端点**：根据 `backend/src/routes/jobRoutes.ts`，获取用户相关职位的 API 端点是 `GET /api/v1/jobs/user`。
    * **创建或更新 API 服务函数**：
        * 在 `frontend/src/services/jobService.ts` (或 `userJobService.ts`，根据职责划分) 中，创建一个函数（例如 `getUserJobs` 或 `WorkspaceUserDashboardJobs`）。
        * 该函数将使用 Axios 向 `GET /api/v1/jobs/user` 发送请求。
        * 确保请求包含用户认证的 JWT Token（通常 Axios 实例会自动处理）。
        * 该函数应能接收过滤参数（如状态、排序等），虽然初期可能不需要所有过滤，但要为未来扩展考虑。
    * **定义数据类型**：
        * 在 `frontend/src/types/job.ts` (或相关类型文件) 中，确保前端的 `Job` 类型与后端返回的职位数据结构（包含 `status`, `isFavorite`, `userJobId` 等用户特定字段）一致。后端 `jobController.ts` 中的 `getUserRelatedJobs` 函数返回的数据结构是关键参考。

3.  **状态管理 (Redux Toolkit - `frontend/src/redux/`)**
    * **创建/更新 Redux Slice**：
        * 考虑在 `userJobsSlice.ts` (如果已有) 或 `jobsSlice.ts` 中添加用于存储用户仪表盘职位数据的 state。
        * 定义相关的 reducers 来处理数据加载、成功、失败的状态。
        * 创建 `asyncThunk` 来调用步骤 2 中定义的 API 服务函数 (`getUserJobs`)，并根据 API 响应更新 Redux store。
    * **Action Dispatch**: 在 `DashboardPage.tsx` 组件加载时（例如在 `useEffect` hook 中），dispatch 这个 `asyncThunk` 来获取数据。

4.  **`DashboardPage.tsx` 组件修改**
    * **获取数据**：
        * 使用 `useAppSelector` (自定义的 Redux selector hook) 从 Redux store 中获取用户职位数据、加载状态和错误信息。
    * **数据展示**：
        * 根据从 Redux store 获取到的职位数据，动态渲染 `DroppableColumn` 和 `DraggableJobCard`。
        * 确保职位数据正确地传递给 `DraggableJobCard` 组件。
        * 处理加载状态（显示加载指示器）和错误状态（显示错误提示）。
    * **状态列逻辑**：
        * 当前 `DashboardPage.tsx` 可能有预定义的列（如 "New", "Applied"）。需要确保这些列的 `id` 或 `title` 与后端返回或前端定义的职位状态值 (如 `job.status`) 相匹配，以便将职位卡片正确地归类到对应的列中。
        * 根据实际数据调整列的显示，或者动态生成列。

5.  **职位状态更新 (拖拽交互)**
    * **确认 API 端点**：根据 `backend/src/routes/jobRoutes.ts`，更新职位状态的 API 端点是 `PUT /api/v1/jobs/:id/status`。
    * **API 服务函数**：
        * 在 `jobService.ts` 或 `userJobService.ts` 中创建或更新一个函数（例如 `updateUserJobStatus`）来调用此 API。此函数需要 `jobId` (这里的 `id` 指的是 `Job._id`) 和新的 `status` 作为参数。
    * **Redux Action (Optimistic Update 可选)**：
        * 创建一个 `asyncThunk` 来调用 `updateUserJobStatus`。
        * 在拖拽完成的回调函数 (`onDragEnd` 或类似逻辑) 中：
            1.  Dispatch 此 `asyncThunk` 将状态变更同步到后端。
            2.  （可选但推荐）实现 Optimistic Update：在 API 请求发送后，立即更新 Redux store 中的职位状态，以提供更流畅的用户体验。如果 API 请求失败，则回滚状态。
            3.  如果后端成功，Redux store 应该反映后端返回的最新状态（后端在 `PUT /:id/status` 成功后会返回更新后的职位数据）。
    * **`DashboardPage.tsx` 拖拽逻辑更新**：
        * 在 `onDragEnd` (或其他处理拖拽结束的函数) 中，获取被拖拽的职位 ID 和目标列的状态。
        * 调用 Redux action 来更新职位状态。

6.  **错误处理和用户反馈**
    * 在 API 调用和 Redux actions 中实施稳健的错误处理。
    * 使用 `AlertMessage` 或类似的组件向用户显示加载状态、成功消息或错误信息。

7.  **测试**
    * 手动测试数据加载、不同状态列的职位显示。
    * 测试拖拽职位到不同状态列的功能，并验证后端数据是否已更新。
    * 测试边界情况，如没有职位数据、API 请求失败等。

**需要考虑的方面：**

* **用户认证**：确保所有 API 请求都正确处理了用户认证。
* **数据同步**：如果用户在其他地方（例如职位详情页）更新了职位状态，仪表盘页面应该能反映这些变化（可以通过重新获取数据或更智能的 Redux store 更新实现）。
* **性能**：如果用户有很多职位，考虑分页或虚拟化加载，尽管 `GET /api/v1/jobs/user` 已经支持分页，但仪表盘的列式布局可能需要一次性加载较多数据，需权衡。
* **代码复用**：尽可能复用现有的组件和 Redux 逻辑。

