#!/bin/bash
# unfortunately we could not get this to update docker /etc/hosts file with the updated DNS namespaces
# so the workaround was to use hostname attribute in the docker-compose.yml file
# Add the following to /etc/hosts file for loopback compatibility for custom DNS entries.
echo "127.0.0.1 example.com *.example.com https://example.com https://www.example.com $(hostname)}" >> /etc/hosts
