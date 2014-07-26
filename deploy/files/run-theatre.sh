#!/bin/sh
exec node --nouse-idle-notification --max-old-space-size=8192 --trace-gc /root/projects/theatre/bin/www 1> /root/projects/theatre/logs/access.log 2> /root/projects/theatre/logs/errors.log
