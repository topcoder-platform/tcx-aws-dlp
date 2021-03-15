#!/usr/bin/env bash
set -e
SCRIPT_DIR="$(realpath "$(dirname "$0")")"
source "$SCRIPT_DIR/env.sh"

ssh_id_file=".${EKS_CLUSTER_NAME}_id_rsa"
ssh_pub_key_file=".${EKS_CLUSTER_NAME}_id_rsa.pub"
if [[ ! -f $ssh_id_file ]]; then
  ssh-keygen -t rsa -b 2048 -f "$ssh_id_file"
fi

eksctl create cluster \
  --name "$EKS_CLUSTER_NAME" \
  --region "$AWS_REGION" \
  --node-type "$EKS_NODE_TYPE" \
  --nodes "$EKS_NODES_COUNT" \
  --nodes-min "$EKS_NODES_MIN" \
  --nodes-max "$EKS_NODES_MAX" \
  --ssh-access \
  --ssh-public-key "$ssh_pub_key_file" \
  --managed
