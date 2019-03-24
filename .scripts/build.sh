#!/usr/bin/env bash
BASEDIR=$(dirname $0)

cd ${BASEDIR}/../core
npx run build

cd ${BASEDIR}/../angular
npx run build
