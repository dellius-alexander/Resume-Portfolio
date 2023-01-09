#!/usr/bin/env bash
#/**
# *    Copyright 2022 Dellius Alexander
# *
# *    Licensed under the Apache License, Version 2.0 (the "License");
# *    you may not use this file except in compliance with the License.
# *    You may obtain a copy of the License at
# *
# *        http://www.apache.org/licenses/LICENSE-2.0
# *
# *    Unless required by applicable law or agreed to in writing, software
# *    distributed under the License is distributed on an "AS IS" BASIS,
# *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# *    See the License for the specific language governing permissions and
# *    limitations under the License.
# */
################################################################
docker-compose -f docker-compose.yml down &2>/dev/null
bash ./staging.sh && wait $!;
# set environment variables for runtime configuration
export $(cat $(find . -type f -name '*.env') | grep -v "#" | awk '/=/ {print $1}')
# must remember after extraction the root direction is still staging, i.e. staging/server.js
tar -zcvf ./dist/staging.tar.gz ./staging/ && wait $!;
# create staging checksum file hash
shasum -a 256  ./dist/staging.tar.gz > ./dist/staging.tar.gz.sum && wait $!;
# verify checksum has with file hash
[ $(shasum -a 256 -c ./dist/staging.tar.gz.sum | awk '/:/ {print $2}' | grep -ic ok) -eq  1 ] && echo "Archive File staging.tar.gz PASS Hash Check"
# run docker-compose file
docker-compose -f docker-compose.yml up \
  --always-recreate-deps \
  --renew-anon-volumes \
  --remove-orphans \
  --force-recreate \
  --build -d

