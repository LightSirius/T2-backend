FROM ubuntu:18.04

ENV VERSION 1.0.4

RUN apt-get update && apt-get upgrade -y \
    && apt-get install -y build-essential wget unzip curl \
    && wget --no-check-certificate https://github.com/joyieldInc/predixy/archive/${VERSION}.zip -O predixy-${VERSION}.zip \
    && unzip predixy-${VERSION}.zip \
    && cd predixy-${VERSION} \
    && make \
    && mv src/predixy /usr/local/bin \
    && mkdir -p /etc/predixy/conf

RUN cd /tmp &&\
    curl http://download.redis.io/redis-stable.tar.gz | tar xz &&\
    make -C redis-stable &&\
    cp redis-stable/src/redis-cli /usr/local/bin &&\
    rm -rf /tmp/redis-stable

ADD conf /etc/predixy/conf

#CMD ["/usr/local/bin/predixy", "/etc/predixy/conf/predixy.conf"]
#CMD ["sh", "/etc/predixy/conf/cluster-setup.sh"]
ENTRYPOINT ["sh", "/etc/predixy/conf/cluster-setup.sh"]