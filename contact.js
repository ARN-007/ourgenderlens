/* ============================================================
   OUR GENDER LENS — CONTACT PAGE
   contact.js
============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    /* ========================================================
       ELEMENTS
    ========================================================= */

    const header = document.getElementById("siteHeader");
    const menuToggle = document.getElementById("menuToggle");
    const mainNavigation = document.getElementById("mainNavigation");
    const contactForm = document.getElementById("contactForm");
    const formSuccess = document.getElementById("formSuccess");
    const currentYear = document.getElementById("currentYear");


    /* ========================================================
       HEADER SCROLL EFFECT
    ========================================================= */

    const handleHeaderScroll = () => {
        if (!header) return;

        if (window.scrollY > 25) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    };

    window.addEventListener(
        "scroll",
        handleHeaderScroll,
        { passive: true }
    );

    handleHeaderScroll();


    /* ========================================================
       MOBILE NAVIGATION
    ========================================================= */

    if (menuToggle && mainNavigation) {

        menuToggle.addEventListener("click", () => {

            const isOpen =
                menuToggle.classList.toggle("open");

            mainNavigation.classList.toggle(
                "open",
                isOpen
            );

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            menuToggle.setAttribute(
                "aria-label",
                isOpen
                    ? "Close navigation"
                    : "Open navigation"
            );
        });


        /* Close menu when navigation link is selected */

        const navigationLinks =
            mainNavigation.querySelectorAll("a");

        navigationLinks.forEach((link) => {

            link.addEventListener("click", () => {

                menuToggle.classList.remove("open");

                mainNavigation.classList.remove("open");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuToggle.setAttribute(
                    "aria-label",
                    "Open navigation"
                );
            });
        });


        /* Close menu when clicking outside */

        document.addEventListener("click", (event) => {

            const clickedInsideHeader =
                event.target.closest(".site-header");

            if (
                !clickedInsideHeader &&
                mainNavigation.classList.contains("open")
            ) {

                menuToggle.classList.remove("open");

                mainNavigation.classList.remove("open");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuToggle.setAttribute(
                    "aria-label",
                    "Open navigation"
                );
            }
        });
    }


    /* ========================================================
       SCROLL REVEAL
    ========================================================= */

    const revealElements =
        document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {

        const revealObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach((entry) => {

                        if (!entry.isIntersecting) return;

                        entry.target.classList.add("visible");

                        observer.unobserve(entry.target);
                    });
                },
                {
                    threshold: 0.12,
                    rootMargin: "0px 0px -40px 0px"
                }
            );

        revealElements.forEach((element) => {
            revealObserver.observe(element);
        });

    } else {

        revealElements.forEach((element) => {
            element.classList.add("visible");
        });
    }


    /* ========================================================
       FORM HELPERS
    ========================================================= */

    const getErrorElement = (fieldName) => {

        return document.querySelector(
            '[data-error-for="' + fieldName + '"]'
        );
    };


    const setFieldError = (fieldName, message) => {

        const field =
            document.getElementById(fieldName);

        const error =
            getErrorElement(fieldName);

        if (field) {

            const formField =
                field.closest(".form-field");

            if (formField) {
                formField.classList.add("error");
            }
        }

        if (error) {
            error.textContent = message;
        }
    };


    const clearFieldError = (fieldName) => {

        const field =
            document.getElementById(fieldName);

        const error =
            getErrorElement(fieldName);

        if (field) {

            const formField =
                field.closest(".form-field");

            if (formField) {
                formField.classList.remove("error");
            }
        }

        if (error) {
            error.textContent = "";
        }
    };


    const clearAllErrors = () => {

        [
            "name",
            "email",
            "enquiry",
            "subject",
            "message",
            "consent"
        ].forEach(clearFieldError);
    };


    /* ========================================================
       EMAIL VALIDATION
    ========================================================= */

    const isValidEmail = (email) => {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };


    /* ========================================================
       FORM VALIDATION
    ========================================================= */

    const validateForm = () => {

        clearAllErrors();

        let isValid = true;


        const name =
            document.getElementById("name").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const enquiry =
            document.getElementById("enquiry").value;

        const subject =
            document.getElementById("subject").value.trim();

        const message =
            document.getElementById("message").value.trim();

        const consent =
            document.getElementById("consent").checked;


        /* Name */

        if (name.length < 2) {

            setFieldError(
                "name",
                "Please enter your name."
            );

            isValid = false;
        }


        /* Email */

        if (!isValidEmail(email)) {

            setFieldError(
                "email",
                "Please enter a valid email address."
            );

            isValid = false;
        }


        /* Enquiry */

        if (!enquiry) {

            setFieldError(
                "enquiry",
                "Please select an enquiry type."
            );

            isValid = false;
        }


        /* Subject */

        if (subject.length < 3) {

            setFieldError(
                "subject",
                "Please enter a subject."
            );

            isValid = false;
        }


        /* Message */

        if (message.length < 10) {

            setFieldError(
                "message",
                "Please tell us a little more about your enquiry."
            );

            isValid = false;
        }


        /* Consent */

        if (!consent) {

            setFieldError(
                "consent",
                "Please confirm your consent before submitting."
            );

            isValid = false;
        }


        return isValid;
    };


    /* ========================================================
       CLEAR FIELD ERRORS WHILE TYPING
    ========================================================= */

    [
        "name",
        "email",
        "enquiry",
        "subject",
        "message",
        "consent"
    ].forEach((fieldName) => {

        const field =
            document.getElementById(fieldName);

        if (!field) return;


        const eventType =
            field.type === "checkbox" ||
            field.tagName === "SELECT"
                ? "change"
                : "input";


        field.addEventListener(
            eventType,
            () => clearFieldError(fieldName)
        );
    });


    /* ========================================================
       FORM SUBMISSION
    ========================================================= */

    if (contactForm) {

        contactForm.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();


                if (!validateForm()) {

                    const firstError =
                        contactForm.querySelector(
                            ".error input, .error select, .error textarea"
                        );

                    if (firstError) {
                        firstError.focus();
                    }

                    return;
                }


                /*
                 * This is currently a front-end-only demonstration.
                 *
                 * When the real backend/email service is ready,
                 * replace this section with the actual API request.
                 */


                const submitButton =
                    contactForm.querySelector(".submit-button");


                if (!submitButton) return;


                submitButton.disabled = true;


                const buttonText =
                    submitButton.querySelector("span:first-child");


                if (buttonText) {
                    buttonText.textContent = "Sending...";
                }


                setTimeout(() => {

                    if (formSuccess) {
                        formSuccess.classList.add("show");
                    }


                    submitButton.style.display = "none";


                    contactForm.reset();


                    if (formSuccess) {

                        formSuccess.scrollIntoView({
                            behavior: "smooth",
                            block: "nearest"
                        });
                    }

                }, 700);
            }
        );
    }


    /* ========================================================
       CURRENT YEAR
    ========================================================= */

    if (currentYear) {

        currentYear.textContent =
            new Date().getFullYear();
    }


    /* ========================================================
       ESCAPE KEY — CLOSE MOBILE MENU
    ========================================================= */

    document.addEventListener("keydown", (event) => {

        if (event.key !== "Escape") return;


        if (
            !mainNavigation ||
            !mainNavigation.classList.contains("open")
        ) {
            return;
        }


        mainNavigation.classList.remove("open");

        if (menuToggle) {

            menuToggle.classList.remove("open");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            menuToggle.setAttribute(
                "aria-label",
                "Open navigation"
            );
        }
    });

});