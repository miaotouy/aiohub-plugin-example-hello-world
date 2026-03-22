import { type PluginContext, type ServiceMetadata } from "aiohub-sdk";

interface GreetParams {
  name: string;
}

async function activate(context: PluginContext) {
  console.log("Hello World 插件已激活");
}

async function greet({ name }: GreetParams): Promise<string> {
  return `你好，${name}！欢迎使用 Vue 插件系统 🎉`;
}

/**
 * 获取服务元数据
 */
function getMetadata(): ServiceMetadata {
  return {
    methods: [
      {
        name: "greet",
        displayName: "打招呼",
        description: "向指定的人打招呼",
        agentCallable: true,
        parameters: [
          { name: "name", type: "string", description: "名字", required: true },
        ],
        returnType: "Promise<string>",
      },
    ],
  };
}

export default {
  activate,
  getMetadata,
  greet,
};