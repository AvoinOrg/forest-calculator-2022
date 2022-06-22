FROM node:16

ENV NODE_ENV=${NODE_ENV}
ENV PORT 3000

EXPOSE 3000

RUN mkdir -p /home/node/app/node_modules
WORKDIR /home/node/app
RUN chown -R node:node /home/node/app

COPY package*.json .
COPY yarn.lock .
COPY docker-entrypoint.sh .

USER node


ENTRYPOINT ["/bin/bash", "/home/node/app/docker-entrypoint.sh"]