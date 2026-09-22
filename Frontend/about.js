/* =========================================================
   OUR GENDER LENS
   ABOUT US PAGE
   COMPLETELY INDEPENDENT JAVASCRIPT
========================================================= */


"use strict";


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", () => {


    /* =====================================================
       ELEMENTS
    ====================================================== */

    const pageLoader =
        document.getElementById("pageLoader");

    const siteHeader =
        document.getElementById("siteHeader");

    const menuToggle =
        document.getElementById("menuToggle");

    const mobileNavigation =
        document.getElementById("mobileNavigation");

    const revealElements =
        document.querySelectorAll(".reveal");


    /* =====================================================
       PAGE LOADER
    ====================================================== */

    window.addEventListener("load", () => {

        setTimeout(() => {

            if (pageLoader) {

                pageLoader.classList.add("hidden");

            }

        }, 350);

    });


    /* =====================================================
       HEADER SCROLL EFFECT
    ====================================================== */

    const handleHeaderScroll = () => {

        if (!siteHeader) {
            return;
        }


        if (window.scrollY > 30) {

            siteHeader.classList.add("scrolled");

        } else {

            siteHeader.classList.remove("scrolled");

        }

    };


    window.addEventListener(
        "scroll",
        handleHeaderScroll,
        {
            passive: true
        }
    );


    handleHeaderScroll();


    /* =====================================================
       MOBILE NAVIGATION
    ====================================================== */

    const openMobileMenu = () => {

        if (!menuToggle || !mobileNavigation) {
            return;
        }


        menuToggle.classList.add("active");

        mobileNavigation.classList.add("active");

        menuToggle.setAttribute(
            "aria-expanded",
            "true"
        );

        menuToggle.setAttribute(
            "aria-label",
            "Close navigation menu"
        );

        document.body.classList.add("menu-open");

    };


    const closeMobileMenu = () => {

        if (!menuToggle || !mobileNavigation) {
            return;
        }


        menuToggle.classList.remove("active");

        mobileNavigation.classList.remove("active");

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

        menuToggle.setAttribute(
            "aria-label",
            "Open navigation menu"
        );

        document.body.classList.remove("menu-open");

    };


    const toggleMobileMenu = () => {

        if (
            mobileNavigation &&
            mobileNavigation.classList.contains("active")
        ) {

            closeMobileMenu();

        } else {

            openMobileMenu();

        }

    };


    if (menuToggle) {

        menuToggle.addEventListener(
            "click",
            toggleMobileMenu
        );

    }


    /* =====================================================
       CLOSE MENU WHEN LINK IS CLICKED
    ====================================================== */

    if (mobileNavigation) {

        const mobileLinks =
            mobileNavigation.querySelectorAll("a");


        mobileLinks.forEach((link) => {

            link.addEventListener(
                "click",
                closeMobileMenu
            );

        });

    }


    /* =====================================================
       CLOSE MENU WITH ESCAPE
    ====================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape" &&
                mobileNavigation &&
                mobileNavigation.classList.contains("active")
            ) {

                closeMobileMenu();

            }

        }
    );


    /* =====================================================
       CLOSE MENU WHEN CLICKING OUTSIDE
    ====================================================== */

    document.addEventListener(
        "click",
        (event) => {

            if (
                !mobileNavigation ||
                !menuToggle
            ) {
                return;
            }


            const clickedInsideMenu =
                mobileNavigation.contains(event.target);

            const clickedMenuButton =
                menuToggle.contains(event.target);


            if (
                mobileNavigation.classList.contains("active") &&
                !clickedInsideMenu &&
                !clickedMenuButton
            ) {

                closeMobileMenu();

            }

        }
    );


    /* =====================================================
       SCROLL REVEAL
    ====================================================== */

    if ("IntersectionObserver" in window) {

        const revealObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach((entry) => {

                        if (entry.isIntersecting) {

                            entry.target.classList.add(
                                "active"
                            );

                            observer.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {
                    threshold: 0.12,

                    rootMargin:
                        "0px 0px -60px 0px"
                }
            );


        revealElements.forEach((element) => {

            revealObserver.observe(element);

        });

    } else {

        revealElements.forEach((element) => {

            element.classList.add("active");

        });

    }


    /* =====================================================
       SMOOTH ANCHOR SCROLLING
    ====================================================== */

    const anchorLinks =
        document.querySelectorAll(
            'a[href^="#"]'
        );


    anchorLinks.forEach((link) => {

        link.addEventListener(
            "click",
            (event) => {

                const targetId =
                    link.getAttribute("href");


                if (
                    !targetId ||
                    targetId === "#"
                ) {

                    return;

                }


                const target =
                    document.querySelector(targetId);


                if (!target) {

                    return;

                }


                event.preventDefault();


                const headerHeight =
                    siteHeader
                        ? siteHeader.offsetHeight
                        : 0;


                const targetPosition =
                    target.getBoundingClientRect().top +
                    window.scrollY -
                    headerHeight -
                    20;


                window.scrollTo({

                    top: targetPosition,

                    behavior: "smooth"

                });

            }
        );

    });


    /* =====================================================
       RESIZE HANDLER
    ====================================================== */

    let resizeTimer;


    window.addEventListener(
        "resize",
        () => {

            clearTimeout(resizeTimer);


            resizeTimer =
                setTimeout(() => {

                    if (
                        window.innerWidth > 900 &&
                        mobileNavigation &&
                        mobileNavigation.classList.contains("active")
                    ) {

                        closeMobileMenu();

                    }

                }, 150);

        }
    );


});