#!/bin/bash
#
# How to build and publish the extension
#
# Run this script, i.e.
#
#   $ ./build.sh
#
# Upload the resulting Reedable.zip file to
#
#   https://chrome.google.com/webstore/devconsole
#
# Justification for permissions
#
#   activeTab
#     The extension applies the user's view preference to the currently active
#     visited web site content.
#
#   storage
#     The user's view preferences for the visited web site content are stored
#     and shared across his browsers.
#
#   scripting
#     The script modifies font and text spacing of the visited web
#     site content.
#
#   tabs
#     A the user switches to new tabs, the extension applies the user's view
#     preference to the visited web site content.
#
# Justification for content scripts
#
#   The user may choose any sites for applying his view preferences.
#


zip -r Reedable.zip src