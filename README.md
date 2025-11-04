# Hello World Vue 插件

这是一个使用 Vue 单文件组件 (`.vue`) 开发的示例插件。

## 特性

- ✅ **使用 .vue 文件开发** - 无需手动编译，直接写 Vue SFC
- ✅ **享受 Vite HMR** - 修改代码后自动热重载
- ✅ **Element Plus 支持** - 直接使用 UI 组件库
- ✅ **TypeScript 支持** - 完整的类型检查
- ✅ **样式隔离** - 使用 `<style scoped>`

## 文件结构

```
example-hello-world/
├── HelloWorld.vue    # Vue 单文件组件（UI）
├── index.ts          # 插件逻辑（后端方法）
├── manifest.json     # 插件清单
└── README.md         # 说明文档
```

## 开发体验对比

### 旧方式（手动编译）

```javascript
// 需要使用 h() 函数手写组件
import { h, ref } from 'vue';

export default {
  setup() {
    const name = ref('');
    return () => h('div', [
      h('input', {
        value: name.value,
        onInput: (e) => { name.value = e.target.value; }
      })
    ]);
  }
};
```

### 新方式（Vue SFC）

```vue
<template>
  <div>
    <el-input v-model="name" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
const name = ref('');
</script>

<style scoped>
/* 样式隔离 */
</style>
```

## 使用方法

1. 将插件文件夹放在 `/plugins/` 目录
2. 启动应用（`npm run dev`）
3. 插件会自动加载并支持热重载
4. 在侧边栏找到 "Hello World Vue" 工具

## 技术说明

- **开发模式**：通过 Vite 的 `import.meta.glob` 扫描 `.vue` 文件，享受 HMR
- **生产模式**：需要提前编译为 `.js` 文件（未来可能支持自动编译）

## 最佳实践

1. 使用 `<script setup>` 简化代码
2. 使用 Element Plus 组件保持风格统一
3. 使用 CSS 变量适配主题
4. 导入主应用的 composables 复用功能

## 相关文档

- [插件 UI 开发指南](../../docs/plugin-ui-development-guide.md)
- [插件开发指南](../../docs/plugin-development-guide.md)