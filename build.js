/**
 * JavaScript 插件构建脚本
 * 用于编译 TypeScript 和 Vue 组件并打包成插件包
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import archiver from 'archiver';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 解析命令行参数
const args = process.argv.slice(2);

console.log('🔨 构建 JavaScript 插件: example-hello-world');
console.log('');

// 编译 TypeScript (使用 Bun)
function buildTypeScript() {
  console.log('📦 编译 TypeScript...');
  
  try {
    execSync('bun build index.ts --outfile=dist/index.js --target=browser --format=iife', {
      stdio: 'inherit',
      cwd: __dirname
    });
    
    console.log('✅ TypeScript 编译完成');
    return true;
  } catch (error) {
    console.error('❌ TypeScript 编译失败:', error.message);
    return false;
  }
}

// 编译 Vue 组件
function buildVueComponent() {
  console.log('📦 编译 Vue 组件...');
  
  try {
    execSync('vite build', { 
      stdio: 'inherit',
      cwd: __dirname 
    });
    
    console.log('✅ Vue 组件编译完成');
    return true;
  } catch (error) {
    console.error('❌ Vue 组件编译失败:', error.message);
    return false;
  }
}

// 打包插件
function packagePlugin() {
  console.log('');
  console.log('📦 打包插件...');

  const distDir = path.join(__dirname, 'dist');

  // 检查编译后的 index.js 是否存在，它应该已由 buildTypeScript() 创建
  const indexJsPath = path.join(distDir, 'index.js');
  if (!fs.existsSync(indexJsPath)) {
    console.error('❌ 找不到编译后的 index.js 文件');
    process.exit(1);
  }
  console.log('   ✓ 发现 index.js');

  // 处理 manifest 并验证 Vue 组件
  const manifestPath = path.join(__dirname, 'manifest.json');
  const manifestContent = fs.readFileSync(manifestPath, 'utf-8');
  const manifest = JSON.parse(manifestContent);

  // 验证 Vue 组件是否已编译到 dist 目录
  if (manifest.ui && manifest.ui.component) {
    const componentFileName = manifest.ui.component; // e.g., "HelloWorld.vue"
    const componentBaseName = path.basename(componentFileName, '.vue'); // e.g., "HelloWorld"
    const componentJsName = `${componentBaseName}.js`; // e.g., "HelloWorld.js"
    
    const componentJsPath = path.join(distDir, componentJsName);
    if (!fs.existsSync(componentJsPath)) {
      console.error(`❌ 找不到编译后的 ${componentJsName} 文件`);
      process.exit(1);
    }
    console.log(`   ✓ 发现 ${componentJsName}`);

    // 修改 manifest 内容中的组件路径，准备写入 dist
    manifest.ui.component = componentJsName;
  }
  
  // 写入处理后的 manifest.json
  fs.writeFileSync(
    path.join(distDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  console.log('   ✓ 复制并处理 manifest.json');

  // 复制 README（如果存在）
  const readmePath = path.join(__dirname, 'README.md');
  if (fs.existsSync(readmePath)) {
    fs.copyFileSync(readmePath, path.join(distDir, 'README.md'));
    console.log('   ✓ 复制 README.md');
  }

  console.log('');
  console.log(`✅ 插件已打包到: ${distDir}`);
  console.log('');
  console.log('📁 包结构:');
  console.log('   example-hello-world/');
  fs.readdirSync(distDir).forEach(file => {
    console.log(`   ├── ${file}`);
  });
  
  return distDir;
}

// 创建 ZIP 压缩包
async function createZipArchive(distDir) {
  console.log('');
  console.log('🗜️  创建 ZIP 压缩包...');

  const manifest = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'manifest.json'), 'utf-8')
  );
  
  const pluginId = manifest.id;
  const version = manifest.version;
  const zipFileName = `${pluginId}-v${version}.zip`;
  const zipPath = path.join(__dirname, zipFileName);

  // 删除旧的 zip 文件
  if (fs.existsSync(zipPath)) {
    fs.unlinkSync(zipPath);
    console.log(`   ✓ 删除旧版本: ${zipFileName}`);
  }

  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', {
      zlib: { level: 9 } // 最高压缩级别
    });

    output.on('close', () => {
      const sizeInKB = (archive.pointer() / 1024).toFixed(2);
      console.log(`   ✓ 压缩包大小: ${sizeInKB} KB`);
      console.log('');
      console.log(`✅ 发布包已创建: ${zipFileName}`);
      console.log(`   路径: ${zipPath}`);
      resolve(zipPath);
    });

    archive.on('error', (err) => {
      reject(err);
    });

    archive.pipe(output);

    // 将 dist/ 目录的内容打包（不包含 dist/ 本身）
    archive.directory(distDir, false);

    archive.finalize();
  });
}

// 主流程
async function main() {
  // 清理旧的构建产物
  console.log('🧹 清理旧的构建产物...');
  const distDir = path.join(__dirname, 'dist');
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true });
  }
  const distUiDir = path.join(__dirname, 'dist-ui');
  if (fs.existsSync(distUiDir)) {
    fs.rmSync(distUiDir, { recursive: true });
  }
  const rootIndexJs = path.join(__dirname, 'index.js');
  if (fs.existsSync(rootIndexJs)) {
    fs.unlinkSync(rootIndexJs);
  }
  console.log('✅ 清理完成');
  console.log('');

  // 编译 TypeScript
  const tsSuccess = buildTypeScript();
  if (!tsSuccess) {
    process.exit(1);
  }

  // 编译 Vue 组件
  const vueSuccess = buildVueComponent();
  if (!vueSuccess) {
    process.exit(1);
  }

  // 打包插件
  if (args.includes('--package')) {
    const distDir = packagePlugin();
    await createZipArchive(distDir);
  }
}

main().catch(error => {
  console.error('构建失败:', error);
  process.exit(1);
});