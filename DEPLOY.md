# 部署指南 (Deployment Guide)

本指南将帮助您将 "Markdown 转 Word" 工具发布到互联网上，供所有人使用。

## 第一步：上传代码到 GitHub

您已经在本地初始化了 Git 仓库。现在需要将代码推送到 GitHub。

1.  **确保您已在 GitHub 创建了仓库**
    *   仓库名建议：`markdown-to-word`
    *   确保仓库是空的（没有 README 或 .gitignore）。

2.  **推送到 GitHub**
    在 VS Code 的终端（Terminal）中运行以下命令。如果弹出登录窗口，请登录您的 GitHub 账号。

    ```bash
    git push -u origin main
    ```
    
    *如果提示 `remote origin already exists`，说明关联已建立，直接运行上面的 push 命令即可。*

---

## 第二步：部署后端 (Render)

我们需要一个支持 Docker 的云平台来运行 Python 和 Pandoc。Render 是最佳选择。

1.  **注册/登录 Render**
    *   访问 [https://render.com](https://render.com)
    *   使用 GitHub 账号登录（推荐）。

2.  **创建 Web Service**
    *   点击控制台右上角的 **New +** 按钮。
    *   选择 **Web Service**。
    *   在 "Connect a repository" 下，找到您的 `markdown-to-word` 仓库并点击 **Connect**。

3.  **配置服务**
    填写以下信息（未列出的保持默认）：
    *   **Name**: `md-to-word-backend` (或者您喜欢的名字)
    *   **Region**: 选择离您近的（如 Singapore 或 Oregon），或者默认。
    *   **Branch**: `main`
    *   **Root Directory**: `backend`  <-- **非常重要！一定要填 backend**
    *   **Runtime**: **Docker** <-- **非常重要！系统会自动检测到 Dockerfile**
    *   **Instance Type**: 选择 **Free** (免费版)。

4.  **部署**
    *   点击底部的 **Create Web Service**。
    *   等待几分钟，部署日志会滚动。当看到 "Live" 或 "Succeeded" 字样时，部署成功。
    *   **复制 URL**: 在页面左上角标题下方，找到类似 `https://md-to-word-backend.onrender.com` 的网址。**复制它**，下一步要用。

---

## 第三步：部署前端 (Vercel)

前端是静态 React 网页，Vercel 部署最快。

1.  **注册/登录 Vercel**
    *   访问 [https://vercel.com](https://vercel.com)
    *   使用 GitHub 账号登录。

2.  **导入项目**
    *   在 Dashboard 点击 **Add New...** -> **Project**。
    *   在 "Import Git Repository" 列表中，找到 `markdown-to-word` 并点击 **Import**。

3.  **配置项目**
    *   **Framework Preset**: Vite (通常会自动识别)。
    *   **Root Directory**: 点击 **Edit**，选择 `frontend` 目录。
    *   **Environment Variables** (环境变量):
        *   点击展开此选项。
        *   **Key**: `VITE_API_URL`
        *   **Value**: 粘贴您在第二步复制的 Render 后端网址 (例如 `https://md-to-word-backend.onrender.com`)。**注意：不要在末尾加斜杠 `/`**。
        *   点击 **Add**。

4.  **部署**
    *   点击 **Deploy**。
    *   等待约 1 分钟。当看到满屏烟花时，恭喜您，部署成功！

5.  **访问**
    *   Vercel 会提供一个访问链接（例如 `https://markdown-to-word.vercel.app`）。点击即可使用。

---

## 常见问题

*   **Render 免费版休眠**: Render 的免费实例在 15 分钟无请求后会休眠。再次访问时可能需要等待 30-50 秒启动。这是正常的。
*   **转换失败**: 检查 Vercel 的环境变量 `VITE_API_URL` 是否正确填写了后端地址。
