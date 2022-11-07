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

# state all boxicons fonts
cp -R assets/vendor/boxicons/fonts/** staging/fonts/ && \
cp -R assets/vendor/bootstrap-icons/fonts/** staging/fonts/ && \

# stage all js files
cp -R assets/js/** staging/js/ && \
cp assets/vendor/aos/aos.js staging/js/ && \
cp assets/vendor/purecounter/dist/purecounter_vanilla.js staging/js/ && \
cp -R assets/vendor/bootstrap/js/** staging/js/ && \
cp -R assets/vendor/glightbox/js/** staging/js/ && \
cp assets/vendor/isotope-layout/isotope.pkgd.min.js staging/js/ && \
cp assets/vendor/swiper/swiper-bundle.min.js staging/js/ && \
cp assets/vendor/typed.js/typed.min.js staging/js/ && \
cp assets/vendor/waypoints/noframework.waypoints.js staging/js/ && \
cp assets/vendor/php-email-form/validate.js staging/js/ && \

# stage all css files
cp -R assets/css/** staging/css/ && \
cp assets/vendor/aos/aos.css staging/css/ && \
cp assets/vendor/bootstrap/css/bootstrap.min.css staging/css/ && \
cp assets/vendor/bootstrap/css/bootstrap.min.css.map staging/css/ && \
cp assets/vendor/bootstrap-icons/bootstrap-icons.css staging/css/ && \
cp assets/vendor/boxicons/css/boxicons.min.css staging/css/ && \
cp assets/vendor/glightbox/css/glightbox.min.css staging/css/ && \
cp assets/vendor/swiper/swiper-bundle.min.css staging/css/ && \
cp assets/vendor/webfont/webfont.js staging/js/ && \

# stage all scss files
cp -R assets/scss/ staging/scss/ && \

# stage all image files
cp -R assets/img/** staging/img/ && \
cp -R views/** staging/
return 0
}

__get_css_files(){
  VENDOR_PATH=$(find ${PWD} -type d -iname 'vendor')
  for dir in $(ls -R ${VENDOR_PATH}); do
    echo "${dir}"
  done
}

__setup_staging
echo "Staging github-pages files complete..."