# Hello World Vue 插件

> [!NOTE]
> **本插件是 [AIO Hub](https://github.com/miaotouy/aio-hub) 的插件示例。**

这是一个使用 Vue 单文件组件开发的示例插件，展示如何享受 Vite HMR。

## 功能特性

- ✅ 使用 `.vue` 单文件组件
- ✅ 支持 Vite HMR 热重载
- ✅ 可以直接使用 `<template>` 语法
- ✅ 支持 Element Plus 组件库
- ✅ 完整的开发到生产构建流程

## 开发模式

在开发模式下，插件无需构建即可使用：

```bash
# 将插件放在主应用的 plugins/ 目录下
# 启动主应用
npm run dev
```

插件会自动加载，修改代码后会立即生效（HMR）。

## 构建插件

### 前置要求

```bash
# 安装依赖
bun install
```

### 构建步骤

```bash
# 仅构建（不打包）
bun run build

# 构建并打包成 ZIP
bun run package
```

构建过程会：
1. 使用 Bun 编译 `index.ts` → `index.js`
2. 使用 Vite 编译 `HelloWorld.vue` → `HelloWorld.js`
3. 自动修改 `manifest.json` 中的组件路径（`.vue` → `.js`）
4. 将所有文件打包到 `dist/` 目录
5. （可选）创建 ZIP 压缩包用于分发

### 输出结构

```
dist/
├── manifest.json       # 自动修改后的清单（component: "HelloWorld.js"）
├── index.js           # 编译后的插件逻辑
├── HelloWorld.js      # 编译后的 UI 组件
└── README.md          # 说明文档
```

## 文件说明

- `manifest.json` - 插件清单（开发模式使用 `.vue`）
- `index.ts` - 插件核心逻辑
- `HelloWorld.vue` - UI 组件（开发模式）
- `vite.config.js` - Vue 组件构建配置
- `build.js` - 完整构建脚本
- `tsconfig.json` - TypeScript 配置

## 插件方法

### `greet(params)`
返回问候消息。

**参数**：
- `name` (string): 名字

**返回**: `Promise<string>`

## 技术栈

- TypeScript
- Vue 3 (Composition API)
- Element Plus
- Bun (TypeScript 编译)
- Vite (Vue 组件编译)

## 许可证

MIT