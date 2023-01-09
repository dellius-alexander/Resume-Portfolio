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
###############################################################################
###############################################################################
set -e

__create_cacert() {
  echo quit | openssl s_client -showcerts -servername delliusalexander.com -connect delliusalexander.com:443  > cacert.pem
}



URI="https://delliusalexander.com/api/v1/mail"
#echo $(curl -o - -ik -X POST "${URI}" \
#         -H 'Content-Type: application/json' \
#         -d '{"name":"Dellius","email":"dellius@gmail.com","dob":"1999-05-18","major":"BIT"}')
# set environment variables for runtime configuration
#export $(cat $(find .. -type f -name '*.env') | grep -v "#" | awk '/=/ {print $1}')

if [ ! -f "${PWD}/cacert.pem" ]; then
  __create_cacert && wait $!
fi

case ${1} in
  post)
    echo $(curl  --cacert "${PWD}/cacert.pem" -i \
                    -X POST "${URI}/post"  \
                    -H "Content-Type: application/json" \
                    -d '{"name":"Dellius","email":"dellius@gmail.com","subject":"Contact Form - client: Dellius","message":"On the line starting with 127.0.0.1, add the hostname to the end as it looks below. This should be on a single line."}' )

    ;;
  get)
    curl --cacert "${PWD}/cacert.pem" -i -X  GET "${URI}"

esac;
