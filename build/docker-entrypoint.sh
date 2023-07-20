#!/bin/sh
set -e

consul=$(dig +short host.docker.internal)
if echo "$consul" | grep -Evq "^(\d+\.)"
then
    echo "Host not available..."
    consul=$(ip route | grep default | awk '{print $3}')
fi

if [ -n "$consul" ]
then
    echo "Found consul on $consul"
    echo "nameserver $consul" > /etc/resolv.conf
else
    echo "Cannot found consul!"
fi

exec "$@"