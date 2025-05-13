// 不需要显式导入 beforeEach 和 afterEach，因为它们已经是全局可用的
// 模拟 Chrome API
global.chrome = {
  runtime: {
    sendMessage: jest.fn(),
    onMessage: {
      addListener: jest.fn(),
      clearListeners: jest.fn(),
      dispatch: jest.fn()
    },
  },
  storage: {
    local: {
      get: jest.fn(),
      set: jest.fn(),
      clear: jest.fn(),
    },
  },
  tabs: {
    query: jest.fn(),
    sendMessage: jest.fn(),
    create: jest.fn(),
    remove: jest.fn()
  },
  sidePanel: {
    setPanelBehavior: jest.fn(),
    open: jest.fn(),
  },
  action: {
    onClicked: {
      addListener: jest.fn(),
      dispatch: jest.fn(),
      clearListeners: jest.fn()
    },
  },
};

// 模拟 DOM 环境
document.body.innerHTML = '<div id="app"></div>';

// 导出设置函数
module.exports = {
  setupTestEnvironment: () => {
    // 清除所有模拟函数
    jest.clearAllMocks();
    // 重置 DOM
    document.body.innerHTML = '<div id="app"></div>';
  },
  teardownTestEnvironment: () => {
    jest.resetModules();
  }
}; 