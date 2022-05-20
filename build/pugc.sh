#!/bin/bash
procname=`basename $0`
pathname=`dirname $0`
home=${pathname}/..

find . -depth 1 -name '*.pug' -exec node ${pathname}/pugc.js ${home}/{} \;
find blog -name '*.pug' -exec node ${pathname}/pugc.js ${home}/{} \;
