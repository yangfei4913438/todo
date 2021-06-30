#!/usr/bin/env bash

# 将新创建的好的文件传到远程服务器
scp -o stricthostkeychecking=no /tmp/build.tgz root@yangfei.org.cn:/var/www

# 删除远程的文件 解压 然后删除压缩包
ssh -o stricthostkeychecking=no root@yangfei.org.cn "tar -zxf /var/www/build.tgz"
