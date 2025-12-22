#!/bin/bash
if [ -f .env.local ]; then
    echo "加载 .env 配置文件..."
    set -a # 自动导出后续变量
    source .env.local
    set +a
fi

# 检查必要参数
if [ -z "$SERVER_HOST" ]; then
    echo "错误: 未能在 .env 或环境变量中找到 SERVER_HOST"
    exit 1
fi

if [ -z "$SERVER_USER" ]; then
    echo "错误: 未能在 .env 或环境变量中找到 SERVER_USER"
    exit 1
fi
# ===========================================


set -e # 遇到错误立即停止

echo "开始部署流程..."

# 1. 本地构建
if [ "$RUN_BUILD" = "true" ]; then
    echo "正在本地构建项目..."
    yarn build
else
    echo "跳过本地构建..."
fi

# 2. 打包产物
echo "正在打包构建产物..."
# 包含：.next (构建产物), public (静态资源), package.json/yarn.lock (依赖管理), .env.local (环境变量, 如果有的话)
FILES_TO_PACK=".next public package.json yarn.lock .yarnrc.yml next.config.js .yarn"

if [ -f ".env.local" ]; then
    FILES_TO_PACK="$FILES_TO_PACK .env.local"
fi

# 如果有 ecosystem.config.js (PM2 配置)，也一并打包
if [ -f "ecosystem.config.js" ]; then
    FILES_TO_PACK="$FILES_TO_PACK ecosystem.config.js"
fi

# COPYFILE_DISABLE=1 防止 macOS 的 tar 包含特殊属性导致 Linux 下报错/警告
COPYFILE_DISABLE=1 tar --no-xattrs -czf output.tar.gz $FILES_TO_PACK
echo "打包完成: output.tar.gz"

# 3. 上传到服务器
echo " 正在上传到服务器 ($SERVER_USER@$SERVER_HOST:$SERVER_DIR)..."
# 确保远程目录存在
ssh -p "$SERVER_PORT" "$SERVER_USER@$SERVER_HOST" "mkdir -p $SERVER_DIR"
# 上传文件
scp -P "$SERVER_PORT" output.tar.gz "$SERVER_USER@$SERVER_HOST:$SERVER_DIR/output.tar.gz"

# 4. 远程执行部署命令
echo "正在服务器上执行部署..."
ssh -p "$SERVER_PORT" "$SERVER_USER@$SERVER_HOST" << EOF
    # --- 环境变量加载补丁 ---
    # 非交互式 SSH 默认不加载 .bashrc，需手动加载以获取正确的 Node/NVM 环境
    export FORCE_LOAD_PROFILE=1

    # 尝试加载常见的配置文件
    [ -f ~/.bash_profile ] && source ~/.bash_profile
    [ -f ~/.bashrc ] && source ~/.bashrc
    [ -f ~/.zshrc ] && source ~/.zshrc

    # 如果是 NVM 管理的 Node，尝试手动加载 NVM
    export NVM_DIR="\$HOME/.nvm"
    [ -s "\$NVM_DIR/nvm.sh" ] && \. "\$NVM_DIR/nvm.sh"
    # ----------------------

    cd $SERVER_DIR

    echo "Checking node version..."
    node -v

    echo "Extracting files..."
    tar -xzf output.tar.gz
    rm output.tar.gz

    echo "Installing production dependencies..."
    # Yarn v2+ 不再支持 --production，使用 --immutable 确保 lockfile 不变
    yarn install --immutable

    echo "Restarting application..."
    # 尝试使用 PM2 管理进程
    if command -v pm2 &> /dev/null; then
        # 如果名为 'blog' 的进程已存在，则重启；否则启动
        pm2 describe blog > /dev/null && pm2 restart blog || pm2 start yarn --name "blog" -- serve
        pm2 save
    else
        echo "未检测到 PM2，建议安装: npm i -g pm2"
        echo "尝试直接启动 (注意：这会阻塞当前脚本)..."
        yarn serve
    fi
EOF

# 5. 清理本地临时文件
echo "清理本地临时文件..."
rm output.tar.gz

echo "部署完成！"
