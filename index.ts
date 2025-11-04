interface GreetParams {
  name: string;
}

async function greet({ name }: GreetParams): Promise<string> {
  return `你好，${name}！欢迎使用 Vue 插件系统 🎉`;
}

export default {
  greet,
};