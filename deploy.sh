#!/bin/bash

### This script is used by travis to automatically deploy new
### master branch pushes to gh-pages


set -o errexit -o nounset

rev=$(git rev-parse --short HEAD)

git init
git config user.name "Travis CI"
git config user.email "travis@fakemail.com"

git remote add upstream "https://$GH_TOKEN@github.com/yochannah/cytoscape-intermine.git"
git fetch upstream
git reset upstream/gh-pages

touch .

git add -A .
git commit -m "rebuild pages at ${rev}"
git push -q upstream HEAD:gh-pages
