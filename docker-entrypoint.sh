#!/bin/bash
if [ "$NODE_ENV" = "production" ]; then
    yarn run build-update && node server.js;
else
    yarn run build-update && node server.js;
fi
