#!/usr/bin/env bash

set -ex

COMPANY=benoitguigal
IMAGE=airparif-predict

# Get version
version=`cat VERSION`
echo "version: $version"

# build images
chmod +x ./build.sh
./build.sh

# tag it
git commit --allow-empty -m "Bump to version $version"
git tag -a "$version" -m "version $version"
git push origin
git push origin --tags

docker tag $COMPANY/$IMAGE:latest $COMPANY/$IMAGE:$version

# push it
docker push $COMPANY/$IMAGE:latest
docker push $COMPANY/$IMAGE:$version