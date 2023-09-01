FROM node:lts-alpine

# Bash shell
RUN apk add -f bash bash-doc bash-completion
## change default shell ash -> bash
RUN sed -i "s|/bin/ash|/bin/bash|g" /etc/passwd

## color prompt
RUN echo 'PS1="\[\033[32m\]\w\[\033[00m\] "' >> ~/.bashrc
RUN echo "alias ls='ls --color=auto'" >> ~/.bashrc
RUN echo "alias l='ls --color=auto -lA'" >> ~/.bashrc

# Development Tools
RUN apk add -f git curl jq tree vim asciinema

# ApacheBench
RUN apk add -f apache2-utils

# Install docker
RUN DOCKER_PKG="docker-20.10.9.tgz";\
    curl -fsSLO --compressed "https://download.docker.com/linux/static/stable/$(arch)/$DOCKER_PKG"; \
    tar -xf $DOCKER_PKG --strip-components 1 --directory /usr/local/bin/ docker/docker; \
    rm -f $DOCKER_PKG
RUN apk add -f docker-compose


# Install nest cli
RUN npm install -g @nestjs/cli

## Create Directory for the Container
WORKDIR /usr/src/app

##
COPY package.json ./
COPY tsconfig.json ./
COPY tsconfig.build.json ./
COPY .eslintrc.js ./

# npm install
RUN npm install

# wait-for-it.sh
COPY wait-for-it.sh ./
RUN chmod +x wait-for-it.sh

# Docker Demon Port Mapping
EXPOSE 3000