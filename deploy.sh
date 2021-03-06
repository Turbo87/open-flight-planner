#!/bin/bash

set -e

cd out/prod
git init
git config user.name "Travis CI"
git config user.email "builds@travis-ci.org"
git add .
git commit -m "Deploy to GitHub Pages"
git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:gh-pages > /dev/null 2>&1
