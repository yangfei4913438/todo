#!/usr/bin/env bash

# 构建前端代码
yarn
yarn build

# 删除远程的文件
rm -rf root@yangfei.org.cn:/var/www/build/*

# 将新创建的好的文件传到远程服务器
scp -o stricthostkeychecking=no -r ./build/* root@yangfei.org.cn:/var/www/build
