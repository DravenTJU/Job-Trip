# jobtrip Backend API

這是 jobtrip 瀏覽器擴展的後端 API 服務。

## 功能特點

- 接收和存儲從不同平台（LinkedIn、Indeed、SEEK）爬取的職位信息
- 提供職位搜索和過濾功能
- RESTful API 設計
- MongoDB 數據存儲

## 安裝

1. 安裝依賴：
```bash
npm install
```

2. 配置環境變量：
- 複製 `.env.example` 到 `.env`
- 修改必要的環境變量

3. 啟動服務：
```bash
npm start
```

開發模式：
```bash
npm run dev
```

## API 端點

### 職位相關

- `GET /api/jobs` - 獲取所有職位
- `POST /api/jobs` - 創建新職位
- `POST /api/jobs/batch` - 批量創建職位
- `GET /api/jobs/platform/:platform` - 根據平台獲取職位
- `GET /api/jobs/search?query=keyword` - 搜索職位

## 數據結構

職位對象包含以下字段：
- title: 職位標題
- company: 公司名稱
- location: 工作地點
- jobUrl: 職位鏈接
- description: 職位描述
- salary: 薪資信息
- jobType: 工作類型
- platform: 來源平台
- postedDate: 發布日期

## 開發環境要求

- Node.js >= 14
- MongoDB >= 4.4
- npm >= 6 