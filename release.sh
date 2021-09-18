#!/bin/bash

#++
# Get the current branch. If we are not on a release branch, abort.
#

current_branch=$(git rev-parse --abbrev-ref HEAD)

if [[ ! "${current_branch}" == "release/"* ]]; then
    echo "${current_branch} is not a release branch"
    exit 210
fi

#++
# Make sure that the working directory is clean.
#

if [ ! -z "$(git status --porcelain)" ]; then
    echo "Working directory is unclean."
    exit 200
fi

#++
# Make sure we have the latest from remote.
#

git pull orign "${current_branch}"

#++
# Get the version number in the manifest.json
#

version=$(grep '"version"' src/manifest.json |\
    sed -e 's/[",]//g' |\
    awk '{printf("v%s", $2)}')

git fetch --tags

if git rev-parse "${version}" > /dev/null 2>&1; then
    echo "${version} already exists"
    exit 202
fi

git tag "${version}"

git push origin "${version}"
