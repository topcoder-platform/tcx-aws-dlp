#!/bin/bash
set -e
REGISTRY=${1:-mcr.microsoft.com}
TAG=${2:-latest}
RELEASE=${3:-presidio}
helm install $RELEASE --set registry=$REGISTRY,tag=$TAG ./charts/presidio --namespace presidio --create-namespace
