/* =====================================================
   DOM READY
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

  initializeMobileMenu();

  initializeCurrentYear();

  initializeAnimations();

});


/* =====================================================
   MOBILE MENU
===================================================== */

function initializeMobileMenu() {

  const menuBtn = document.querySelector(".menu-btn");
  const navLinks = document.querySelector(".nav-links");

  if (!menuBtn || !navLinks) {
    return;
  }

  const menuIcon = menuBtn.querySelector("i");


  function closeMenu() {

    navLinks.classList.remove("show");

    menuBtn.setAttribute(
      "aria-expanded",
      "false"
    );

    menuBtn.setAttribute(
      "aria-label",
      "Open navigation menu"
    );

    if (menuIcon) {
      menuIcon.classList.remove("fa-xmark");
      menuIcon.classList.add("fa-bars");
    }

  }


  function openMenu() {

    navLinks.classList.add("show");

    menuBtn.setAttribute(
      "aria-expanded",
      "true"
    );

    menuBtn.setAttribute(
      "aria-label",
      "Close navigation menu"
    );

    if (menuIcon) {
      menuIcon.classList.remove("fa-bars");
      menuIcon.classList.add("fa-xmark");
    }

  }


  menuBtn.addEventListener("click", () => {

    const isOpen =
      navLinks.classList.contains("show");

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }

  });


  const navigationLinks =
    navLinks.querySelectorAll("a");


  navigationLinks.forEach((link) => {

    link.addEventListener("click", () => {

      closeMenu();

    });

  });


  document.addEventListener("click", (event) => {

    const clickedInsideNavigation =
      navLinks.contains(event.target);

    const clickedMenuButton =
      menuBtn.contains(event.target);

    if (
      !clickedInsideNavigation &&
      !clickedMenuButton
    ) {
      closeMenu();
    }

  });


  window.addEventListener("resize", () => {

    if (window.innerWidth > 900) {
      closeMenu();
    }

  });

}


/* =====================================================
   CURRENT YEAR
===================================================== */

function initializeCurrentYear() {

  const yearElement =
    document.querySelector("#current-year");

  if (yearElement) {

    yearElement.textContent =
      new Date().getFullYear();

  }

}


/* =====================================================
   ANIMATIONS
===================================================== */

function initializeAnimations() {

  const prefersReducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;


  if (prefersReducedMotion) {

    document
      .querySelectorAll(
        ".reveal, .reveal-left, .reveal-right, .scale-reveal"
      )
      .forEach((element) => {

        element.style.opacity = "1";
        element.style.transform = "none";

      });

    return;

  }


  if (typeof gsap === "undefined") {
    return;
  }


  /* =====================================================
     HERO ENTRANCE
  ===================================================== */

  const heroTimeline = gsap.timeline();


  heroTimeline

    .from(".logo", {
      y: -30,
      opacity: 0,
      duration: 0.8,
      ease: "power4.out"
    })

    .from(".nav-links a", {
      y: -20,
      opacity: 0,
      stagger: 0.06,
      duration: 0.6,
      ease: "power4.out"
    }, "-=0.4")

    .to(".hero-content", {
      opacity: 1,
      x: 0,
      duration: 0.9,
      ease: "power4.out"
    }, "-=0.3")

    .to(".hero-image-wrapper", {
      opacity: 1,
      x: 0,
      duration: 1,
      ease: "power4.out"
    }, "-=0.6");


  /* =====================================================
     SCROLL REVEAL
  ===================================================== */

  const revealItems = document.querySelectorAll(
    ".reveal, .reveal-left, .reveal-right, .scale-reveal"
  );


  if (revealItems.length === 0) {
    return;
  }


  const observer =
    new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          if (!entry.isIntersecting) {
            return;
          }


          const element =
            entry.target;


          let animation = {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: "power4.out"
          };


          if (
            element.classList.contains(
              "scale-reveal"
            )
          ) {

            animation.scale = 1;

          }


          gsap.to(
            element,
            animation
          );


          observer.unobserve(
            element
          );

        });

      },

      {
        threshold: 0.15,
        rootMargin: "0px 0px -80px 0px"
      }
    );


  revealItems.forEach((element) => {

    observer.observe(
      element
    );

  });


  /* =====================================================
     FEATURE CARD STAGGER
  ===================================================== */

  const featureGrid =
    document.querySelector(".feature-grid");


  if (featureGrid) {

    const featureCards =
      featureGrid.querySelectorAll(
        ".feature-card"
      );


    const featureObserver =
      new IntersectionObserver(
        (entries) => {

          entries.forEach((entry) => {

            if (!entry.isIntersecting) {
              return;
            }


            gsap.to(
              featureCards,
              {
                opacity: 1,
                y: 0,
                stagger: 0.15,
                duration: 0.8,
                ease: "power4.out"
              }
            );


            featureObserver.unobserve(
              entry.target
            );

          });

        },

        {
          threshold: 0.2
        }
      );


    featureObserver.observe(
      featureGrid
    );

  }

}