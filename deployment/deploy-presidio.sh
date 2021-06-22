#!/bin/bash
set -e
REGISTRY=${1:-mcr.microsoft.com}
TAG=${2:-latest}
RELEASE=${3:-presidio}
helm upgrade $RELEASE --set registry=$REGISTRY,tag=$TAG ./charts/presidio --namespace presidio --create-namespace --install
