#!/usr/bin/env bash
set -e
SCRIPT_DIR="$(realpath "$(dirname "$0")")"
source "$SCRIPT_DIR/env.sh"

ANALYZER_HOSTNAME=""
while [ -z $ANALYZER_HOSTNAME ]; do
  echo "Waiting for end point..."
  ANALYZER_HOSTNAME=$(kubectl get ingress presidio \
    -n presidio \
    --output jsonpath='{.status.loadBalancer.ingress[0].hostname}' \
  )
  [ -z "$ANALYZER_HOSTNAME" ] && sleep 5
done

export PRESIDIO_ENDPOINT="https://${ANALYZER_HOSTNAME}/analyze"

pushd "${SCRIPT_DIR}/.."
serverless deploy
popd
