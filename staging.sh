#!/bin/bash
#/**
# *    Copyright 2022 Dellius Alexander
# *
# *    Licensed under the Apache License, Version 2.0 (the "License");
# *    you may not use this file except in compliance with the License.
# *    You may obtain a copy of the License at
# *
# *        http://www.apache.org/licenses/LICENSE-2.0
# *
# *    Unless required by applicable law or agreed to in writing, software
# *    distributed under the License is distributed on an "AS IS" BASIS,
# *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# *    See the License for the specific language governing permissions and
# *    limitations under the License.
# */

LOG_DIR=${PWD}/logs
mkdir -p  ${LOG_DIR}
LOG_FILE="${LOG_DIR}/staging-$( date +'%Y-%m-%dT%H:%M:%s' ).log"
STAGING=${1:-'staging'}
ls -liaR
__setup_staging() {
  local ASSETS_DIR=frontend/assets
  local VIEWS_DIR=frontend/views

  # Setup staging directory
  rm -rf $(find . -type d -iname 'staging*' &2>/dev/null) &&
  # Create staging directory
  mkdir -p  ${STAGING}/js \
            ${STAGING}/css \
            ${STAGING}/scss \
            ${STAGING}/fonts \
            ${STAGING}/forms \
            ${STAGING}/img

  # state all boxicons fonts
  cp -r ${ASSETS_DIR}/vendor/boxicons/fonts/** ${STAGING}/fonts/ &&
  cp -r ${ASSETS_DIR}/vendor/bootstrap-icons/fonts/** ${STAGING}/fonts/ &&

  # stage all js files
  cp -r ${ASSETS_DIR}/js/** ${STAGING}/js &&
  cp -r ${ASSETS_DIR}/vendor/aos/aos.js ${STAGING}/js &&

  cp -r ${ASSETS_DIR}/vendor/bootstrap/js/*.js* ${STAGING}/js &&
  cp -r ${ASSETS_DIR}/vendor/glightbox/js/*.js* ${STAGING}/js &&
  cp -r ${ASSETS_DIR}/vendor/isotope-layout/*.js* ${STAGING}/js &&
  cp -r ${ASSETS_DIR}/vendor/purecounter/dist/*.js* ${STAGING}/js &&
  cp -r ${ASSETS_DIR}/vendor/swiper/*.js* ${STAGING}/js &&
  cp -r ${ASSETS_DIR}/vendor/typed.js/*.js* ${STAGING}/js &&
  cp -r ${ASSETS_DIR}/vendor/waypoints/*.js* ${STAGING}/js &&
  cp -r ${ASSETS_DIR}/vendor/php-email-form/*.js* ${STAGING}/js &&
  cp -r ${ASSETS_DIR}/vendor/webfont/*.js* ${STAGING}/js &&

  # stage all css files
  cp -r ${ASSETS_DIR}/css/*.css ${STAGING}/css &&
  cp -r ${ASSETS_DIR}/vendor/aos/*.css ${STAGING}/css &&
  cp -r ${ASSETS_DIR}/vendor/bootstrap/css/*.css ${STAGING}/css &&
  cp -r ${ASSETS_DIR}/vendor/bootstrap/css/*.css.map ${STAGING}/css &&
  cp -r ${ASSETS_DIR}/vendor/bootstrap-icons/** ${STAGING}/css &&
  cp -r ${ASSETS_DIR}/vendor/boxicons/css/*.css ${STAGING}/css &&
  cp -r ${ASSETS_DIR}/vendor/glightbox/css/*.css ${STAGING}/css &&
  cp -r ${ASSETS_DIR}/vendor/swiper/*.css ${STAGING}/css &&

  # stage all scss files
  cp -r ${ASSETS_DIR}/scss/*.scss ${STAGING}/scss &&

  # stage all forms
  cp -r ${ASSETS_DIR}/forms/*.php ${STAGING}/forms &&

  # stage all image files
  cp -r ${ASSETS_DIR}/img/** ${STAGING}/img &&

  # stage all .html files
  cp -r ${VIEWS_DIR}/pages/*.html ${STAGING} &&

  # list contents of all files staged
  ls -liaR ${STAGING}  &&

  echo "Staging github-pages files complete..."

}

__setup_staging > ${LOG_FILE} 2>&1

cat "${LOG_FILE}"
################################################################