#!/bin/sh

lessc='node_modules/.bin/lessc'

${lessc} docs/index.less docs/index.css
${lessc} docs/dark.less docs/dark.css