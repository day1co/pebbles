#!/bin/bash

slackToDeptDev() {
}

PACKAGE_NAME=$(jq -r .name package.json)
PACKAGE_VERSION=$(jq -r .version package.json)
echo "${PACKAGE_NAME}@${PACKAGE_VERSION} PUBLISH SUCCESS"

slackToDeptDev "\`${PACKAGE_NAME}@${PACKAGE_VERSION}\` 이 배포되었습니다. <!here>" "담당자는 확인해주세요!"
