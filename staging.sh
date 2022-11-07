#!/usr.bin/env bash

# Setup staging directory
rm -rf staging
mkdir -p  staging/js \
          staging/css \
          staging/scss \
          staging/img \
          staging/img/portfolio \
          staging/img/testimonials


cp -r assets/js staging/js && \
cp -r assets/css staging/css && \
cp -r assets/scss staging/scss && \
cp -r assets/img/portfolio staging/img/portfolio && \
cp -r assets/img/testimonials staging/img/testimonials &&  \
cp -r assets/img/ staging/img/ && \
cp -r views/ staging/
