#!/bin/bash
# unfortunately we could not get this to update docker /etc/hosts file with the updated DNS namespaces
# so the workaround was to use hostname attribute in the docker-compose.yml file
# Add the following to /etc/hosts file for loopback compatibility for custom DNS entries.
#echo "127.0.0.1 example.com *.example.com https://example.com https://www.example.com $(hostname)}" >> /etc/hosts
#sh "${CERTS_DIR}/certs.sh" "-s" "${HOSTNAME}" "${CERTS_DIR}" &2>/dev/null
npm install &2>/dev/null
npm audit fix --force &2>/dev/null
DEBUG=resume_portfolio:* npm start &&
echo "Environment: ${NODE_ENV}"