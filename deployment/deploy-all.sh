#!/usr/bin/env bash
set -e
SCRIPT_DIR="$(realpath "$(dirname "$0")")"
pushd "$SCRIPT_DIR"
./create-eks.sh
./deploy-presidio.sh
./deploy-dlp-trigger.sh
popd
