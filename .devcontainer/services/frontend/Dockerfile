ARG VERSION="18"
FROM node:${VERSION}
ARG USER="node"
ARG HOSTNAME="example.com"
ARG UUID=1001
ARG CERTS_DIR="/etc/ssl/delliusalexander.com.d"
ARG PORT=4443
ARG WORKDIR="/home/${USER}/app"
ENV HOSTNAME="${HOSTNAME}"
ENV USER="${USER}"
ENV PORT="${PORT}"
WORKDIR ${WORKDIR}
RUN apt-get update -y --fix-missing
EXPOSE "${PORT}"
RUN mkdir -p \
    "/tmp/app/.certs" \
    "${CERTS_DIR}" \
    "/home/${USER}/app" \
    "/entrypoint"

COPY .devcontainer/services/frontend/entrypoint/** /entrypoint/
COPY .devcontainer/certs/certs.* "${CERTS_DIR}/"
COPY .devcontainer/scripts/user.sh* /tmp/app/
COPY ./frontend/** "/home/${USER}/app"

RUN /bin/bash /tmp/app/user.sh ${USER} ${UUID}
RUN /bin/bash ${CERTS_DIR}/certs.sh "-s" "${HOSTNAME}" "${CERTS_DIR}" "${PORT}"

RUN chown -R "${USER}:root" ${CERTS_DIR}
RUN chown -R "${USER}:root" "/home/${USER}/app" "/entrypoint"
RUN chmod -R 755 ${CERTS_DIR} "/home/${USER}/app" "/entrypoint"
USER "${USER}"

ENTRYPOINT ["/entrypoint/entrypoint.sh"]
CMD ["npm", "run", "dev"]
