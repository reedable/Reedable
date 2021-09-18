#!/bin/bash
dstamp=$(date '+%Y%m%d')
target_branch=''

#++
# Get the current branch. If we are already on a release branch,
# that means our previous submission has been rejected, and are
# making updates to the pending release.
#

current_branch=$(git rev-parse --abbrev-ref HEAD)

if [[ "${current_branch}" == "release/"* ]]; then
    target_branch="${current_branch}"
fi

#++
# Before doing anything, make sure we have no pending changes.
#

if [ ! -z "$(git status --porcelain)" ]; then
    echo "Working directory is unclean."
    exit 200
fi

if [ -z "${target_branch}" ]; then
    target_branch="release/${dstamp}"

    if git rev-parse "${target_branch}" > /dev/null 2>&1; then
        echo "${target_branch} already exists"
        exit 201
    fi

    git fetch origin develop
    git checkout -b "${target_branch}" origin/develop
fi

#++
# Check the manifest version number of the release code.
#

version=$(grep '"version"' src/manifest.json |\
    sed -e 's/[",]//g' |\
    awk '{printf("v%s", $2)}')

if git rev-parse "${version}" > /dev/null 2>&1; then
    echo "${version} already exists"
    exit 202
fi

#++
# We are on release branch. Working directory is clean.
# The manifest version has been checked.
# We will package the new zip file for review.
#

echo zip -r Reedable-${dstamp}.zip src

cat<<EOD

    Version: ${version}

    Branch: ${target_branch}

Upload Reedable-${dstamp}.zip to

  https://chrome.google.com/webstore/devconsole

Justification for permissions

  activeTab
    The extension applies the user's view preference to the currently active
    visited web site content.

  storage
    The user's view preferences for the visited web site content are stored
    and shared across his browsers.

  scripting
    The script modifies font and text spacing of the visited web
    site content.

Justification for content scripts

  The user may choose any sites for applying his view preferences.

EOD




