# 🐱 猫猫导航 (Mao Nav)

> 一个简洁美观的个人导航网站，支持分类管理和自定义收藏夹

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vue](https://img.shields.io/badge/Vue-3.5.17-4FC08D?logo=vue.js)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.10-646CFF?logo=vite)](https://vitejs.dev/)
[![Cloudflare](https://img.shields.io/badge/Deploy-Cloudflare%20Pages-F38020?logo=cloudflare)](https://pages.cloudflare.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel)](https://vercel.com/)
[![EdgeOne](https://img.shields.io/badge/Deploy-EdgeOne%20Pages-006EFF)](https://edgeone.ai/pages/)

## 效果预览
示例站点：[猫猫导航](https://nav.maodeyu.fun)

![](preview.png)

## ✨ 特性

- 🎨 **现代化设计** - 简洁美观的界面，支持响应式布局
- 📱 **多设备适配** - 完美支持桌面端、平板和移动端
- 🔥 **分类管理** - 支持自定义分类和网站管理
- ⚡ **快速访问** - 基于 Vue 3 + Vite 构建，加载速度极快
- 🌐 **多平台部署** - 支持 Cloudflare Pages、Vercel 和 EdgeOne Pages
- 🛠️ **易于定制** - 简单的配置即可个性化你的导航
- 👨‍💻 **管理界面** - 可选配置管理员界面，支持可视化添加/编辑分类和网站
- 🔒 **安全架构** - 管理员密钥和 GitHub Token 存储在服务端，前端代码不包含任何敏感信息
- 🧾 **备案信息** - 可在管理后台配置 ICP 备案号，默认显示在网站底部

## 🚀 快速开始

图文教程：[猫猫导航部署教程](https://blog.maodeyu.fun/2025/07/16/nav_mao/)

> 💬 部署遇到问题？欢迎加入 QQ 交流群：**494775899**。

### 1. 先选择使用方式

| 使用方式 | 是否需要环境变量 | 是否可用 `/admin` | 适合场景 |
|---|---|---|---|
| 仅展示导航首页 | 否 | 否 | 直接修改 `src/mock/mock_data.js` 后部署 |
| 完整版（推荐） | 是 | 是 | 在管理后台可视化编辑，并保存到 GitHub |

下面默认按“完整版”说明，当前一键部署按钮也按完整版预填变量。只需要静态首页的用户无需创建 Token，请直接参考[手动部署](#5-手动部署)，并跳过环境变量配置。

### 2. 部署前准备（完整版必读）

#### 2.1 准备 GitHub 仓库

管理后台会把修改写回 GitHub，因此部署关联的仓库必须属于你，并且 `GITHUB_TOKEN` 对它有写权限。

- **手动部署**：先点击 GitHub 页面右上角的 **Fork**，将项目 Fork 到自己的账号。
- **一键部署**：Vercel 会在授权后创建一份源码仓库；EdgeOne Pages 是否自动创建 Fork 取决于平台当前流程，请确认最终关联的是你有写权限的仓库。

> Fine-grained Token 只能选择已经存在的仓库。如果一键部署流程尚未创建目标仓库，可以先完成“创建/导入仓库”，停留在环境变量页面；在新标签页生成 Token 后，再回来继续部署。

#### 2.2 获取 GitHub Token

1. 打开 [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)。
2. 选择 **Fine-grained tokens** → **Generate new token**。
3. 设置名称和过期时间；在 **Repository access** 中只选择实际用于部署的仓库。
4. 在 **Repository permissions** 中设置：
   - `Contents`：**Read and write**
   - `Metadata`：**Read**
5. **Account permissions** 不需要添加任何权限。
6. 生成并立即复制 Token。GitHub 只会完整显示一次。

#### 2.3 准备环境变量

完整版部署需要前 5 个变量；`VITE_OPEN_LOCK` 是额外的可选开关：

| 变量名 | 是否必填 | 填写内容 | 是否敏感 |
|---|---|---|---|
| `ADMIN_PASSWORD` | 是 | 你自己设置的管理后台密码 | 是 |
| `GITHUB_TOKEN` | 是 | 上一步生成的 Fine-grained Token | 是 |
| `VITE_GITHUB_OWNER` | 是 | 目标仓库所有者，例如你的 GitHub 用户名 | 否 |
| `VITE_GITHUB_REPO` | 是 | 目标仓库名称；一键部署默认 `mao-nav`，手动 Fork 通常为 `mao_nav`，以实际名称为准 | 否 |
| `VITE_GITHUB_BRANCH` | 否 | 保存数据的分支，默认 `master` | 否 |
| `VITE_OPEN_LOCK` | 否 | 填写任意非空值后，访问首页也需要验证密码 | 否 |

示例：

```dotenv
ADMIN_PASSWORD=请设置一个强密码
GITHUB_TOKEN=github_pat_xxxxxxxxxxxx
VITE_GITHUB_OWNER=your-github-name
VITE_GITHUB_REPO=mao-nav
VITE_GITHUB_BRANCH=master
```

其中 `ADMIN_PASSWORD` 和 `GITHUB_TOKEN` 只供服务端 Functions 使用，不要添加 `VITE_` 前缀，也不要写进源码、`.env` 或构建日志。请在平台中按密钥保存：

- Cloudflare Pages：使用加密变量。
- Vercel：勾选 **Sensitive**。
- EdgeOne Pages：添加到项目的服务端环境变量中。

`VITE_GITHUB_*` 是构建时公开配置，浏览器中可以看到，但它们只包含仓库名称等公开信息，不应放入任何密码或 Token。

### 3. 一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmaodeyu180%2Fmao_nav&env=ADMIN_PASSWORD%2CGITHUB_TOKEN%2CVITE_GITHUB_OWNER%2CVITE_GITHUB_REPO%2CVITE_GITHUB_BRANCH&envDefaults=%7B%22VITE_GITHUB_REPO%22%3A%22mao-nav%22%2C%22VITE_GITHUB_BRANCH%22%3A%22master%22%7D&project-name=mao-nav&repository-name=mao-nav)

[![使用 EdgeOne Pages 部署](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://edgeone.ai/pages/new?repository-url=https%3A%2F%2Fgithub.com%2Fmaodeyu180%2Fmao_nav&repository-name=mao-nav&project-name=mao-nav&build-command=npm%20run%20build&install-command=npm%20ci&output-directory=dist&env=ADMIN_PASSWORD%2CGITHUB_TOKEN%2CVITE_GITHUB_OWNER%2CVITE_GITHUB_REPO%2CVITE_GITHUB_BRANCH)

1. 点击对应平台的部署按钮并登录。
2. 授权平台创建或导入 Git 仓库。
3. 在环境变量页面填写上一节准备好的 5 个变量。
4. 再次确认 `VITE_GITHUB_OWNER`、`VITE_GITHUB_REPO` 与平台最终创建或关联的仓库完全一致。
5. 开始部署。

Vercel 会克隆源码并创建项目；EdgeOne Pages 会预填仓库和构建参数。需要使用管理后台时，两种方式都必须确认 Token 对最终关联的仓库具有 `Contents: Read and write` 权限。

> “一键部署”是指自动复制/导入项目并填写构建配置，GitHub Token 和管理员密码仍必须由用户本人创建，平台无法代替用户生成。

### 4. 平台兼容性

| 平台 | 导航首页 | 管理后台 | 服务端函数目录 | 部署方式 |
|---|---|---|---|---|
| Cloudflare Pages | ✅ | ✅ | `functions/` | 连接 Git 仓库 |
| Vercel | ✅ | ✅ | `api/` | 一键克隆 / 连接 Git 仓库 |
| EdgeOne Pages | ✅ | ✅ | `cloud-functions/` | 一键导入 / 连接 Git 仓库 |

三个平台的构建命令都是 `npm run build`，产物目录都是 `dist`。

### 5. 手动部署

手动部署前请先 Fork 本项目。部署完整版还需完成第 2 节的 Token 和环境变量准备；只部署静态首页时可以跳过。

#### Cloudflare Pages

1. 打开 [Cloudflare Dashboard](https://dash.cloudflare.com)，进入 **Workers & Pages**。
2. 选择 **Create application** → **Pages** → **Connect to Git**。
3. 授权 GitHub，并选择你的 Fork。
4. 设置构建参数：
   - Framework preset：`Vue`
   - Build command：`npm run build`
   - Build output directory：`dist`
5. 添加环境变量，然后点击 **Save and Deploy**。

#### EdgeOne Pages

1. 打开 [EdgeOne Pages](https://edgeone.ai/pages/)，选择 **导入 Git 仓库**。
2. 授权 GitHub，并选择你的 Fork。
3. 项目中的 `edgeone.json` 已配置 `npm ci`、`npm run build` 和 `dist`，通常无需修改。
4. 添加环境变量，确认后开始部署。

`cloud-functions/api/verify.js` 和 `cloud-functions/api/github.js` 会生成管理后台所需的 `/api/verify` 与 `/api/github`。

#### Vercel

1. 打开 [Vercel](https://vercel.com/)，选择 **Add New** → **Project**。
2. 导入你的 Fork。
3. Vercel 通常会自动识别 Vite；请确认 Build Command 为 `npm run build`，Output Directory 为 `dist`。
4. 添加环境变量，然后点击 **Deploy**。

### 6. 部署完成后

- 访问站点首页确认导航正常。
- 访问 `https://你的域名/admin`，使用 `ADMIN_PASSWORD` 登录并测试保存。
- 如需自定义域名，在对应平台的项目域名设置中添加，并按提示配置 DNS。
- 后续向生产分支推送代码，平台会自动触发重新部署。

> 不要只上传 `dist` 部署完整版。这样不会包含服务端 Functions，`/admin` 将无法登录或保存数据。

## 💻 本地开发

1. **克隆项目**

```bash
git clone https://github.com/your-username/mao_nav.git
cd mao_nav
```

2. **安装依赖**

```bash
npm install
```

3. **配置环境变量**

创建 `.env` 文件（前端变量）：

```dotenv
VITE_GITHUB_OWNER=your_github_username
VITE_GITHUB_REPO=mao_nav
VITE_GITHUB_BRANCH=master
```

测试 Cloudflare Functions 时，创建 `.dev.vars` 文件（不要提交）：

```dotenv
ADMIN_PASSWORD=your_password
GITHUB_TOKEN=your_github_token
```

4. **启动开发服务器**

纯前端开发（不含 Functions）：

```bash
npm run dev
```

完整本地测试（含 Functions，需安装 wrangler）：

```bash
npm run build && npx wrangler pages dev dist
```

测试 EdgeOne Cloud Functions：

```bash
npx edgeone makers dev
```

### 常用命令

```bash
npm run dev      # 启动开发服务器
npm run build    # 构建生产版本
npm run preview  # 预览生产构建
npm run lint     # 代码检查并自动修复
```

## 📁 项目结构

```
mao_nav/
├── src/
│   ├── apis/           # API 接口
│   ├── assets/         # 静态资源（图片、样式等）
│   ├── components/     # Vue 组件
│   ├── mock/           # 模拟数据
│   ├── router/         # 路由配置
│   ├── stores/         # Pinia 状态管理
│   ├── views/          # 页面组件
│   ├── App.vue         # 根组件
│   └── main.js         # 入口文件
├── functions/           # Cloudflare Pages Functions (服务端)
│   └── api/
│       ├── verify.js    # 管理员密钥验证
│       └── github.js    # GitHub API 代理
├── api/                 # Vercel Serverless Functions (服务端)
│   ├── verify.js        # 管理员密钥验证
│   └── github.js        # GitHub API 代理
├── cloud-functions/     # EdgeOne Pages Cloud Functions (服务端)
│   └── api/
│       ├── verify.js    # 管理员密钥验证
│       └── github.js    # GitHub API 代理
├── public/              # 公共静态文件
├── index.html           # HTML 模板
├── package.json         # 项目配置
├── vite.config.js       # Vite 配置
├── vercel.json          # Vercel 部署配置
└── edgeone.json         # EdgeOne Pages 部署配置
```

## 🎯 自定义配置

### 修改导航数据

有两种方式来自定义你的导航分类和网站：

**方式1：直接编辑文件（推荐）**
编辑 `src/mock/mock_data.js` 文件来自定义你的导航分类和网站：

```javascript
export const mockData = {
  categories: [
    {
      id: "my-favorites",
      name: "我的常用",
      icon: "💥",
      order: 0,
      sites: [
        {
          id: "example",
          name: "示例网站",
          url: "https://example.com",
          description: "网站描述",
          icon: "https://example.com/favicon.ico"
        }
      ]
    }
  ],
  title: "我的导航",
  search: "bing",
  icp: "京ICP备12345678号-1"
}
```

`icp` 留空时不显示备案信息；填写后会默认显示在页面底部，并链接到工信部备案管理系统。也可以进入 `/admin` → **系统设置** 在线修改或清空备案号。

**方式2：使用管理员界面（可选）**
如果你配置了管理员界面（见上方配置说明），可以通过以下步骤可视化管理：

1. 访问 `https://your-domain.com/admin`
2. 输入管理员密钥登录
3. 在界面中添加、编辑或删除分类和网站
4. 点击"保存到GitHub"按钮保存更改
5. 系统会自动在 2-3 分钟内重新部署

### 自定义样式

- 主要样式文件：`src/assets/main.css`
- 基础样式：`src/assets/base.css`


## ✅ 上线前检查

在部署前请检查：

- [ ] 已修改 `src/mock/mock_data.js` 为你的个人数据
- [ ] 如需管理后台，Token 仅授权实际部署仓库的 `Contents: Read and write`
- [ ] 已在平台配置 `ADMIN_PASSWORD` 和 `GITHUB_TOKEN`，并按敏感变量保存
- [ ] `VITE_GITHUB_OWNER`、`VITE_GITHUB_REPO`、`VITE_GITHUB_BRANCH` 与实际仓库一致
- [ ] 已测试构建命令 `npm run build`
- [ ] 部署后已验证首页、`/admin` 登录和保存功能

## 🔄 从 v1.x 升级到 v2.0

> 仅老用户（v1.x 已部署）需要看这一节，新用户可以跳过。

v2.0 将敏感密钥（管理员密码、GitHub Token）从前端迁移到了服务端 Functions，**前端代码不再包含任何敏感信息**。

### 升级步骤

**1. 同步代码**

```bash
# 如果你 fork 了本项目，同步上游代码
git fetch upstream
git merge upstream/master
```

**2. 修改部署平台的环境变量**

在 Cloudflare Pages / Vercel / EdgeOne Pages 的环境变量设置中：

| 操作 | 变量名 | 说明 |
|---|---|---|
| **新增** | `ADMIN_PASSWORD` | 值与原来的 `VITE_ADMIN_PASSWORD` 一致，**设置为 Encrypted 类型** |
| **新增** | `GITHUB_TOKEN` | 值与原来的 `VITE_GITHUB_TOKEN` 一致，**设置为 Encrypted 类型** |
| **保留** | `VITE_GITHUB_OWNER` | 不变 |
| **保留** | `VITE_GITHUB_REPO` | 不变 |
| **保留** | `VITE_GITHUB_BRANCH` | 不变 |
| **删除** | `VITE_ADMIN_PASSWORD` | 已迁移到服务端，不再需要 |
| **删除** | `VITE_GITHUB_TOKEN` | 已迁移到服务端，不再需要 |

**3. 重新部署**

修改环境变量后，触发一次重新部署即可。

> **注意**：如果你不删除旧的 `VITE_` 密钥变量，它们仍会被打包到前端代码中。请务必删除 `VITE_ADMIN_PASSWORD` 和 `VITE_GITHUB_TOKEN`。

## 🛠️ 更新记录

- 2025-03-25 **v2.0.0** 安全架构升级：密钥迁移至服务端 Functions，同时支持 Cloudflare Pages 和 Vercel 部署。
- 2025-07-15 完善 Logo 自动获取流程。
- 2025-07-16 修复 Admin 管理后台编辑问题，优化编辑逻辑。
- 2025-07-17 增加网站名称和站点 Logo 修改，调整移动端排版。
- 2025-07-22 增加站点拖拽排序，优化图标获取。
- 2025-07-30 修复站点展示问题，增加 `VITE_OPEN_LOCK` 首页访问锁定配置。
- 2025-08-11 增加夜间模式和默认搜索引擎设置。
- 2026-07-16 增加备案号配置、EdgeOne Pages 全栈部署适配，以及 Vercel / EdgeOne 一键部署入口。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 📄 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- [LINUX DO](https://linux.do/) - 感谢 LINUX DO 社区的支持与认可
- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [Cloudflare Pages](https://pages.cloudflare.com/) - 现代化的 JAMstack 平台
- [Vercel](https://vercel.com/) - 前端云平台
- [EdgeOne Pages](https://edgeone.ai/pages/) - 边缘全栈部署平台
- [Pinia](https://pinia.vuejs.org/) - Vue.js 状态管理库

## 📞 联系方式

如果你有任何问题或建议，欢迎通过以下方式联系：

- 提交 [Issue](https://github.com/maodeyu180/mao_nav/issues)
- 发起 [Discussion](https://github.com/maodeyu180/mao_nav/discussions)
- 加入 QQ 交流群：**494775899**（部署问题求助 / 使用交流）

---

⭐ 如果这个项目对你有帮助，请给它一个 Star！
