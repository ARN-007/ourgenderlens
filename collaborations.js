/* =========================================================
   OUR GENDER LENS
   COLLABORATIONS PAGE
   ========================================================= */


/* =========================================================
   HEADER SCROLL EFFECT
   ========================================================= */

const siteHeader = document.getElementById("siteHeader");

function handleHeaderScroll() {

    if (!siteHeader) return;

    if (window.scrollY > 30) {
        siteHeader.classList.add("scrolled");
    } else {
        siteHeader.classList.remove("scrolled");
    }
}

window.addEventListener("scroll", handleHeaderScroll);

handleHeaderScroll();


/* =========================================================
   MOBILE MENU
   ========================================================= */

const mobileMenuToggle =
    document.getElementById("mobileMenuToggle");

const mobileNav =
    document.getElementById("mobileNav");

if (mobileMenuToggle && mobileNav) {

    mobileMenuToggle.addEventListener("click", () => {

        const isOpen =
            mobileMenuToggle.classList.toggle("active");

        mobileNav.classList.toggle("active");

        mobileMenuToggle.setAttribute(
            "aria-expanded",
            isOpen
        );

        mobileMenuToggle.setAttribute(
            "aria-label",
            isOpen
                ? "Close navigation menu"
                : "Open navigation menu"
        );

    });


    const mobileLinks =
        mobileNav.querySelectorAll("a");

    mobileLinks.forEach(link => {

        link.addEventListener("click", () => {

            mobileMenuToggle.classList.remove("active");

            mobileNav.classList.remove("active");

            mobileMenuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            mobileMenuToggle.setAttribute(
                "aria-label",
                "Open navigation menu"
            );

        });

    });

}


/* =========================================================
   SCROLL REVEAL ANIMATIONS
   ========================================================= */

const revealElements =
    document.querySelectorAll(".reveal");

const revealObserver =
    new IntersectionObserver(
        (entries, observer) => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("revealed");

                observer.unobserve(entry.target);

            });

        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -40px 0px"
        }
    );


revealElements.forEach(element => {

    revealObserver.observe(element);

});


/* =========================================================
   COLLABORATION MODAL
   ========================================================= */

const modal =
    document.getElementById("collabModal");

const modalOverlay =
    document.getElementById("modalOverlay");

const modalClose =
    document.getElementById("modalClose");

const modalTitle =
    document.getElementById("modalTitle");

const modalDescription =
    document.getElementById("modalDescription");

const collaborationButtons =
    document.querySelectorAll(".view-collab");


function openCollaborationModal(button) {

    if (!modal) return;

    const title =
        button.getAttribute("data-title");

    const description =
        button.getAttribute("data-description");

    if (modalTitle) {
        modalTitle.textContent =
            title || "Collaboration";
    }

    if (modalDescription) {
        modalDescription.textContent =
            description || "Collaboration details.";
    }

    modal.classList.add("active");

    document.body.classList.add("modal-open");

    if (modalClose) {
        modalClose.focus();
    }

}


function closeCollaborationModal() {

    if (!modal) return;

    modal.classList.remove("active");

    document.body.classList.remove("modal-open");

}


collaborationButtons.forEach(button => {

    button.addEventListener("click", () => {

        openCollaborationModal(button);

    });

});


if (modalClose) {

    modalClose.addEventListener(
        "click",
        closeCollaborationModal
    );

}


if (modalOverlay) {

    modalOverlay.addEventListener(
        "click",
        closeCollaborationModal
    );

}


/* =========================================================
   ESCAPE KEY
   ========================================================= */

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        closeCollaborationModal();

    }

});


/* =========================================================
   SMOOTH INTERNAL LINKS
   ========================================================= */

const internalLinks =
    document.querySelectorAll('a[href^="#"]');

internalLinks.forEach(link => {

    link.addEventListener("click", event => {

        const targetId =
            link.getAttribute("href");

        if (!targetId || targetId === "#") {
            return;
        }

        const target =
            document.querySelector(targetId);

        if (!target) {
            return;
        }

        event.preventDefault();

        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });

});


/* =========================================================
   REDUCE MOTION ACCESSIBILITY
   ========================================================= */

const prefersReducedMotion =
    window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );


if (prefersReducedMotion.matches) {

    document.documentElement.style.scrollBehavior =
        "auto";

    revealElements.forEach(element => {

        element.classList.add("revealed");

    });

}