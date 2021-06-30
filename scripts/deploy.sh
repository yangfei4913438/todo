#!/usr/bin/env bash

# 删除远程的文件
rm -rf root@yangfei.org.cn:/var/www/build/*

# 将新创建的好的文件传到远程服务器
scp -o stricthostkeychecking=no -r /tmp/build/* root@yangfei.org.cn:/var/www/build
