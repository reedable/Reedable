#!/bin/sh

lessc='node_modules/.bin/lessc'

${lessc} stylesheet/index.less stylesheet/index.css
${lessc} stylesheet/theme/dark.less stylesheet/theme/dark.css
${lessc} stylesheet/theme/light.less stylesheet/theme/light.css

