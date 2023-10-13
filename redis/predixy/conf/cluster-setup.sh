#!/bin/bash

redis-cli --cluster call redis-node01:7101 flushall &&
redis-cli --cluster call redis-node02:7102 flushall &&
redis-cli --cluster call redis-node03:7103 flushall &&
redis-cli --cluster call redis-node04:7104 flushall &&
redis-cli --cluster call redis-node05:7105 flushall &&
redis-cli --cluster call redis-node06:7106 flushall &&

redis-cli --cluster call redis-node01:7101 cluster reset &&
redis-cli --cluster call redis-node02:7102 cluster reset &&
redis-cli --cluster call redis-node03:7103 cluster reset &&
redis-cli --cluster call redis-node04:7104 cluster reset &&
redis-cli --cluster call redis-node05:7105 cluster reset &&
redis-cli --cluster call redis-node06:7106 cluster reset &&

redis-cli --cluster create redis-node01:7101 redis-node02:7102 redis-node03:7103 redis-node06:7106 redis-node04:7104 redis-node05:7105 --cluster-replicas 1 --cluster-yes &&

/usr/local/bin/predixy /etc/predixy/conf/predixy.conf