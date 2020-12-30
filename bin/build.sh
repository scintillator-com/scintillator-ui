#!/bin/bash
curdir=$(pwd)
scriptdir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

cd "${scriptdir}/.."

# host setup
sudo apt install nodejs npm
sudo npm install --global n

# nodejs LTS
sudo n 14.15.1

# react deps
npm install
npm run build

cd $curdir

