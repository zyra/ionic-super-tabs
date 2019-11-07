#!/bin/bash

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
WORK_DIR=${TMP:-$DIR}
WS_DIR="${WORK_DIR}/.super-tabs-tmp"
EXAMPLE_PROJECT_DIR="$(cd "${DIR}/../" >/dev/null 2>&1 && pwd)/ionic-super-tabs-example"

trap '_cleanWorkspace' EXIT
trap 'exit' SIGINT SIGTERM

declare -a _cmd_setup=("setup" "Installs node modules for all packages")
declare -a _cmd_build=("build" "Builds core and angular projects" '--only <core|angular>')
declare -a _cmd_copy=("copy" "Copies built packages as NPM modules to \`${EXAMPLE_PROJECT_DIR}\`")
declare -a _cmd_dev=("dev" 'Runs build and then copy')
declare -a _cmd_publish=("publish" 'Runs build and publishes package to npm' '--npm-args <additional npm arguments>')

_formatArgs() {
  _args=$(printf "%s" "$2")
  for arg in "${@:3}"; do
    _args=$(printf "%s\n\t\t\e[37m%s\e[0m" "${_args}" "${arg}")
  done
  printf "%s" "${_args}"
}

_printUsage() {
  declare -a args=(
    "$(basename "${0}")"
    "${_cmd_setup[0]}" "$(_formatArgs "${_cmd_setup[@]}")"
    "${_cmd_build[0]}" "$(_formatArgs "${_cmd_build[@]}")"
    "${_cmd_copy[0]}" "$(_formatArgs "${_cmd_copy[@]}")"
    "${_cmd_dev[0]}" "$(_formatArgs "${_cmd_dev[@]}")"
    "${_cmd_publish[0]}" "$(_formatArgs "${_cmd_publish[@]}")"
  )

  printf "\e[1m\e[94m................................................................
..............                               ...................
..............    Ionic Super Tabs Helper    ...................
..............                               ...................
................................................................
\e[0m

\e[1m\e[36mUsage\e[0m: %s <command> [options]

\e[1m\e[36mCommands:\e[0m
* \e[1m%10s:\e[0m %s
* \e[1m%10s:\e[0m %s
* \e[1m%10s:\e[0m %s
* \e[1m%10s:\e[0m %s
* \e[1m%10s:\e[0m %s
" "${args[@]}"
}

errExit() {
  echo -e "\e[1m\e[91m${*}\e[0m"
  exit 1
}

_exec() {
  s=$(date +%s%N | cut -b1-13)
  "$@" || errExit "Failed to execute command"
  e=$(date +%s%N | cut -b1-13)
  d=$((e - s))
  _logv "executed ${*} in ${d}ms"
}

_execSilent() {
  "$@" &>/dev/null
}

_setupWorkspace() {
  _execSilent cd "${DIR}"
  _cleanWorkspace
  mkdir -p "${WS_DIR}" >/dev/null || errExit 'unable to setup workspace'
}

_cleanWorkspace() {
  if [ -d "${WS_DIR}" ]; then
    rm -rf "${WS_DIR}" >/dev/null || errExit 'unable to clean workspace'
  fi
}

_logv() {
  echo -e "\e[33m${*}\e[0m"
}

_log() {
  echo -e "\e[36m${*}\e[0m"
}

_build() {
  local _only

  for ((i = 1; i <= $#; i++)); do
    case "${!i}" in
    "--only")
      local _next="$((i + 1))"
      _only="${!_next}"
      ;;
    esac
  done

  case "${_only}" in
  "angular")
    _log "Building angular module"
    _exec npx lerna run build --scope=@ionic-super-tabs/angular --stream --no-progress --loglevel=silent
    ;;

  "core")
    _log "Building core module"
    _exec npx lerna run build --scope=@ionic-super-tabs/core --stream --no-progress --loglevel=silent
    ;;

  *)
    _log "Building all modules"
    _exec npx lerna run build --concurrency=1 --stream --no-progress --loglevel=silent
    ;;
  esac
}

_copy() {
  if [ ! -d "${EXAMPLE_PROJECT_DIR}" ]; then
    errExit "Example project does not exists in ${EXAMPLE_PROJECT_DIR}"
  fi

  _log "Copying built modules to example app"
  cd core || exit 1

  _logv "Packing core..."
  core_tgz=$(npm pack 2>&1 | tail -1)
  mv "${core_tgz}" "${WS_DIR}"
  cd ../angular/dist || exit 1

  _logv "Packing angular..."
  ng_tgz=$(npm pack 2>&1 | tail -1)
  mv "${ng_tgz}" "${WS_DIR}"
  cd ../../

  local extractDest="${EXAMPLE_PROJECT_DIR}/node_modules/@ionic-super-tabs/"
  _logv "Extracting packages to ${extractDest}"

  tar xf "${WS_DIR}/${core_tgz}" -C "${extractDest}"
  cp -a "${extractDest}package/." "${extractDest}/core/"
  rm -rf "${extractDest}package"

  tar xf "${WS_DIR}/${ng_tgz}" -C "${extractDest}"
  cp -a "${extractDest}package/." "${extractDest}/angular/"
  rm -rf "${extractDest}package"

  _log "Good luck!"
}

_publish() {
  _log "Publishing all packages to npm"
  _exec sleep 1
}

_setupWorkspace

case $1 in
"setup")
  _exec npx lerna bootstrap
  ;;

"build")
  _build "${@:2}"
  ;;

"copy")
  _copy "${@:2}"
  ;;

"dev")
  _build
  _copy
  ;;

"publish")
  exec "${@:2}"
  ;;
*)
  _printUsage
  ;;
esac
