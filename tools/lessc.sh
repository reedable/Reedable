#!/bin/sh

lessc='node_modules/.bin/lessc'

${lessc} assets/stylesheet/index.less assets/stylesheet/index.css
${lessc} assets/stylesheet/theme/dark.less assets/stylesheet/theme/dark.css
${lessc} assets/stylesheet/theme/light.less assets/stylesheet/theme/light.css

