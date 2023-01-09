#!/usr/bin/env bash
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
set -e

LOGFILE="${PWD}/.npm/_logs/staging-$( date +'%Y-%m-%dT%H:%M:%s' ).log"
__setup_staging() {
  echo "Beginning the staging process..."  >> ${LOGFILE} 2>&1
# Setup staging directory
rm -rf ./staging >> ${LOGFILE} 2>&1 &&
mkdir -p  staging/views \
          staging/routes \
          staging/api \
          staging/assets >> ${LOGFILE} 2>&1 && \

# state all boxicons fonts
#cp assets/vendor/boxicons/fonts/** staging/fonts/ >> ${LOGFILE} 2>&1 && \
#cp -r assets/vendor/bootstrap-icons/fonts/** staging/fonts/ >> ${LOGFILE} 2>&1 && \

# stage all vendor files
cp -r assets/** staging/assets/ >> ${LOGFILE} 2>&1 && \
#
## stage all js files
#cp -r assets/js/** staging/js/ >> ${LOGFILE} 2>&1  && \
#
## stage all css files
#cp -r assets/css/*.css staging/css/  >> ${LOGFILE} 2>&1 && \
#
## stage all scss files
#cp -r assets/scss/*.scss staging/scss/  >> ${LOGFILE} 2>&1 && \
#
## stage all forms
#cp -r assets/forms/*.php staging/forms/  >> ${LOGFILE} 2>&1 && \
#
## stage all image files
#cp -R assets/img/** staging/img/  >> ${LOGFILE} 2>&1 && \

# stage all .html files
cp -r views/*.html staging/views/  >> ${LOGFILE} 2>&1 && \

# stage all routes files
cp -r routes/ staging/routes/  >> ${LOGFILE} 2>&1 && \

# stage all routes files
cp -r api/ staging/api/  >> ${LOGFILE} 2>&1 && \

# stage package.json file
cp package.json staging/  >> ${LOGFILE} 2>&1 && \

# stage server.js file
cp server.js staging/  >> ${LOGFILE} 2>&1 && \

# stage certs.js & certs.sh file
cp certs.js staging/  >> ${LOGFILE} 2>&1 && \
cp certs.sh staging/  >> ${LOGFILE} 2>&1 && \

echo "Staging github-pages files complete..." >> ${LOGFILE} 2>&1 && \

# list contents of all files staged
ls -liaR staging  >> ${LOGFILE} 2>&1 &&
return 0
}

__get_css_files(){
  VENDOR_PATH=$(find ${PWD} -type d -iname 'vendor')
  for dir in $(ls -R ${VENDOR_PATH}); do
    echo "${dir}"
  done
}

__main(){
  RESULT=$(__setup_staging)
  return 0;
}

__main > ${LOGFILE} 2>&1

################################################################