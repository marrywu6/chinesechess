# 象棋古谱学习应用

一个基于 Next.js 和 React 的象棋古谱学习应用，支持拍照上传棋谱图片，自动识别并生成动画演示。

## 功能特性

- 📷 **智能识别**: 支持拍照或上传棋谱图片，AI 自动识别棋谱内容
- 🎮 **动画演示**: 在虚拟棋盘上逐步演示每一个招法
- ⏯️ **播放控制**: 支持播放、暂停、上一步、下一步操作
- 📱 **响应式设计**: 适配桌面端和移动端设备
- 🎨 **精美UI**: 使用 Tailwind CSS 打造的现代化界面

## 技术栈

- **框架**: Next.js 14
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **图标**: Lucide React
- **部署**: Vercel

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
npm run build
```

## 项目结构

```
xiangqi-tutor/
├── app/                    # Next.js App Router
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 首页
├── components/            # React 组件
│   └── XiangqiTutor.tsx  # 主应用组件
├── public/               # 静态资源
├── next.config.js        # Next.js 配置
├── tailwind.config.js    # Tailwind CSS 配置
├── tsconfig.json         # TypeScript 配置
├── vercel.json          # Vercel 部署配置
└── package.json         # 项目配置
```

## 部署到 Vercel

1. 将代码推送到 GitHub 仓库
2. 在 [Vercel](https://vercel.com) 上导入项目
3. Vercel 会自动检测 Next.js 项目并进行部署

或者使用 Vercel CLI：

```bash
npm install -g vercel
vercel
```

## 使用说明

1. **上传棋谱**: 点击"拍照上传"或"选择文件"按钮上传棋谱图片
2. **自动识别**: 系统会自动分析棋谱内容并解析招法序列
3. **观看演示**: 在虚拟棋盘上观看棋局的逐步演示
4. **控制播放**: 使用播放控制按钮来暂停、回退或快进
5. **学习研究**: 点击招法列表中的任意步骤直接跳转

## 贡献

欢迎提交 Issues 和 Pull Requests 来改进这个项目。

## 许可证

MIT License