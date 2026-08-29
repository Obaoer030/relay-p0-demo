# Relay 文档索引

开发时按以下优先级阅读：

1. [relay-prd.md](./relay-prd.md)：正式需求与验收，开发范围的唯一基线；
2. [demo-spec.md](./demo-spec.md)：路演界面、预置数据、状态与 90 秒脚本；
3. [ADR-001](./adr/ADR-001-demo-first-architecture.md)：为什么 P0 采用本地确定性架构；
4. [需求评审纪要](./reviews/2026-08-29-hackathon-requirements-review.md)：角色争议、被否决方案、Decision Log 与产品经理学习笔记。
5. [ADR-003](./adr/ADR-003-multi-perspective-liquid-glass.md)：多角色共享状态与 Calm Tech Glass 视觉决策。
6. [ADR-004](./adr/ADR-004-relay-signal-os.md)：参考驱动的 Relay Signal OS 视觉、动效与原创转换边界。
7. [ADR-005](./adr/ADR-005-single-workspace-lifecycle.md)：单一工作台状态和完整事项闭环。
8. [ADR-006](./adr/ADR-006-text-coordination-agent.md)：MiniMax 文字版协作 Agent、服务端凭据和共享演示房间。

如果文档发生冲突，以最新版本 PRD 为准；需要改变 ADR 中的技术决策时，先更新或新增 ADR，再回写 PRD。

## MiniMax Agent 配置

仓库默认使用标明来源的本地演示引擎，不需要凭据。接入 MiniMax 时：

```bash
cp .env.example .env.local
```

然后只在 `.env.local` 中填写：

```text
MINIMAX_API_KEY=你的密钥
```

`.env.local` 已被 Git 忽略。密钥由 Vite/Node 服务端读取，不会进入浏览器
bundle。开发使用 `npm run dev`；构建后的完整 Node 服务使用：

```bash
npm run build
npm run serve
```

`npm run serve` 同时提供 Web 页面、Agent API 和手机/电脑共享演示房间。
当前房间保存在单个服务进程内存中，适合路演，不是生产持久化数据库。

本地手机联调时，让手机和电脑连接同一个 Wi-Fi，运行 `npm run dev`，
再用手机打开终端中显示的 `Network` 地址。电脑与手机必须访问同一台服务，
两端才会进入同一个演示房间；手机不能使用电脑的 `localhost` 地址。
