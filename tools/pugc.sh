#!/bin/bash
procname=`basename $0`
pathname=`dirname $0`
home=${pathname}/..

pugc="node ${pathname}/pugc.js"

find . -depth 1 -name '*.pug' -exec ${pugc} ${home}/{} \;
find about -name '*.pug' -exec ${pugc} ${home}/{} \;
find blog -name '*.pug' -exec ${pugc} ${home}/{} \;
find docs -name '*.pug' -exec ${pugc} ${home}/{} \;

