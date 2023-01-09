ARG NODE_VERSION=18
# Beginning of Dockerfile ############################
## Build Stage: node_modules
FROM node:${NODE_VERSION} as setup_staging
ARG NODE_ENV="development"
ARG TZ="America/New_York"
ARG EMAIL_PROVIDER="smtp.gmail.com"
ARG USER="node"
ARG EMAIL_USERNAME=""
ARG EMAIL_PASSWORD=""
ARG LISTEN_PORT=443
ARG APP_HOME="/home/node/app"
ARG DOMAIN_NAME=""
ARG DOMAIN_BASENAME=""
ARG HOSTNAME=""
# Setting environment variables
ENV DOMAIN_NAME="${DOMAIN_NAME}"
ENV APP_HOME="${APP_HOME}"
ENV TZ="${TZ}"
ENV EMAIL_PROVIDER="${EMAIL_PROVIDER}"
ENV DOMAIN_BASENAME="${DOMAIN_BASENAME}"
ENV HOSTNAME="${DOMAIN_NAME}"
# end environment variables setup
WORKDIR "${APP_HOME}"
RUN echo "Domain name: ${DOMAIN_NAME} | DOMAIN: ${DOMAIN_BASENAME}"
RUN mkdir -p ${APP_HOME} /tmp/app &2>/dev/null

COPY .devcontainer/user.sh* /tmp/app/user.sh
COPY ./dist/ /tmp/app/dist/

RUN /bin/bash /tmp/app/user.sh

RUN tar -xvf /tmp/app/dist/staging.tar.gz  -C /tmp/app/
# staging is the root directory of the artifact
RUN cp -r /tmp/app/staging/**  ${APP_HOME}

RUN cd ${APP_HOME} \
    && npm install

RUN echo "Welcome to user ${EMAIL_USERNAME}" && sleep 3

FROM setup_staging
RUN mkdir -p \
    /etc/mail/auth \
    /etc/sysconfig  \
    /entrypoint \
    "${APP_HOME}/.certs"

COPY .devcontainer/entrypoint/entrypoint.sh* /entrypoint/entrypoint.sh
# https://www.linux.co.cr/ldp/solrhe/chap22sec180.html
COPY .devcontainer/sendmail/sendmail_config* /etc/sysconfig/sendmail
COPY .devcontainer/sendmail/local-host-names* /etc/mail/local-host-names
COPY .devcontainer/sendmail/sendmail.mc* /etc/mail/sendmail.mc
COPY .devcontainer/sendmail/aliases* /etc/mail/aliases

#RUN apt-get install -y \
#    openssl \
#    apache2 \
#    sendmail

#RUN groupadd apache2 \
#    && usermod -aG apache2 node \
#    && newgrp apache2 \
#    && groupadd sendmail \
#    && usermod -aG sendmail node \
#    && newgrp sendmail

#RUN echo "AuthInfo:${EMAIL_PROVIDER}: \"U:${EMAIL_USERNAME}\" \"P:${EMAIL_PASSWORD}\"" > "/etc/mail/auth/smtp-auth" >/dev/null \
#    && cd /etc/mail/auth \
#    && makemap hash smtp-auth < smtp-auth \
#    && chmod 600 smtp-auth smtp-auth.db \
#    && sendmailconfig --no-reload

#RUN rm  /etc/mail/aliases* \
#    && cd /etc/mail \
#    && makemap hash /etc/mail/aliases.db < /etc/mail/aliases \
#    && chmod 600 /etc/mail/aliases.db \
#    && /usr/bin/newaliases

EXPOSE "${LISTEN_PORT}"

RUN chown -R node:root /entrypoint \
    && chown -R node:root "${APP_HOME}"

#RUN chmod +x "${APP_HOME}/certs.sh" \
#    && /bin/bash "${APP_HOME}/certs.sh" "-s" "${DOMAIN_NAME}" \
#    && chown -R node:root "${APP_HOME}/.certs"  \
#    && chmod -R 600 "${APP_HOME}/.certs"

## # Clean up
#RUN apt-get autoremove -y \
# && apt-get clean -y \
# && rm -rf /var/lib/apt/lists/* \
# && rm -rf /tmp

USER node

ENTRYPOINT [ "/bin/sh", "/entrypoint/entrypoint.sh"]
## End of Dockerfile ##################################
