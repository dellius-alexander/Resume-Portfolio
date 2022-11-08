#!/usr.bin/env bash

__setup_staging() {
# Setup staging directory
rm -rf staging
mkdir -p  staging/js \
          staging/css \
          staging/scss \
          staging/fonts \
          staging/forms \
          staging/img \
          staging/img/portfolio \
          staging/img/testimonials

# state all boxicons fonts
cp -r assets/vendor/boxicons/fonts/ staging/fonts && \
cp -r assets/vendor/bootstrap-icons/fonts/ staging/fonts && \

# stage all js files
cp -r assets/js/ staging/js/ && \
cp -r assets/vendor/aos/aos.js staging/js && \
cp -r assets/vendor/purecounter/dist/*.js staging/js && \
cp -r assets/vendor/bootstrap/js/*.js staging/js && \
cp -r assets/vendor/glightbox/js/*.js staging/js && \
cp -r assets/vendor/isotope-layout/*.js staging/js && \
cp -r assets/vendor/swiper/*.js staging/js && \
cp -r assets/vendor/typed.js/*.js staging/js && \
cp -r assets/vendor/waypoints/*.js staging/js && \
cp -r assets/vendor/php-email-form/*.js staging/js && \
cp -r assets/vendor/webfont/*.js staging/js && \

# stage all css files
cp -r assets/css/*.css staging/css && \
cp -r assets/vendor/aos/*.css staging/css && \
cp -r assets/vendor/bootstrap/css/*.css staging/css && \
cp -r assets/vendor/bootstrap/css/*.css.map staging/css && \
cp -r assets/vendor/bootstrap-icons/*.css staging/css && \
cp -r assets/vendor/boxicons/css/*.css staging/css && \
cp -r assets/vendor/glightbox/css/*.css staging/css && \
cp -r assets/vendor/swiper/*.css staging/css && \

# stage all scss files
cp -r assets/scss/*.scss staging/scss && \

# stage all forms
cp -r assets/forms/ staging/forms && \

# stage all image files
cp -r assets/img/ staging/img && \

# stage all .html files
cp -r views/ staging && \

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

__setup_staging
