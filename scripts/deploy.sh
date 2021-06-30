#!/usr/bin/env bash

rm -rf root@yangfei.org.cn:/var/www/build/*
scp -o stricthostkeychecking=no -r ../build/* root@yangfei.org.cn:/var/www/build
