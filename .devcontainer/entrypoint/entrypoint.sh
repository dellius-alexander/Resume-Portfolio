#!/bin/bash
# unfortunately we could not get this to update docker /etc/hosts file with the updated DNS namespaces
# so the workaround was to use hostname attribute in the docker-compose.yml file
# Add the following to /etc/hosts file for loopback compatibility for custom DNS entries.
#chmod +x /app/certs.sh  &&
#/bin/bash "${APP_HOME}/certs.sh" "${DOMAIN_NAME}" &&
#chown -R node:root /app/.certs/ &&
#service apache2 restart  &&
COMMAND=""
# check for NODE_ENV variable and set command
if [ "${NODE_ENV}" == "production" ]; then
  COMMAND+="start"
elif [ "${NODE_ENV}" == "development" ]; then
  COMMAND+="dev"
fi;
# check if the command not set and exit if not set
if [ -z "${COMMAND}" ]; then
  echo "ERROR: Environment variable NODE_ENV is not set."
  exit 1
fi;
npm run "${COMMAND}" &2>/dev/null