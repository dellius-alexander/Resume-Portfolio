#!/usr.bin/env bash

__setup_staging() {
# Setup staging directory
rm -rf staging
mkdir -p  staging/js \
          staging/css \
          staging/scss \
          staging/fonts \
          staging/img \
          staging/img/portfolio \
          staging/img/testimonials

# stage all js files
cp -r assets/js/ staging/js && \
cp assets/vendor/aos/aos.js staging/js && \
cp assets/vendor/purecounter/dist/purecounter_vanilla.js staging/js && \
cp assets/vendor/bootstrap/js/bootstrap.bundle.min.js staging/js && \
cp assets/vendor/glightbox/js/glightbox.min.js staging/js && \
cp assets/vendor/isotope-layout/isotope.pkgd.min.js staging/js && \
cp assets/vendor/swiper/swiper-bundle.min.js staging/js && \
cp assets/vendor/typed.js/typed.min.js staging/js && \
cp assets/vendor/waypoints/noframework.waypoints.js staging/js && \
cp assets/vendor/php-email-form/validate.js staging/js && \

# stage all css files
cp -r assets/css/ staging/css && \
cp assets/vendor/aos/aos.css staging/css && \
cp assets/vendor/bootstrap/css/bootstrap.min.css staging/css && \
cp assets/vendor/bootstrap-icons/bootstrap-icons.css staging/css && \
cp assets/vendor/boxicons/css/boxicons.min.css staging/css && \
cp assets/vendor/glightbox/css/glightbox.min.css staging/css && \
cp assets/vendor/swiper/swiper-bundle.min.css staging/css && \
cp assets/vendor/webfont/webfont.js staging/js && \

# stage all scss files
cp -r assets/scss/ staging/scss && \

# stage all webfont files


# stage all image files
cp -r assets/img/ staging/img && \
cp -r views/ staging/
}

__get_css_files(){
  VENDOR_PATH=$(find ${PWD} -type d -iname 'vendor')
  for dir in $(ls -R ${VENDOR_PATH}); do
    echo "${dir}"
  done
}

__setup_staging