#!/usr/bin/env bash
set -e
SCRIPT_DIR="$(realpath "$(dirname "$0")")"
source "$SCRIPT_DIR/env.sh"

analyzer_hostname=$(kubectl get service presidio-presidio-analyzer \
  --namespace presidio \
  --output jsonpath='{.status.loadBalancer.ingress[0].hostname}')
export PRESIDIO_ENDPOINT=http://$analyzer_hostname/analyze

pushd "${SCRIPT_DIR}/.."
serverless deploy
popd
