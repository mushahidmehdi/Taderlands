FROM arm64v8/node:18-alpine

ENV NODE_ENV=production

RUN npm install -g serve

COPY ./build /src

COPY ./docker-entrypoint.sh /
RUN sed -i -e 's/\r$//' /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]

EXPOSE 80

CMD serve -s /src -l 80
