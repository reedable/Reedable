#!/bin/sh

lessc='node_modules/.bin/lessc'

${lessc} docs/stylesheet/index.less docs/stylesheet/index.css
${lessc} docs/stylesheet/theme/dark.less docs/stylesheet/theme/dark.css
${lessc} docs/stylesheet/theme/light.less docs/stylesheet/theme/light.css