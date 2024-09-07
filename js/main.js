/**
 *    Copyright 2023 Dellius Alexander
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
(function() {
  "use strict";

  /* Easy selector helper function */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Event listener helper function.
   * @param {Event} event
   * @param {Selection} selector
   * @param {Function} listener
   * @param all
   */
  const on = (event, selector, listener, all = false) => {
    let selectEl = select(selector, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(event, listener))
      } else {
        selectEl.addEventListener(event, listener)
      }
    }
  }



  /* Easy on scroll event listener */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /* Scrolls to an element with header offset */
  const scroll_to = (el) => {
    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos,
      behavior: 'smooth'
    })
  }

  /* Start of execution */

  /* Navbar links active state on scroll */
  let navBarLinks = select('#navbar .scrollto', true)
  const activateNavBarLinks = () => {
    let position = window.scrollY + 200
    navBarLinks.forEach(navBarLink => {
      if (!navBarLink.hash) return
      let section = select(navBarLink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navBarLink.classList.add('active')
      } else {
        navBarLink.classList.remove('active')
      }
    })
  }
  /* Load the navigation panel on page load */
  window.addEventListener('load', activateNavBarLinks)
  onscroll(document, activateNavBarLinks)


  /* Back to top button */
  let back_to_top_selector = select('.back-to-top')
  if (back_to_top_selector) {
    const load_toggle_button = () => {
      if (window.scrollY > 100) {
        back_to_top_selector.classList.add('active')
      } else {
        back_to_top_selector.classList.remove('active')
      }
    }
    window.addEventListener('load', load_toggle_button)
    onscroll(document, load_toggle_button)
  }

  /* Mobile nav toggle */
  on('click', '.mobile-nav-toggle', function(e) {
    select('body').classList.toggle('mobile-nav-active')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /* Scroll with offset on links with a class name .scrollto */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault()

      let body = select('body')
      if (body.classList.contains('mobile-nav-active'))
      {
        body.classList.remove('mobile-nav-active')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
      scroll_to(this.hash)
    }
  }, true)

  /* Scroll with offset on page load with hash links in the url */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scroll_to(window.location.hash)
      }
    }
  });

  /* Hero type effect */
  const typed = select('.typed')
  if (typed) {
    let typed_strings = typed.getAttribute('data-typed-items')
    typed_strings = typed_strings.split(',')
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /* Skills animation */
  let skillsContent = select('.skills-content');
  if (skillsContent) {
    new Waypoint({
      element: skillsContent,
      offset: '80%',
      handler: function(direction) {
        let progress = select('.progress .progress-bar', true);
        progress.forEach((el) => {
          el.style.width = el.getAttribute('aria-valuenow') + '%'
        });
      }
    })
  }

  /* Portfolio isotope and filter */
  window.addEventListener('load', () => {
    let portfolioContainer = select('.portfolio-container');
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item'
      });

      let portfolioFilters = select('#portfolio-flters li', true);

      on('click', '#portfolio-flters li', function(e) {
        e.preventDefault();
        portfolioFilters.forEach(function(el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        portfolioIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        portfolioIsotope.on('arrangeComplete', function() {
          AOS.refresh()
        });
      }, true);
    }

  });

  /* Initiate portfolio lightbox */
  const portfolioLightbox = GLightbox({
    selector: '.portfolio-lightbox'
  });

  /* Portfolio details slider */
  new Swiper('.portfolio-details-slider', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  /* Testimonials slider */
  new Swiper('.testimonials-slider', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 20
      },

      1200: {
        slidesPerView: 3,
        spaceBetween: 20
      }
    }
  });

  /* Animation on scroll */
  window.addEventListener('load', () => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    })
  });

  /* Style About title */
  window.addEventListener('load', () => {
    const aboutTitle = select('.about-greeting-title');
    aboutTitle.style.fontFamily = 'Sans';
  })


  /**
   * Function to shrink the skills section
   */
  const shrinkSkills = () => {
    "use strict";
    const showMoreRegex = /Show\s*?More/g;
    const showLessRegex = /Show\s*?Less/g;
    let right_column = document.getElementById('right-column');
    let left_column = document.getElementById('left-column');
    let accordion_button = document.getElementById("accordion-button");
    let right_progress =  right_column.getElementsByClassName('progress');
    let left_progress =  left_column.getElementsByClassName('progress');
    if (showLessRegex.test(accordion_button.innerText))
    {
      accordion_button.innerText = 'Show More';
      // Display the first 6 skills
      for (let i = 0; i <= 5; i++)
      {
        setTimeout(function() {
          right_progress.item(i).style.display = "block";
          left_progress.item(i).style.display = "block";
        }, 1000);
      }
      // Hide the rest of the skills
      for (let i = 6; i < right_progress.length ; i++)
      {
        setTimeout(function() {
          right_progress.item(i).style.display = "none";
        }, 1000);
      }
      for (let i = 6; i < left_progress.length; i++)
      {
        setTimeout(function() {
          left_progress.item(i).style.display = "none";
        }, 1000);
      }
    } else if (showMoreRegex.test(accordion_button.innerText))
    {
      accordion_button.innerText = 'Show Less';
      // Display all the skills
      for (let i = 6; i < right_progress.length; i++)
      {
        setTimeout(function() {
          right_progress.item(i).style.display = "block";
        }, 1000);
      }
      for (let i = 6; i < left_progress.length; i++)
      {
        setTimeout(function() {
          left_progress.item(i).style.display = "block";
        }, 1000);
      }
    }
  }
  /* shrink the skills list */
  window.addEventListener('DOMContentLoaded', () => {
    const accordion_button = select('#accordion-button');
    if (/Show\s*?Less/g.test(accordion_button.innerText)){
      shrinkSkills();
    }
    accordion_button.addEventListener('click', shrinkSkills);
  }, true);

  /* Initiate Pure Counter */
  new PureCounter();

})()

