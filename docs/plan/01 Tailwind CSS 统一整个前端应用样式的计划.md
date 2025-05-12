一个详细的计划，以 `JobsPage.tsx` 的样式为基准，全面拥抱 Tailwind CSS 来统一整个前端应用的样式。这个计划将涵盖您提到的所有关键点：移除/替换 MUI、组件化与自定义类、统一布局容器、统一交互元素样式、确保响应式和暗黑模式，并继续使用 `lucide-react` 图标库。

**总体目标：**

实现整个前端应用在视觉风格和代码实现上的一致性，以 Tailwind CSS 为核心，提升开发效率和可维护性。

**核心原则：**

1.  **Tailwind First**: 新建和重构的组件优先使用 Tailwind CSS 工具类。
2.  **原生优先，组件化为辅**: 优先使用原生 HTML 元素配合 Tailwind CSS。当样式组合变得复杂或需要在多处复用时，将其封装成独立的 React 组件。
3.  **减少 CSS 文件**: 目标是尽量减少页面级或组件级的独立 `.css` 文件。必要的全局样式或复杂的、难以用纯 Tailwind 实现的组件基类，可以在全局 CSS 文件（如 `index.css` 或新建 `theme.css`/`base.css`）中使用 `@apply` 定义。
4.  **MUI 逐步剥离**: 系统性地替换项目中使用的 Material-UI 组件。
5.  **一致性**: 确保所有交互元素（按钮、表单、卡片等）、布局容器、间距、排版、颜色在整个应用中保持一致的风格，参照 `JobsPage.tsx` 的实现。
6.  **响应式和暗黑模式**: 所有组件和页面必须从一开始就考虑并实现响应式布局和暗黑模式支持。

**详细计划步骤：**

**阶段一：基础建设和规范制定 (全局层面)**

1.  **分析并提取 `JobsPage.tsx` 的通用样式模式**:
    *   **容器 (Containers)**:
        *   确定 `JobsPage.tsx` 中使用的 `.container-lg` 或类似容器类的具体 Tailwind 实现（可能在全局 CSS 中）。如果不存在，则在全局 CSS (例如 `src/index.css` 或 `src/styles/global.css`) 中定义一个标准的容器类，如：
            ```css
            /* src/index.css or src/styles/global.css */
            .container-main {
              @apply mx-auto px-4 sm:px-6 lg:px-8; /* 根据需要调整 */
            }
            .container-lg { /* 如果 JobsPage 已有，则以此为准或调整 */
              @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
            }
            ```
    *   **区块 (Sections)**:
        *   定义标准的页面区块样式，如 `JobsPage.tsx` 中的 `.section`（如果它是自定义的），包含上下间距等。例如：
            ```css
            .section {
              @apply py-8 sm:py-12; /* 示例间距 */
            }
            .section-title {
              @apply text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6; /* 统一区块标题 */
            }
            ```
    *   **卡片 (Cards)**:
        *   从 `JobsPage.tsx` 中提取卡片（如职位列表项的容器）的 Tailwind 类组合，并在全局 CSS 中定义一个可复用的 `.card-base` 类：
            ```css
            .card-base {
              @apply bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-md ring-1 ring-gray-900/5 dark:ring-white/10 transition-all duration-300;
            }
            .card-interactive {
              @apply hover:shadow-lg hover:ring-gray-900/10 dark:hover:ring-white/20;
            }
            /* 可以根据需要增加 .card-header, .card-body, .card-footer 等辅助类 */
            ```
    *   **按钮 (Buttons)**:
        *   定义一组标准的按钮样式（主按钮、次按钮、危险按钮、幽灵按钮、图标按钮等），使用 `@apply` Tailwind 类。例如：
            ```css
            .btn {
              @apply inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-150;
            }
            .btn-primary {
              @apply btn bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500;
            }
            .btn-secondary {
              @apply btn bg-indigo-100 text-indigo-700 hover:bg-indigo-200 focus:ring-indigo-500 dark:bg-indigo-700/30 dark:text-indigo-300 dark:hover:bg-indigo-700/50;
            }
            .btn-icon { /* 用于纯图标按钮，如Sidebar中的 */
              @apply p-2 rounded-full text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors;
            }
            /* ... 其他按钮类型 ... */
            ```
    *   **表单元素 (Forms)**:
        *   定义输入框 (`.form-input`)、选择框 (`.form-select`)、文本域 (`.form-textarea`) 的统一基础样式。
            ```css
            .form-input, .form-select, .form-textarea {
              @apply block w-full h-10 px-3 py-2 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-lg border-0 ring-1 ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-indigo-500 transition-shadow shadow-sm text-sm;
            }
            .form-label {
              @apply block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1;
            }
            /* ... 其他表单相关样式 ... */
            ```
    *   **排版 (Typography)**:
        *   虽然 Tailwind 提供了丰富的排版工具类，但可以考虑定义一些语义化的标题类，如 `.heading-xl`, `.heading-lg`, `.body-text`, `.caption-text` 等，如果项目中对特定字体、大小、行高组合有严格要求。
            ```css
            .heading-xl {
              @apply text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl;
            }
            /* ... */
            ```

2.  **配置 Tailwind CSS 主题**:
    *   在 `tailwind.config.js` 文件中，检查并统一项目的主题色（特别是 `indigo` 相关的颜色，看是否与 `JobsPage.tsx` 一致）、字体、断点等。
    *   确保暗黑模式配置 (`darkMode: 'class'`) 已启用。

3.  **更新全局 CSS 文件**:
    *   将步骤1中定义的自定义类添加到全局 CSS 文件（如 `src/index.css` 或新建的 `src/styles/theme.css` / `src/styles/base-components.css`）。
    *   清理现有全局 CSS 中与新规范冲突或冗余的样式。

4.  **文档化**:
    *   为新定义的全局自定义类和样式规范创建简单的文档或共享给团队，确保所有人理解和遵循。

**阶段二：页面和组件的逐步重构**

1.  **选择试点页面/组件**:
    *   从样式差异较大或相对简单的页面开始（例如，如果 `WelcomePage.tsx` 中有些自定义类定义不清晰，可以先规范化它）。
    *   或者，选择一个使用了 MUI 但功能不复杂的页面作为替换 MUI 的试点。

2.  **重构策略**:
    *   **MUI 替换**:
        *   识别页面中使用的 MUI 组件。
        *   对于每个 MUI 组件，找到其对应的原生 HTML 结构和 Tailwind CSS 实现方式。例如：
            *   MUI `Button` -> HTML `<button className="btn btn-primary">`
            *   MUI `Card` -> HTML `<div className="card-base">`
            *   MUI `TextField` -> HTML `<label className="form-label">...</label><input type="text" className="form-input" />`
            *   MUI `Typography` -> HTML `<p className="text-gray-700 dark:text-gray-200 text-base">` (或使用定义的排版类)
            *   MUI `Box`, `Grid` -> HTML `div` 配合 Tailwind Flexbox/Grid 工具类。
        *   逐步替换，并使用 `sx` prop 中的样式作为参考，转换为 Tailwind 类。
    *   **专用 CSS 文件处理 (`.css` / `.module.css`)**:
        *   分析 CSS 文件中的规则。
        *   将能用 Tailwind 实现的规则直接移到组件的 `className` 中。
        *   对于可复用的组件级样式，考虑是否抽象成全局自定义类（见阶段一）或 React 组件。
        *   目标是最终删除这些专用的 CSS 文件。
    *   **内联样式和 `style` Prop**: 尽量避免使用内联 `style` prop，将其替换为 Tailwind 类。

3.  **创建可复用组件**:
    *   在重构过程中，如果发现某些UI模式（如一个包含图标和文本的特定样式的输入框、一个复杂的卡片结构）在多个地方重复出现，并且其 Tailwind 类组合非常冗长，则将其封装成一个新的 React 组件。
    *   例如，可以创建一个 `InputWithIcon` 组件，或一个 `StyledCard` 组件。这些组件内部使用 Tailwind CSS。

4.  **统一现有 Tailwind 用法**:
    *   对于已经在使用 Tailwind 的页面，检查其用法是否与 `JobsPage.tsx` 的风格和新定义的全局类一致。例如，按钮是否都使用了 `.btn .btn-primary` 或类似的规范。

5.  **确保响应式和暗黑模式**:
    *   在重构每个组件和页面时，必须使用 Tailwind 的响应式前缀 (`sm:`, `md:`, `lg:`) 和暗黑模式前缀 (`dark:`) 来确保在所有设备和模式下的显示效果符合 `JobsPage.tsx` 的标准。

6.  **图标**:
    *   继续统一使用 `lucide-react` 图标库。确保图标的大小、颜色通过 Tailwind 类控制，并与周围元素协调。

**阶段三：测试和迭代**

1.  **视觉回归测试**: 在修改每个页面或组件后，进行彻底的视觉测试，确保其外观与 `JobsPage.tsx` 的风格一致，并且在不同屏幕尺寸和暗黑/亮色模式下表现正常。
2.  **功能测试**: 确保样式更改没有破坏组件或页面的原有功能。
3.  **代码审查**: 团队成员之间进行代码审查，确保遵循了新的样式规范和 Tailwind CSS 的最佳实践。
4.  **迭代优化**: 根据测试和审查结果，进行必要的调整和优化。

**具体页面处理示例（高层次）：**

*   **`UserProfilePage.tsx` (MUI 重灾区)**:
    *   将 `Tabs`, `Tab`, `Card`, `TextField`, `Button`, `List`, `Dialog` 等 MUI 组件替换为 Tailwind CSS 实现的等效组件或自定义组件。
    *   例如，Tabs 可以用一组样式化的 `button` 或 `div` 实现；Dialog 可以创建一个自定义的模态框组件，内部使用 Tailwind。
    *   这是一个工作量较大的页面，需要细致规划。

*   **`ResumeFormPage.tsx` (有专用 CSS)**:
    *   打开 `ResumeFormPage.css`。
    *   逐条分析 CSS 规则，尝试用 Tailwind 类在 `ResumeFormPage.tsx` 的 JSX 中直接替换。
    *   如果有些样式是通用的表单元素样式，看是否能被阶段一中定义的 `.form-input`, `.form-label` 等覆盖。
    *   最终目标是删除 `ResumeFormPage.css`。

*   **`WelcomePage.tsx` (已有 Tailwind，但有自定义类)**:
    *   检查 `.welcome-banner`, `.title-lg` 等自定义类的定义位置（可能在全局 CSS）。
    *   评估这些自定义类是否必要，或者是否可以用纯 Tailwind 工具类或阶段一中定义的全局自定义类（如 `.section-title`）替代。
    *   确保其使用的 Tailwind 类与 `JobsPage.tsx` 的风格一致（例如按钮样式）。

**工具和资源：**

*   **Tailwind CSS IntelliSense (VS Code 扩展)**: 提高编写 Tailwind 类的效率。
*   **浏览器开发者工具**: 用于检查现有样式和调试 Tailwind 类。
*   **Tailwind CSS 文档**: 随时查阅可用的工具类。

这个计划比较宏大，需要时间和持续的努力。建议分模块、分页面逐步推进。

**实施检查清单 (高级别):**

1.  **[全局]** 分析 `JobsPage.tsx` 的样式模式，并在全局 CSS 中定义可复用的自定义类（容器、区块、卡片、按钮、表单元素、排版）。
2.  **[全局]** 配置 `tailwind.config.js`，统一主题色、字体、断点。
3.  **[全局]** 清理现有全局 CSS 中与新规范冲突或冗余的样式。
4.  **[全局]** 创建样式规范文档。
5.  **[页面级]** 对于每个目标页面：
    *   移除或替换 MUI 组件，使用原生 HTML + Tailwind CSS 或自定义的 Tailwind 组件。
    *   迁移专用 CSS 文件中的样式到 Tailwind 类或全局自定义类，并删除专用 CSS 文件。
    *   统一页面布局、容器、交互元素样式，使其符合全局规范和 `JobsPage.tsx` 风格。
    *   确保响应式布局和暗黑模式支持。
    *   统一使用 `lucide-react` 图标。
6.  **[组件级]** 对于在重构中识别出的可复用 UI 模式，创建独立的 React 组件，内部使用 Tailwind CSS。
7.  **[测试]** 对每个重构的页面和组件进行视觉和功能测试。
8.  **[审查]** 进行代码审查，确保遵循规范。
