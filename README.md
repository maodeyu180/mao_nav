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
- 🧩 **数据隔离** - 用户导航按 GitHub 账号和仓库名独立存储，同步上游代码不会覆盖个人配置
- 🧾 **备案信息** - 可在管理后台配置 ICP 备案号，默认显示在网站底部

## 🚀 快速开始

图文教程：[猫猫导航部署教程](https://blog.maodeyu.fun/2025/07/16/nav_mao/)

> 💬 部署遇到问题？欢迎加入 QQ 交流群：**494775899**。

### 1. 先选择使用方式

| 使用方式 | 是否需要环境变量 | 是否可用 `/admin` | 适合场景 |
|---|---|---|---|
| 仅展示导航首页 | 否 | 否 | 复制默认模板为 `src/mock/user_data.js` 后修改并部署 |
| 完整版（推荐） | 是 | 是 | 在管理后台可视化编辑，并保存到 GitHub |

下面默认按“完整版”说明。只需要静态首页的用户仍需先 Fork，然后可以跳过 Token 和环境变量配置，直接参考[选择平台部署](#4-选择平台部署)。

### 2. Fork 并准备部署参数

#### 2.1 Fork 本项目

管理后台会把修改写回 GitHub，因此部署关联的仓库必须属于你，并且 `GITHUB_TOKEN` 对它有写权限。

1. 点击本项目 GitHub 页面右上角的 **Fork**。
2. Owner 选择你自己的 GitHub 账号。
3. Repository name 可以保留默认的 `mao_nav`，也可以自定义。
4. 点击 **Create fork**，等待仓库创建完成。

后续生成 Token、填写环境变量和部署时，都使用这个 Fork 后的仓库信息。

管理后台首次保存时会在你的 Fork 中创建 `src/mock/user_data/<GitHub账号>__<仓库名>.js`。每个 Fork 的文件名都不同，因此以后同步上游代码不会覆盖个人导航数据。

#### 2.2 获取 GitHub Token（完整版必读）

1. 打开 [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)。
2. 选择 **Fine-grained tokens** → **Generate new token**。
3. 设置名称和过期时间，**Resource owner** 选择 Fork 所在的账号。
4. 在 **Repository access** 中选择 **Only select repositories**，只勾选刚刚 Fork 的仓库，不要选择上游原仓库。
5. 在 **Repository permissions** 中设置：
   - `Contents`：**Read and write**
   - `Metadata`：**Read**
6. **Account permissions** 不需要添加任何权限。
7. 生成并立即复制 Token。GitHub 只会完整显示一次。

#### 2.3 准备环境变量（完整版必读）

完整版部署需要前 5 个变量；`VITE_OPEN_LOCK` 是额外的可选开关：

| 变量名 | 是否必填 | 填写内容 | 是否敏感 |
|---|---|---|---|
| `ADMIN_PASSWORD` | 是 | 你自己设置的管理后台密码 | 是 |
| `GITHUB_TOKEN` | 是 | 上一步生成的 Fine-grained Token | 是 |
| `VITE_GITHUB_OWNER` | 是 | Fork 后的仓库所有者，通常是你的 GitHub 用户名 | 否 |
| `VITE_GITHUB_REPO` | 是 | Fork 后的仓库名称，默认 `mao_nav`；如果 Fork 时改过名称，以实际名称为准 | 否 |
| `VITE_GITHUB_BRANCH` | 否 | 保存数据的分支，默认 `master` | 否 |
| `VITE_OPEN_LOCK` | 否 | 填写任意非空值后，访问首页也需要验证密码 | 否 |

示例：

```dotenv
ADMIN_PASSWORD=请设置一个强密码
GITHUB_TOKEN=github_pat_xxxxxxxxxxxx
VITE_GITHUB_OWNER=your-github-name
VITE_GITHUB_REPO=mao_nav
VITE_GITHUB_BRANCH=master
```

其中 `ADMIN_PASSWORD` 和 `GITHUB_TOKEN` 只供服务端 Functions 使用，不要添加 `VITE_` 前缀，也不要写进源码、`.env` 或构建日志。请在平台中按密钥保存：

- Cloudflare Pages：使用加密变量。
- Vercel：勾选 **Sensitive**。
- EdgeOne Pages：添加到项目的服务端环境变量中。

`VITE_GITHUB_*` 是构建时公开配置，浏览器中可以看到，但它们只包含仓库名称等公开信息，不应放入任何密码或 Token。

### 3. 平台兼容性

| 平台 | 导航首页 | 管理后台 | 服务端函数目录 | 部署方式 |
|---|---|---|---|---|
| Cloudflare Pages | ✅ | ✅ | `functions/` | 导入 Fork 后的仓库 |
| Vercel | ✅ | ✅ | `api/` | 导入 Fork 后的仓库 |
| EdgeOne Pages | ✅ | ✅ | `cloud-functions/` | 导入 Fork 后的仓库 |

三个平台的构建命令都是 `npm run build`，产物目录都是 `dist`。

### 4. 选择平台部署

三个平台都应导入第 2.1 节 Fork 后的仓库。部署完整版还需填写第 2.3 节准备好的环境变量；只部署静态首页时可以跳过环境变量。

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

### 5. 部署完成后

- 访问站点首页确认导航正常。
- 访问 `https://你的域名/admin`，使用 `ADMIN_PASSWORD` 登录并测试保存。
- 第一次保存会自动创建按 GitHub 账号和仓库名隔离的个人导航文件，后续配置都写入该文件。
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
│   ├── mock/
│   │   ├── mock_data.js       # 上游默认数据模板
│   │   ├── navigation_data.js # 优先加载用户数据的入口
│   │   ├── user_data.js       # 静态版用户数据（用户自行创建）
│   │   └── user_data/          # 完整版数据目录（后台首次保存后生成）
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

**方式1：使用管理员界面（推荐）**

部署完整版后访问 `/admin`。第一次点击“保存到 GitHub”会自动创建 `src/mock/user_data/<GitHub账号>__<仓库名>.js`，后续所有导航配置都保存在这个专属文件中。

**方式2：直接编辑文件**

先复制默认模板，再编辑 `src/mock/user_data.js`：

```bash
cp src/mock/mock_data.js src/mock/user_data.js
```

文件内容格式如下：

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

### 自定义样式

- 主要样式文件：`src/assets/main.css`
- 基础样式：`src/assets/base.css`


## ✅ 上线前检查

在部署前请检查：

- [ ] 已通过管理后台生成专属数据文件，或为静态版手动创建 `src/mock/user_data.js`
- [ ] 如需管理后台，Token 仅授权实际部署仓库的 `Contents: Read and write`
- [ ] 已在平台配置 `ADMIN_PASSWORD` 和 `GITHUB_TOKEN`，并按敏感变量保存
- [ ] `VITE_GITHUB_OWNER`、`VITE_GITHUB_REPO`、`VITE_GITHUB_BRANCH` 与实际仓库一致
- [ ] 已测试构建命令 `npm run build`
- [ ] 部署后已验证首页、`/admin` 登录和保存功能

## 🔄 安全同步上游更新

新版本会优先加载 `src/mock/user_data/<GitHub账号>__<仓库名>.js`。如果专属文件尚未创建，会自动读取旧 Fork 原有的 `src/mock/mock_data.js`，所以旧用户不需要提前复制文件或手动迁移。

### 旧版本用户直接同步即可

旧版本的个人导航继续从原来的 `src/mock/mock_data.js` 加载。缺少 `icp` 字段不会报错，系统会将其视为空值；升级后第一次在管理后台保存时，会自动把完整配置和 `icp` 字段写入账号与仓库专属的数据文件。

正常同步上游即可：

```bash
git fetch upstream
git merge upstream/master
git push
```

也可以直接在 GitHub 网页点击 **Sync fork**。从这个版本开始，上游不再修改 `src/mock/mock_data.js`，管理后台也不会再把用户配置写入该文件。

> 如果非常早期的 Fork 因历史上双方都修改过 `mock_data.js` 而出现冲突，GitHub 会停止同步，不会静默覆盖导航数据。不要使用强制同步或 **Discard commits**，这类操作会主动丢弃 Fork 中的个人提交。

## 🔐 从 v1.x 升级到 v2.0

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
- 2026-07-16 增加备案号配置、EdgeOne Pages 全栈部署适配，以及 Vercel / EdgeOne 部署说明。
- 2026-07-16 将个人导航数据迁移到按 GitHub 账号和仓库名隔离的专属文件，避免同步上游时覆盖用户配置。

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
