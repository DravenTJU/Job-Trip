[模式:计划][模型:Claude 3.7 Sonnet]

根据我的研究，需要对DashboardPage.tsx和相关组件进行样式更新，同时解决类型不兼容问题。以下是详细的计划：

## 修改计划：Dashboard页面样式更新与类型修复

### 1. 类型兼容性修复

DashboardPage.tsx中的Job接口与types/job.ts中的Job接口不兼容，导致DroppableColumn组件无法正确接收数据。我们有两种解决方案：

方案A：创建一个类型适配器
- 在DashboardPage.tsx中创建从本地Job类型到types/job.ts中Job类型的转换函数
- 修改传递给DroppableColumn的数据，确保符合其期望的类型

方案B：修改DroppableColumn组件
- 更新DroppableColumn组件，使其接受泛型类型参数
- 在DashboardPage中指定使用本地Job类型

考虑到项目结构和维护性，我们选择方案A，进行类型适配。

### 2. 样式更新任务

#### 2.1 容器与布局样式更新
- 更新主容器使用`container-lg`
- 将部分区块使用`section space-y-6`样式
- 统一网格布局使用`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`

#### 2.2 卡片样式更新
- 将所有卡片更新为新的设计样式：
  ```
  bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-sm ring-2 ring-gray-900/5 dark:ring-gray-100/5 hover:shadow-lg transition-all duration-200
  ```
- 尤其更新：
  - 统计卡片(4个)
  - 面试提醒卡片
  - 待处理任务卡片
  - 看板列组件

#### 2.3 按钮样式更新
- 主按钮（添加职位按钮）更新为：
  ```
  inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/25 transition-colors
  ```
- 次按钮更新为：
  ```
  inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg ring-2 ring-gray-900/5 dark:ring-gray-100/5 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors
  ```

#### 2.4 输入框样式更新
- 更新搜索输入框为：
  ```
  w-full h-11 pl-10 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow
  ```
- 更新编辑模态框中的输入框

#### 2.5 标签与状态样式更新
- 使用适当的状态标签样式：
  - 已确认：`bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400`
  - 待确认：`bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400`
  - 职位类型标签：`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium`

#### 2.6 文本样式统一
- 标题使用`text-2xl font-semibold text-gray-900 dark:text-gray-100`
- 子标题使用`text-lg font-medium`
- 描述文本使用`text-gray-500 dark:text-gray-400`

### 3. 具体修改执行计划

1. 首先创建类型适配器，解决Job类型不兼容问题
2. 更新DashboardPage.tsx的主容器和整体布局样式
3. 更新统计卡片样式
4. 更新搜索和筛选区域样式
5. 更新看板视图样式（涉及DroppableColumn组件）
6. 更新面试提醒和待处理任务区域样式
7. 更新编辑模态框样式

### 4. 注意事项

- 保持现有功能不变，仅更新样式
- 确保所有组件都支持暗色模式
- 确保响应式设计在不同屏幕尺寸上正常工作
- 代码风格保持一致

实施检查清单:
1. 创建类型适配器函数，将本地Job类型转换为types/job.ts中的Job类型
2. 修改DashboardPage.tsx中的容器类和整体布局样式
3. 更新4个统计卡片的样式
4. 更新搜索框和添加职位按钮样式
5. 修改看板视图容器样式
6. 调整DroppableColumn组件接口，接受本地Job类型
7. 更新面试提醒卡片样式
8. 更新待处理任务卡片样式
9. 更新编辑模态框的样式和输入框样式
10. 检查暗色模式支持
11. 检查响应式设计在各种屏幕尺寸下的效果
