#!/usr/bin/env bash
set -ex

# docker hub company
COMPANY=benoitguigal
# image name
IMAGE=airparif-predict
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
docker build -t $COMPANY/$IMAGE:latest $DIR