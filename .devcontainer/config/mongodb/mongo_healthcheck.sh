#!/bin/bash
set -eo pipefail

host="$(hostname --ip-address || echo '127.0.0.1')"
start=$(date +%s)

echo "Waiting for MongoDB to start..."
echo "Start: $start"

if mongo --eval "db.runCommand('ping').ok" "$host:27017/test "--quiet ; then
  end=$(date -d "+5 minutes" +%s)
  echo "End: $end"
  exit 0
fi

end=$(date +%s)
echo "End: $end"
exit 1