
[模式:计划][模型:Claude 3.7 Sonnet]

# DashboardPage职位添加和编辑功能重构计划

## 目标
将Dashboard页面中的职位添加和编辑功能重构为通过路由链接到专门的职位管理页面，移除本地模态框逻辑。

## 分析

### 当前实现
1. 使用本地状态`editingJob`和`EditModal`组件管理职位添加/编辑
2. 编辑保存通过`handleSaveEdit`函数更新本地状态
3. 删除功能通过`handleDelete`函数实现

### 需修改内容
1. 导入导航相关依赖（React Router的`useNavigate`）
2. 移除`EditModal`组件
3. 修改"添加职位"按钮，链接到`/jobs/new`
4. 修改编辑功能，导航到`/jobs/{jobId}/edit`
5. 移除`editingJob`状态和相关处理函数

## 技术方案

### 移除的代码
- `EditModal`组件定义（约56行）
- `editingJob`状态定义
- `handleSaveEdit`函数
- 模态框渲染部分

### 添加的代码
- 导入`useNavigate`
- 使用`useNavigate`定义导航函数
- 修改添加按钮和编辑按钮的处理函数

## 实施步骤

1. 引入React Router导航依赖
2. 定义导航函数
3. 修改添加职位按钮的处理逻辑
4. 修改编辑职位的处理逻辑
5. 保留删除职位的功能（通过API调用实现）
6. 移除不再需要的代码:
   - `EditModal`组件
   - `editingJob`状态
   - `handleSaveEdit`函数
   - 模态框渲染部分

## 详细代码修改

### 1. 导入依赖与Hook定义
```jsx
import { useNavigate } from 'react-router-dom';
// ... 其他导入

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  // ... 其他hooks和状态
```

### 2. 移除EditModal组件定义
删除整个EditModal组件定义（约56行代码）

### 3. 移除editingJob状态
```jsx
// 移除这一行
const [editingJob, setEditingJob] = useState<Job | null>(null);
```

### 4. 修改添加和编辑职位的处理函数
```jsx
// 修改handleEdit函数
const handleEdit = (job: Job) => {
  navigate(`/jobs/${job.id}/edit`);
};

// 添加职位的按钮点击处理
const handleAddJob = () => {
  navigate('/jobs/new');
};
```

### 5. 修改添加职位按钮
```jsx
<button 
  onClick={handleAddJob}
  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/25 transition-colors"
>
  <Plus className="h-5 w-5" />
  添加职位
</button>
```

### 6. 移除EditModal渲染部分
删除DashboardPage组件末尾的EditModal渲染代码

## 实施检查清单:
1. 导入React Router的useNavigate
2. 在DashboardPage组件中定义navigate常量
3. 删除EditModal组件的完整定义
4. 删除editingJob状态
5. 删除handleSaveEdit函数
6. 修改handleEdit函数实现导航到编辑页面
7. 添加handleAddJob函数实现导航到添加页面
8. 修改添加职位按钮的onClick处理函数
9. 删除组件末尾的EditModal渲染代码
10. 保留handleDelete函数（后续可调整为API调用）
