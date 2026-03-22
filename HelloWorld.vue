<template>
  <div class="hello-world-container">
    <!-- 标题卡片 -->
    <el-card shadow="never">
      <div class="header">
        <h2>🎉 Hello World Vue 插件</h2>
        <p class="subtitle">这是一个使用 .vue 文件开发的插件示例，支持 Vite HMR</p>
      </div>
    </el-card>

    <!-- 输入区域 -->
    <el-card shadow="never">
      <div class="input-section">
        <label>输入你的名字：</label>
        <el-input
          v-model="name"
          placeholder="请输入名字..."
          @keyup.enter="greet"
        />
      </div>
    </el-card>

    <!-- 操作按钮 -->
    <div class="actions">
      <el-button
        type="primary"
        :loading="loading"
        :disabled="!name.trim()"
        @click="greet"
      >
        打招呼
      </el-button>
      <el-button @click="clearGreeting">
        清空
      </el-button>
    </div>

    <!-- 错误提示 -->
    <el-alert
      v-if="error"
      type="error"
      :title="error"
      closable
      @close="error = ''"
    />

    <!-- 问候结果 -->
    <el-card v-if="greeting" shadow="never" class="result-card">
      <div class="greeting-result">
        <p class="greeting-text">{{ greeting }}</p>
        <el-button
          size="small"
          :icon="CopyDocument"
          @click="copyGreeting"
        >
          复制
        </el-button>
      </div>
    </el-card>

    <!-- 提示信息 -->
    <el-card shadow="never">
      <div class="tips">
        <div class="tip-title">💡 特性说明</div>
        <ul>
          <li>✅ 使用 Vue 单文件组件 (.vue) 开发</li>
          <li>✅ 享受 Vite 提供的 HMR 热重载</li>
          <li>✅ 支持 Element Plus 组件库</li>
          <li>✅ 可以直接使用 &lt;template&gt; 语法</li>
          <li>✅ 支持 &lt;style scoped&gt; 样式隔离</li>
        </ul>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { CopyDocument } from '@element-plus/icons-vue';
import { execute, customMessage } from 'aiohub-sdk';
import { writeText } from '@tauri-apps/plugin-clipboard-manager';

const name = ref('');
const greeting = ref('');
const error = ref('');
const loading = ref(false);

// 打招呼
const greet = async () => {
  if (!name.value.trim()) {
    error.value = '请输入名字';
    return;
  }

  error.value = '';
  loading.value = true;

  try {
    const result = await execute({
      service: 'example-hello-world',
      method: 'greet',
      params: { name: name.value }
    });

    if (result.success) {
      greeting.value = result.data;
      customMessage.success('打招呼成功！');
    } else {
      error.value = result.error?.message || '打招呼失败';
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : '打招呼失败';
  } finally {
    loading.value = false;
  }
};

// 复制问候语
const copyGreeting = async () => {
  if (!greeting.value) return;

  try {
    await writeText(greeting.value);
    customMessage.success('已复制到剪贴板');
  } catch (err) {
    error.value = '复制失败';
  }
};

// 清空
const clearGreeting = () => {
  name.value = '';
  greeting.value = '';
  error.value = '';
};
</script>

<style scoped>
.hello-world-container {
  height: 100%;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow: auto;
}

.header h2 {
  font-size: 20px;
  font-weight: bold;
  margin: 0 0 8px 0;
}

.subtitle {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  margin: 0;
}

.input-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.input-section label {
  font-size: 14px;
  font-weight: 500;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.result-card {
  background: var(--el-fill-color-light);
}

.greeting-result {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

.greeting-text {
  font-size: 18px;
  font-weight: 500;
  color: var(--el-color-primary);
  margin: 0;
  text-align: center;
}

.tips {
  font-size: 13px;
  color: var(--el-text-color-secondary);
  line-height: 1.8;
}

.tip-title {
  font-weight: 500;
  margin-bottom: 8px;
  color: var(--el-text-color-primary);
}

.tips ul {
  margin: 0;
  padding-left: 20px;
}

.tips li {
  margin: 4px 0;
}
</style>