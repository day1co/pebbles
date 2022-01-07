#!/bin/bash

slackToDeptDev() {
  curl \
    -X POST \
    --data-urlencode \
    "payload={\"channel\": \"#npm-publish-notify\", \"text\": \"$1\", \"attachments\":[{ \"fields\":[{\"title\":\"Notes\",\"value\":\"$2\"  }] }] }" $3
}

PACKAGE_NAME=$(jq -r .name package.json)
PACKAGE_VERSION=$(jq -r .version package.json)
echo "${PACKAGE_NAME}@${PACKAGE_VERSION} PUBLISH SUCCESS"

slackToDeptDev "\`${PACKAGE_NAME}@${PACKAGE_VERSION}\` 이 배포되었습니다. <!here>" "$1" $2
