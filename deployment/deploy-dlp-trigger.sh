#!/usr/bin/env bash
set -e
SCRIPT_DIR="$(realpath "$(dirname "$0")")"
source "$SCRIPT_DIR/env.sh"

analyzer_hostname=""
while [ -z $analyzer_hostname ]; do
  echo "Waiting for end point..."
  analyzer_hostname=$(kubectl get ingress presidio-ingress \
    -n presidio \
    --output jsonpath='{.status.loadBalancer.ingress[0].hostname}' \
  )
  [ -z "$analyzer_hostname" ] && sleep 5
done

endpoint_basepath=$(kubectl get ingress presidio-ingress \
  -n presidio \
  --output jsonpath='{.spec.rules[0].http.paths[0].backend.serviceName}' \
)

export PRESIDIO_ENDPOINT=https://$analyzer_hostname/$endpoint_basepath/analyze

pushd "${SCRIPT_DIR}/.."
serverless deploy
popd
