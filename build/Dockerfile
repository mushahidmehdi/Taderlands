FROM arm64v8/node:14-buster-slim as base

ENV NODE_ENV=production

RUN apt-get update \
	&& apt-get install -y --no-install-recommends dnsutils iproute2 openssl \
	&& rm -rf /var/lib/apt/lists/*

#ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.5.0/wait /wait
ADD https://github.com/appmodule/docker-compose-wait-arm64-builds/releases/download/2.7.3/wait /wait
RUN chmod +x /wait

COPY ./docker-entrypoint.sh /
RUN sed -i -e 's/\r$//' /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]

# -------------------------------------------------

FROM base as builder

WORKDIR /paratica-common

COPY ./paratica-common/package*.json ./
COPY ./paratica-common/src/prisma/schema.prisma ./src/prisma/
RUN npm install --also=dev \
    && npm run prisma-generate
# -------------------------------------------------

FROM base

WORKDIR /src

COPY --from=builder /paratica-common/src/prisma ./paratica-common/src/prisma

COPY ./package*.json ./
COPY ./paratica-common/package*.json ./paratica-common/
COPY ./common/package*.json ./backend-common/

RUN sed -r -i -e 's%(\.\./){3}common%\./paratica-common%' ./package.json && \
    sed -r -i -e 's%(\.\./){2}common%\./backend-common%' ./package.json && \
    sed -r -i -e 's%(\.\./){2}common%\.\./paratica-common%' ./backend-common/package.json

RUN npm install --only=prod && \
    npm cache clean --force

COPY ./paratica-common ./paratica-common
COPY ./common ./backend-common
COPY ./src ./

EXPOSE 80

CMD /wait && node .