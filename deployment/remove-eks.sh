#!/usr/bin/env bash
set -e
SCRIPT_DIR="$(realpath "$(dirname "$0")")"
source "$SCRIPT_DIR/env.sh"

eksctl delete cluster \
  --name "$EKS_CLUSTER_NAME" \
  --region "$AWS_REGION"
