ARG VERSION=5.0.16
ARG PORT=27017
FROM mongo:${VERSION}
EXPOSE ${PORT}
COPY .devcontainer/config/mongodb/mongo-init.js  /docker-entrypoint-initdb.d/
COPY .devcontainer/config/mongodb/mongod.conf  /etc/
COPY .devcontainer/config/mongodb/healthcheck.js /opt/healthcheck/healthcheck.js
RUN apt-get update -y
RUN mkdir -p /opt/healthcheck
HEALTHCHECK --interval=15s --timeout=15s --start-period=30s \
 CMD node /opt/healthcheck/healthcheck.js