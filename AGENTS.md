# AGENTS.md - Hello World Vue 示例插件协作规范

## 插件定位

- 本仓库是 AIO Hub 的独立 JavaScript 示例插件仓库，插件 ID 为 `example-hello-world`。
- 插件类型为 `javascript`，入口由 `manifest.json` 的 `main: index.ts` 指定。
- 主要用途是演示 Vue 单文件组件、Vite HMR、JS 插件生命周期和 Agent 可调用方法元数据。

## 关键文件

- `manifest.json` 是插件 ID、入口、host 版本和 UI 组件的事实来源。
- `index.ts` 导出插件对象，实现 `activate`、`getMetadata` 和 `greet`。
- `HelloWorld.vue` 是 UI 入口。
- `build.js` 负责把 TS 入口、Vue UI、manifest 和资源打包到 `dist/` / `dist-ui/`。
- `package.json` 定义 Bun 构建、开发 watch、Vue 构建和清理脚本。

## 实现约束

- 新增或修改 Agent 可调用方法时，必须同步更新 `getMetadata()` 中的 `methods`，保持参数名、`agentCallable` 和返回类型清晰。
- `manifest.json` 的 `main` 指向源码入口，`package.json` 的 `main` 指向构建产物；不要混淆。
- 构建产物 `index.js` 由脚本生成，不要把手工逻辑只写进产物。
- 示例应保持简洁，避免把复杂业务模式塞进 Hello World。

## 命令

- 安装依赖使用 Bun。
- 构建插件：`bun run build`
- 构建 TS 入口：`bun run build:ts`
- Vue UI 构建：`bun run build:vue`
- 打包：`bun run package`
- 开发 watch：`bun run dev`
- 清理：`bun run clean`
- Vue UI 构建时，`vite.config.js` 的 `rollupOptions.output` 需配置 `codeSplitting: false`（Vite 8 / Rolldown 推荐写法），禁用代码分割，消灭分块 JS，彻底解决相对路径加载问题。

本仓库是独立 Git 仓库，提交应在本目录内完成。

## 验证重点

- TS 或方法元数据改动至少运行 `bun run build:ts` 或 `bun run build`。
- UI 改动至少运行 `bun run build:vue` 或 `bun run build`。
- 生命周期和 Agent 调用能力需要在 AIO Hub 插件宿主中验证；普通浏览器只能看静态 UI 外观。

