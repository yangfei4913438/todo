#!/usr/bin/env bash

rm -rf root@yangfei.org.cn:/var/www/build/*
scp -o stricthostkeychecking=no -r ./dist/* root@yangfei.org.cn:/var/www/build
