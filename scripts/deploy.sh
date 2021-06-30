#!/usr/bin/env bash

# 删除远程的文件
rm -rf root@yangfei.org.cn:/var/www/build

# 将新创建的好的文件传到远程服务器
scp -o stricthostkeychecking=no /tmp/build.tgz root@yangfei.org.cn:/var/www

# 解压
tar -zxf root@yangfei.org.cn:/var/www/build.tgz

# 删除压缩包
rm -f root@yangfei.org.cn:/var/www/build.tgz

# 删除本地的压缩包
rm -f /tmp/build.tgz
