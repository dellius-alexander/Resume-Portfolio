ARG VERSION="18"
FROM node:${VERSION}
ARG USER="node"
ARG HOSTNAME="example.com"
ARG UUID=1001
ARG CERTS_DIR=/usr/local/app/.certs
ARG PORT=""
ARG WORKDIR="/home/${USER}/app"
ENV HOSTNAME="${HOSTNAME}"
ENV USER="${USER}"
ENV CERTS_DIR="${CERTS_DIR}"
ENV PORT="${PORT}"
WORKDIR ${WORKDIR}
RUN apt-get update -y --fix-missing
EXPOSE "${PORT}"
RUN mkdir -p \
    "/tmp/app/.certs" \
    "${CERTS_DIR}" \
    "/home/${USER}/app" \
    "/entrypoint"

COPY ./entrypoint/** /entrypoint/
COPY ./certs/certs.* "${CERTS_DIR}/"
COPY ./scripts/user.sh* /tmp/app/

RUN /bin/bash /tmp/app/user.sh "${USER}" "${UUID}"
RUN /bin/bash "${CERTS_DIR}/certs.sh" -s "${HOSTNAME}" "${CERTS_DIR}"

RUN chown -R "${USER}:root" "${CERTS_DIR}"
RUN chown -R "${USER}:root" "/home/${USER}/app"
USER "${USER}"
ENTRYPOINT ["/bin/sh", "/entrypoint/entrypoint.sh"]
#CMD [ "/bin/sh", "${CERTS_DIR}/certs.sh", "-s", "${HOSTNAME}", "${CERTS_DIR}" ]
