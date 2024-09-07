#!/usr/bin/env bash
# unfortunately we could not get this to update docker /etc/hosts file with the updated DNS namespaces
# so the workaround was to use hostname attribute in the docker-compose.yml file
# Add the following to /etc/hosts file for loopback compatibility for custom DNS entries.
#echo "127.0.0.1 example.com *.example.com https://example.com https://www.example.com $(hostname)}" >> /etc/hosts

# check execution environment for nodejs
if [ -z "${NODE_ENV}" ]; then
  export NODE_ENV=development
fi
# check if certs directory is set
if [ -z "${CERTS_DIR}" ]; then
  export CERTS_DIR="/certs"
fi
## check if certificates exist
#if [ -f "${CERTS_DIR}/.certs/**" ]; then
#  echo "Certificates already exist."
#else
#  echo "Creating certificates."
#  mkdir -p ${CERTS_DIR}
#  /bin/bash ${CERTS_DIR}/certs.sh "-s" "$(hostname)" "${CERTS_DIR}/.certs"
#fi

npm install
#npm audit fix --force &2>/dev/null

case "${NODE_ENV}" in
  prod | production)
    echo "Node running in ${NODE_ENV} mode." &&
    npm run start
    ;;
  dev | development)
    echo "Node running in ${NODE_ENV} mode." &&
#    export DEBUG=resume_portfolio:*
    npm run dev
    ;;
esac

echo "Environment: ${NODE_ENV}"