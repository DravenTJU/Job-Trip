
# 以 JobsPage.tsx 文件中使用的 Tailwind CSS 样式定义，以便为其他页面开发提供参考

## 图标
- 图标采用 Lucide React 图标库

## 布局样式
- `container-lg`: 容器宽度控制
- `section space-y-6`: 区块间距为6单位
- `flex flex-col md:flex-row`: 移动端竖向排列，桌面端横向排列
- `md:items-center md:justify-between`: 桌面端元素居中对齐，两端对齐
- `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`: 响应式网格布局

## 卡片与容器
- `bg-white/50 dark:bg-gray-800/50`: 半透明背景支持亮/暗模式
- `backdrop-blur-xl`: 背景模糊效果
- `rounded-2xl`: 大圆角
- `shadow-sm`: 轻微阴影
- `ring-2 ring-gray-900/5 dark:ring-gray-100/5`: 细边框效果
- `hover:shadow-lg transition-all duration-200`: 悬停时阴影加深的过渡动画

## 按钮样式
- 主按钮: `inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/25 transition-colors`
- 次按钮: `inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg ring-2 ring-gray-900/5 dark:ring-gray-100/5 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors`
- 分页按钮: `inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors`

## 输入框
- `w-full h-11 pl-10 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow`
- 下拉框类似样式

## 标签/状态样式
- 基础标签: `inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium`
- 状态样式函数 `getStatusStyles`: 根据不同状态返回不同颜色组合
  - 如新建: `bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400`
  - 申请中: `bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400`
  - 拒绝: `bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400`

## 文本样式
- 标题: `text-2xl font-semibold text-gray-900 dark:text-gray-100`
- 子标题: `text-lg font-medium`
- 描述文本: `text-gray-500 dark:text-gray-400`
- 标签文本: `text-sm font-medium text-gray-700 dark:text-gray-300`

## 加载与状态
- 加载动画: `animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500`
- 错误提示: `rounded-xl bg-red-50 dark:bg-red-500/10 p-4 text-red-600 dark:text-red-400`

## 响应式设计
- 移动优先设计，使用`md:`和`lg:`前缀实现响应式布局
- 灵活使用`flex-col`和`flex-row`在不同屏幕尺寸调整布局方向

## 暗色模式支持
- 全面支持暗色模式，几乎所有元素都有`dark:`前缀的替代样式

此页面遵循现代设计趋势，使用半透明效果、模糊背景、大圆角和精细边框，同时保持良好的暗色模式支持和响应式布局。
