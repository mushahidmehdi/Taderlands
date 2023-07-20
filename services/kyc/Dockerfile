FROM arm64v8/node:18-alpine

ENV NODE_ENV=production

RUN npm install http-server -g

COPY ./src /build

COPY ./docker-entrypoint.sh /
RUN sed -i -e 's/\r$//' /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]

EXPOSE 80

CMD http-server /build -p 80
