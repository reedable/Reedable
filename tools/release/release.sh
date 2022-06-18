#!/bin/bash
procname=$(basename $0)
pathname=$(cd "$(dirname "$0")" && pwd)

#++
# Go to the project root

cd "${pathname}/../.." || exit 100

#++
# Get the current branch. If we are not on a release branch, abort.
#

current_branch=$(git rev-parse --abbrev-ref HEAD)

if [[ ! "${current_branch}" == "release/"* ]]; then
    echo "${procname}: ${current_branch} is not a release branch"
    exit 210
fi

#++
# Make sure that the working directory is clean.
#

if [ -n "$(git status --porcelain)" ]; then
    echo "${procname}: Working directory is unclean."
    exit 200
fi

#++
# Make sure we have the latest from remote.
#

git pull origin "${current_branch}"

#++
# Get the version number in the manifest.json
#

version=$(grep '"version"' unpacked/manifest.json |\
    sed -e 's/[",]//g' |\
    awk '{printf("v%s", $2)}')

git fetch --tags

if git rev-parse "${version}" > /dev/null 2>&1; then
    echo "${procname}: ${version} already exists"
    exit 202
fi

git tag -s "${version}"

git push origin "${version}"
