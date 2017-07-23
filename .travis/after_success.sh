#!/bin/bash
set -e

if [ $TRAVIS_BRANCH == 'master' ]; then
  if [ $TRAVIS_NODE_VERSION == '6' ]; then
    npm run semantic-release
  fi
fi