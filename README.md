# 象棋古谱学习应用

一个基于 Next.js 和 React 的象棋古谱学习应用，模仿 xqipu.com 网站，支持棋谱学习、练习模式和变化演示。

## 功能特性

- 📚 **经典古谱**: 内置橘中秘、梅花谱等经典象棋古谱
- 🎮 **动画演示**: 在虚拟棋盘上逐步演示每一个招法
- 🎯 **练习模式**: 交互式练习，验证你的招法并给出提示
- ⌨️ **快捷键支持**: 空格键播放/暂停，方向键控制步数
- 🔍 **云库分析**: 集成 ChessDB API 进行局面分析
- 📱 **响应式设计**: 适配桌面端和移动端设备
- 💾 **导入导出**: 支持 JSON 格式的棋谱导入导出
- ⏯️ **播放控制**: 支持播放、暂停、上一步、下一步操作
- 🎨 **精美UI**: 使用 Tailwind CSS 打造的现代化界面

## 技术栈

- **框架**: Next.js 14
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **图标**: Lucide React
- **API**: ChessDB 云库 API
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

## 部署到 Vercel

### 方法一：使用 Vercel CLI

1. 安装 Vercel CLI
```bash
npm install -g vercel
```

2. 在项目根目录运行
```bash
vercel
```

3. 按照提示完成部署配置

### 方法二：通过 GitHub 自动部署

1. 将代码推送到 GitHub 仓库
2. 在 [Vercel](https://vercel.com) 上登录并导入项目
3. Vercel 会自动检测 Next.js 项目并进行部署
4. 每次推送到主分支时会自动重新部署

### 环境变量（可选）

如果需要配置特定的 API 端点或其他设置，可以在 Vercel 控制台中设置环境变量。

## 项目结构

```
xiangqi-tutor/
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   │   └── chessdb/       # ChessDB API 代理
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 首页
├── components/            # React 组件
│   └── XiangqiTutor.tsx  # 主应用组件
├── lib/                   # 工具库
│   └── manuals.ts         # 棋谱数据
├── public/               # 静态资源
├── next.config.js        # Next.js 配置
├── tailwind.config.js    # Tailwind CSS 配置
├── tsconfig.json         # TypeScript 配置
├── vercel.json          # Vercel 部署配置
└── package.json         # 项目配置
```

## 使用说明

### 基本功能
1. **选择棋谱**: 从下拉菜单中选择经典古谱和变化
2. **观看演示**: 点击播放按钮观看棋局的逐步演示
3. **控制播放**: 使用播放控制按钮来暂停、回退或快进
4. **跳转步数**: 点击招法列表中的任意步骤直接跳转

### 练习模式
1. **启用练习**: 点击"练习模式"按钮
2. **输入招法**: 在输入框中输入招法（如：炮二平五）或点击棋子进行移动
3. **获得反馈**: 系统会验证你的招法并给出提示

### 快捷键
- **空格键**: 播放/暂停演示
- **←/→**: 上一步/下一步
- **R**: 重置棋盘
- **P**: 切换练习模式

### 云库分析
- 点击"分析当前局面"按钮可获得当前棋局的专业分析

### 导入导出
- **导入**: 支持导入 JSON 格式的棋谱文件
- **导出**: 将当前选择的古谱导出为 JSON 文件

## API 集成

### ChessDB 云库
应用集成了 ChessDB 云库 API，提供：
- 局面分析和评估
- 最佳招法建议
- 开局库查询

API 端点：`/api/chessdb`

参数：
- `fen`: FEN 格式的棋局字符串（用于分析）
- `gameId`: 棋谱 ID（用于加载棋谱）

## 贡献

欢迎提交 Issues 和 Pull Requests 来改进这个项目。

## 许可证

MIT License