#!/usr/bin/env bash
BASEDIR=$(dirname $0)

cd ../
npm i
npx lerna bootstrap
