FROM node:18
RUN apt-get update -y
EXPOSE 443
ENTRYPOINT [ "/bin/bash", "-c", "echo 127.0.0.1 example.com *.example.com https://example.com https://www.example.com $(hostname)} >> /etc/hosts" ]