#!/bin/bash
# create a dot directory .certs in root of project
# ./.certs/
#       example.req
#       example.key
#       example.cert
#       example.pem
#       example.pub

# check for the config file example.req
EXAMPLE_REQ=$( [[ -z $(find . -type f -name "${1}" &2>/dev/null ) ]] \
              && echo  $(find . -type f -name "example.req" &2>/dev/null) \
              || echo  $(find . -type f -name "${1}" &2>/dev/null) )
# terminate script if config file not found
if [[ -z "${EXAMPLE_REQ}" ]]; then
  echo "Config file [\"example.req\"] not found"
  exit 1
fi
# get the cert directory
CERTS_DIR=$(echo "${EXAMPLE_REQ}" | cut -d'/' -f-2 )

# create the certs key file
openssl req -config ${EXAMPLE_REQ} \
            -new -nodes \
            -x509 \
            -newkey rsa:2048 \
            -sha256 \
            -keyout "${CERTS_DIR}/example.key" \
            -out "${CERTS_DIR}/example.cert" \
            -days 3650 &2>/dev/null

wait $!

#Then to combine things to get a .pem:
cat "${CERTS_DIR}/example.key" "${CERTS_DIR}/example.cert" > "${CERTS_DIR}/example.pem" &2>/dev/null
wait $!

#Then to extract the public key for use in validation:
openssl x509 -pubkey -noout -in "${CERTS_DIR}/example.pem" > "${CERTS_DIR}/example.pub" &2>/dev/null
wait $!



