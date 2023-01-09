#!/usr/bin/env bash
# Usage: create_hash.sh "${PWD}/somefile.js"
case ${1} in
  -s) # for string literals
    # finally if it's a string
    printf "[ sha256-"
    cat "${2}" | openssl dgst -sha256 -binary | openssl base64 -A
    printf " ] => [${2}]\n"
    ;;
  -f) # for file as input
    if [[ -f "${2}" ]]; then
        printf "[ sha256-"
        cat "${2}" | openssl dgst -sha256 -binary | openssl base64 -A
        printf " ] => ${2}\n"
        exit 0
    fi
    ;;
  -d) # for directory as input
    if [[ -d "${2}" ]]; then
     for dir in ${2}/**; do
        for file in ${dir}/**; do
          if [[ -f "${file}" ]]; then
            printf "[ sha256-"
            cat "${file}" | openssl dgst -sha256 -binary | openssl base64 -A
            printf " ] => ${file}\n"
          fi
        done
      done
      exit 0
    fi;
    ;;
  * | -h | --help)
      # default behavior
      echo """
      HELP DOCS:
      Usage:
      /bin/bash ${0} [ -f file | -s string | -d directory  | -h help ]
        Options:
          -f | --file: passing a file.
          -s | --string: passing a string literal.
          -d | --directory: directory of files.
          -h | --help: this help message.
      """
      exit 1
      ;;
esac





# cat ${1} | openssl dgst -sha384 -binary | openssl base64 -A
