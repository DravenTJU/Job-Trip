
[模式:计划][模型:Claude 3.7 Sonnet]

# 合并统一 AppError 类计划

## 1. 分析现状

### 当前存在的问题
- AppError 类在两个地方有不同定义：`utils/AppError.ts` 和 `middleware/errorHandler.ts`
- 不同文件从不同位置导入 AppError，导致不一致性
- errorHandler.ts 中的 AppError 版本功能更丰富，具有 isOperational 属性和堆栈跟踪

### 现有文件分析
- `utils/AppError.ts`: 简单版本
- `middleware/errorHandler.ts`: 包含错误处理中间件和 AppError 类
- 大多数服务从 `../middleware/errorHandler` 导入 AppError
- 少数服务（如 aiController）从 `../utils/AppError` 导入

## 2. 详细实施计划

### 步骤1：更新 utils/AppError.ts
1. 扩展现有 AppError 类，添加 isOperational 属性
2. 添加堆栈跟踪功能
3. 确保构造函数与现有代码兼容
4. 添加适当的类型注释和文档

```typescript
// 优化后的 AppError.ts
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.name = 'AppError';

    Error.captureStackTrace(this, this.constructor);
  }
}
```

### 步骤2：修改 middleware/errorHandler.ts
1. 删除 AppError 类定义
2. 导入 utils/AppError.ts 中的 AppError
3. 保持其他错误处理功能不变

```typescript
// 修改 errorHandler.ts 的开头部分
import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import { AppError } from '../utils/AppError';

/**
 * 统一API响应格式
 */
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T | null;
  timestamp: number;
  traceId?: string;
}

// ...其余代码保持不变
```

### 步骤3：更新项目中的导入引用
从 `../middleware/errorHandler` 导入 AppError 的文件需要更新为从 `../utils/AppError` 导入

需要更新以下文件的导入语句：
1. controllers/jobController.ts
2. controllers/userJobController.ts
3. controllers/userProfileController.ts
4. controllers/resumeController.ts
5. controllers/userController.ts
6. controllers/companyController.ts
7. middleware/authMiddleware.ts

每个文件的修改都遵循同样的模式：
```typescript
// 原来的导入
import { AppError, createApiResponse } from '../middleware/errorHandler';

// 修改后的导入
import { AppError } from '../utils/AppError';
import { createApiResponse } from '../middleware/errorHandler';
```

## 3. 测试计划
1. 检查编译是否通过
2. 运行系统测试
3. 测试各种错误场景，确保错误处理正常工作
4. 验证堆栈跟踪是否正确显示

## 4. 回滚计划
如果合并后出现问题，准备一个回滚脚本，恢复文件到原始状态。

## 5. 实施后的文档更新
更新相关文档，说明 AppError 的统一用法和最佳实践。

实施检查清单:
1. 更新 utils/AppError.ts 中的 AppError 类，添加 isOperational 属性和堆栈跟踪
2. 修改 middleware/errorHandler.ts，删除 AppError 类定义，导入 utils/AppError
3. 考虑在 errorHandler.ts 中重新导出 AppError 减少修改量
4. 更新 controllers/jobController.ts 的导入语句
5. 更新 controllers/userJobController.ts 的导入语句
6. 更新 controllers/userProfileController.ts 的导入语句
7. 更新 controllers/resumeController.ts 的导入语句
8. 更新 controllers/userController.ts 的导入语句
9. 更新 controllers/companyController.ts 的导入语句
10. 更新 middleware/authMiddleware.ts 的导入语句
11. 编译并测试系统
12. 验证错误处理功能正常工作
13. 更新相关文档说明 AppError 的统一用法
