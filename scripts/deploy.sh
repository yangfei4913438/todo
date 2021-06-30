#!/usr/bin/env bash

# 删除远程的文件
ssh -o stricthostkeychecking=no root@yangfei.org.cn "rm -rf /var/www/*"

# 将新创建的好的文件传到远程服务器
scp -o stricthostkeychecking=no /tmp/build.tgz root@yangfei.org.cn:/var/www

# 解压然后删除压缩包
ssh -o stricthostkeychecking=no root@yangfei.org.cn "tar -zxf /var/www/build.tgz"

# 删除本地的压缩包
rm -f /tmp/build.tgz
