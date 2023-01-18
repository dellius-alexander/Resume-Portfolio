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

LOGFILE="${PWD}/logs/staging-$( date +'%Y-%m-%dT%H:%M:%s' ).log"
mkdir -p "${PWD}/logs"
__setup_staging() {
# Setup staging directory
rm -rf staging &&
mkdir -p  staging/js \
          staging/css \
          staging/scss \
          staging/fonts \
          staging/forms \
          staging/img &&

ASSETS_DIR=$(find ~+ -type d -iname 'assets' -maxdepth 2)

VIEWS_DIR=$(find ~+ -type d -iname 'views' -maxdepth 2)

# state all boxicons fonts
cp -r ${ASSETS_DIR}/vendor/boxicons/fonts/** staging/fonts/ &&
cp -r ${ASSETS_DIR}/vendor/bootstrap-icons/fonts/** staging/fonts/ &&

# stage all js files
cp -r ${ASSETS_DIR}/js/** staging/js/ &&
cp -r ${ASSETS_DIR}/vendor/aos/aos.js staging/js/ &&
cp -r ${ASSETS_DIR}/vendor/purecounter/dist/*.js* staging/js/ &&
cp -r ${ASSETS_DIR}/vendor/bootstrap/js/** staging/js/ &&
cp -r ${ASSETS_DIR}/vendor/glightbox/js/** staging/js/ &&
cp -r ${ASSETS_DIR}/vendor/isotope-layout/** staging/js/ &&
cp -r ${ASSETS_DIR}/vendor/swiper/*.js* staging/js/ &&
cp -r ${ASSETS_DIR}/vendor/typed.js/** staging/js/ &&
cp -r ${ASSETS_DIR}/vendor/waypoints/** staging/js/ &&
cp -r ${ASSETS_DIR}/vendor/php-email-form/*.js staging/js/ &&
cp -r ${ASSETS_DIR}/vendor/webfont/*.js staging/js/ &&

# stage all css files
cp -r ${ASSETS_DIR}/css/*.css staging/css/ &&
cp -r ${ASSETS_DIR}/vendor/aos/*.css staging/css/ &&
cp -r ${ASSETS_DIR}/vendor/bootstrap/css/*.css staging/css/ &&
cp -r ${ASSETS_DIR}/vendor/bootstrap/css/*.css.map staging/css/ &&
cp -r ${ASSETS_DIR}/vendor/bootstrap-icons/** staging/css/ &&
cp -r ${ASSETS_DIR}/vendor/boxicons/css/*.css staging/css/ &&
cp -r ${ASSETS_DIR}/vendor/glightbox/css/*.css staging/css/ &&
cp -r ${ASSETS_DIR}/vendor/swiper/*.css staging/css/ &&

# stage all scss files
cp -r ${ASSETS_DIR}/scss/*.scss staging/scss/ &&

# stage all forms
cp -r ${ASSETS_DIR}/forms/*.php staging/forms/ &&

# stage all image files
cp -R ${ASSETS_DIR}/img/** staging/img/ &&

# stage all .html files
cp -r ${VIEWS_DIR}/views/pages/*.html staging/ &&

echo "Staging github-pages files complete..." &&

# list contents of all files staged
ls -liaR staging

}

__get_css_files(){
  VENDOR_PATH=$(find ${PWD} -type d -iname 'vendor')
  for dir in $(ls -R ${VENDOR_PATH}); do
    echo "${dir}"
  done
}

__setup_staging > ${LOGFILE} 2>&1

################################################################