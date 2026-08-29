# Relay

> 把自然语言里的复杂事项，整理成负责人、下一步、完成标准和决策边界都清楚的协作流程。

![Relay Signal OS 完整工作台](./public/relay-cover-v4.png)

Relay 是一款移动优先的协作工作台。总览、事项、协作、关系人、动态、设置和 Agent 创建都读取同一份工作区数据，用户可以真实点击、创建、邀请、确认、调整、完成和回看结果。

它解决的是聊天工具难以长期维护的结构化协作问题。聊天消息可以表达意图，但“现在由谁处理、下一步到底是什么、做到什么算完成、什么情况必须先联系发起者”很容易随对话滚动而丢失。Relay 把这些信息保留为可执行、可追踪的事项，同时仍允许参与者接受、提出调整或拒绝邀请。

## 在线体验

- [Relay 在线工作台](https://relay-p0-demo.vercel.app/)：蓝紫色 Relay Signal OS 界面，支持电脑和手机浏览器
- [Agent 创建事项](https://relay-p0-demo.vercel.app/matters/new)：用自然语言生成可确认的多步骤计划
- [公开协作视图](https://relay-p0-demo.vercel.app/r/demo-cat-checkup)：无需账号体验接受、处理与完成结果

## 核心功能

- 完整事项管理：新建、编辑、搜索、状态筛选、邀请协作、提出调整、拒绝、完成与重新打开
- 四种用户视角：右上角可切换林然、小雨、姐姐和陈屿，观察同一份数据在不同责任位置下的变化
- MiniMax 协作 Agent：把复杂描述拆成每个都能独立完成和确认的步骤，发现阻塞信息时一次只追问一个问题
- 人工决策边界：Agent 只生成草案；发起者确认后才创建事项，受邀人仍需亲自回应
- 真实预制数据：14 条跨宠物、家人、住房、行政、伴侣和旅行场景的共享事项及活动记录
- 状态持久化与多视图联动：`localStorage`、`BroadcastChannel` 和 storage event
- 电脑与手机协同演示：Node 服务提供共享房间，让不同浏览器视图同步呈现责任变化
- 响应式界面：针对 375×812 手机和 1440×900 桌面完成视觉与交互验证
- 离线协作流程：页面加载后可在断网状态完成事项邀请、确认、处理与结果回看

## 本地运行

```bash
npm install
cp .env.example .env.local
npm run dev
```

在 `.env.local` 中配置服务端 `MINIMAX_API_KEY`；浏览器端不会接触模型密钥。

构建后的完整 Node 演示服务：

```bash
npm run build
npm run serve
```

质量门禁：

```bash
npm run verify
npm run test:golden
```

`npm run verify` 覆盖 ESLint、严格 TypeScript、Vitest、生产构建与 53 条 Playwright E2E；场景矩阵包含 10 个场景、30 条独立用户用例。`npm run test:golden` 连续运行十次完整产品路径和十次离线路径。
