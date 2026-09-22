/* =========================================================
   OGL RESOURCES PAGE
   BACKEND CONNECTED
   ========================================================= */


/* =========================================================
   CONFIGURATION
   ========================================================= */

const API_URL =
    "http://127.0.0.1:5000/api/resources";


/* =========================================================
   RESOURCE DATA
   ========================================================= */

let resources = [];


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const resourceGrid =
    document.getElementById("resourceGrid");

const resourceSearch =
    document.getElementById("resourceSearch");

const clearSearch =
    document.getElementById("clearSearch");

const filterButtons =
    document.querySelectorAll(".filter-button");

const resultsCount =
    document.getElementById("resultsCount");

const emptyState =
    document.getElementById("emptyState");

const resetFilters =
    document.getElementById("resetFilters");

const resourceModal =
    document.getElementById("resourceModal");

const modalOverlay =
    document.getElementById("modalOverlay");

const modalClose =
    document.getElementById("modalClose");

const modalTitle =
    document.getElementById("modalTitle");

const modalCategory =
    document.getElementById("modalCategory");

const modalDate =
    document.getElementById("modalDate");

const modalAuthor =
    document.getElementById("modalAuthor");

const modalBody =
    document.getElementById("modalBody");

const modalReadingTime =
    document.getElementById("modalReadingTime");

const modalAction =
    document.getElementById("modalAction");

const menuToggle =
    document.getElementById("menuToggle");

const mobileNav =
    document.getElementById("mobileNav");


/* =========================================================
   FEATURED RESOURCE ELEMENTS
   ========================================================= */

const featuredResource =
    document.querySelector(".featured-resource");

const featuredType =
    document.querySelector(
        ".featured-resource .resource-type"
    );

const featuredDate =
    document.querySelector(
        ".featured-resource .resource-date"
    );

const featuredTitle =
    document.querySelector(
        ".featured-resource .featured-content h2"
    );

const featuredDescription =
    document.querySelector(
        ".featured-resource .featured-content > p"
    );

const featuredReadingTime =
    document.querySelector(
        ".featured-resource .reading-time"
    );

const featuredButton =
    document.querySelector(
        ".featured-resource .read-resource"
    );


/* =========================================================
   STATE
   ========================================================= */

let currentFilter = "all";

let currentSearch = "";

let featuredResourceData = null;


/* =========================================================
   HELPER FUNCTIONS
   ========================================================= */

function getCategoryLabel(type) {

    const labels = {

        policy: "POLICY BRIEF",

        explainer: "EXPLAINER",

        blog: "BLOG"

    };

    return labels[type] || "RESOURCE";

}


/* =========================================================
   DATE FORMATTER
   ========================================================= */

function formatDate(dateString) {

    if (!dateString) {

        return "";

    }


    const date =
        new Date(dateString);


    if (isNaN(date.getTime())) {

        return dateString;

    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );

}


/* =========================================================
   GET READING TIME
   ========================================================= */

function getReadingTime(resource) {

    /*
     * Reading time is not currently stored
     * in the database.
     *
     * Keep the existing OGL wording.
     */

    return "Resource";

}


/* =========================================================
   UPDATE FEATURED RESOURCE
   ========================================================= */

function updateFeaturedResource() {

    /*
     * No published resources
     */

    if (
        !resources ||
        resources.length === 0
    ) {

        featuredResourceData = null;

        return;

    }


    /*
     * Use the most recently published resource
     * as the featured resource.
     */

    const sortedResources =
        [...resources].sort(
            (a, b) => {

                const dateA =
                    new Date(
                        a.publication_date || 0
                    ).getTime();

                const dateB =
                    new Date(
                        b.publication_date || 0
                    ).getTime();

                return dateB - dateA;

            }
        );


    featuredResourceData =
        sortedResources[0];


    const resource =
        featuredResourceData;


    /*
     * Update featured content
     */

    if (featuredType) {

        featuredType.textContent =
            resource.categoryLabel;

    }


    if (featuredDate) {

        featuredDate.textContent =
            resource.date;

    }


    if (featuredTitle) {

        featuredTitle.textContent =
            resource.title;

    }


    if (featuredDescription) {

        featuredDescription.textContent =
            resource.description ||
            "Explore this resource from Our Gender Lens.";

    }


    if (featuredReadingTime) {

        featuredReadingTime.textContent =
            getReadingTime(resource);

    }


    /*
     * Update featured button
     */

    if (featuredButton) {

        featuredButton.innerHTML =
            `
                Read resource
                <span>→</span>
            `;

        featuredButton.disabled = false;

    }

}


/* =========================================================
   LOAD RESOURCES FROM BACKEND
   ========================================================= */

async function loadResources() {

    try {

        /*
         * Show loading state
         */

        resourceGrid.innerHTML = "";

        emptyState.hidden = true;

        resultsCount.textContent =
            "Loading resources...";


        /*
         * Fetch resources
         */

        const response =
            await fetch(API_URL);


        if (!response.ok) {

            throw new Error(
                `HTTP error: ${response.status}`
            );

        }


        const data =
            await response.json();


        /*
         * Only show published resources
         */

        resources =
            data
                .filter(
                    resource =>
                        resource.status === "published"
                )
                .map(
                    resource => {

                        return {

                            ...resource,

                            category:
                                resource.type ||
                                "other",

                            categoryLabel:
                                getCategoryLabel(
                                    resource.type
                                ),

                            date:
                                formatDate(
                                    resource.publication_date
                                ),

                            readingTime:
                                getReadingTime(
                                    resource
                                ),

                            content:
                                resource.description ||
                                "",

                            /*
                             * file_url
                             * = private Supabase Storage path
                             *
                             * file_access_url
                             * = temporary signed URL
                             * generated by Flask
                             */

                            fileAccessUrl:
                                resource.file_access_url ||
                                ""

                        };

                    }
                );


        console.log(
            "Published resources loaded:",
            resources
        );


        /*
         * Update the featured resource
         */

        updateFeaturedResource();


        /*
         * Render resource cards
         */

        renderResources();


    } catch (error) {

        console.error(
            "Failed to load resources:",
            error
        );


        resources = [];

        resourceGrid.innerHTML = "";


        /*
         * Show error state
         */

        emptyState.hidden = false;

        resultsCount.textContent =
            "Unable to load resources";


        const emptyTitle =
            emptyState.querySelector("h3");

        const emptyText =
            emptyState.querySelector("p");


        if (emptyTitle) {

            emptyTitle.textContent =
                "Unable to load resources";

        }


        if (emptyText) {

            emptyText.textContent =
                "We couldn't connect to the OGL resources server. Please try again in a moment.";

        }

    }

}


/* =========================================================
   CREATE RESOURCE CARD
   ========================================================= */

function createResourceCard(resource) {

    const card =
        document.createElement("article");


    card.className =
        "resource-card reveal";


    card.dataset.category =
        resource.category;


    card.innerHTML = `

        <div class="card-accent"></div>


        <div class="card-top">

            <span class="card-category">
                ${resource.categoryLabel}
            </span>


            <span class="card-date">
                ${resource.date}
            </span>

        </div>


        <h3>
            ${resource.title}
        </h3>


        <p class="resource-card-description">
            ${resource.description || ""}
        </p>


        <div class="card-footer">

            <span class="card-reading">
                ${resource.readingTime}
            </span>


            <button
                class="card-link"
                type="button"
                data-resource-id="${resource.id}"
            >
                Read more
                <span>→</span>
            </button>

        </div>

    `;


    return card;

}


/* =========================================================
   RENDER RESOURCES
   ========================================================= */

function renderResources() {

    resourceGrid.innerHTML = "";


    const filteredResources =
        resources.filter(
            resource => {

                /*
                 * Category filter
                 */

                const matchesCategory =
                    currentFilter === "all" ||
                    resource.category ===
                        currentFilter;


                /*
                 * Search filter
                 */

                const searchText =
                    currentSearch
                        .toLowerCase()
                        .trim();


                const matchesSearch =
                    !searchText ||

                    (resource.title || "")
                        .toLowerCase()
                        .includes(searchText) ||

                    (resource.description || "")
                        .toLowerCase()
                        .includes(searchText) ||

                    (resource.categoryLabel || "")
                        .toLowerCase()
                        .includes(searchText) ||

                    (resource.author || "")
                        .toLowerCase()
                        .includes(searchText);


                return (
                    matchesCategory &&
                    matchesSearch
                );

            }
        );


    /*
     * EMPTY STATE
     */

    if (
        filteredResources.length === 0
    ) {

        emptyState.hidden = false;

        resultsCount.textContent =
            resources.length === 0
                ? "No published resources"
                : "No resources found";

        return;

    }


    emptyState.hidden = true;


    /*
     * RESULTS COUNT
     */

    resultsCount.textContent =
        `${filteredResources.length} ${
            filteredResources.length === 1
                ? "resource"
                : "resources"
        } found`;


    /*
     * CREATE CARDS
     */

    filteredResources.forEach(
        resource => {

            const card =
                createResourceCard(
                    resource
                );

            resourceGrid.appendChild(
                card
            );

        }
    );


    observeRevealElements();

}


/* =========================================================
   FILTER BUTTONS
   ========================================================= */

filterButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                currentFilter =
                    button.dataset.filter;


                filterButtons.forEach(
                    item => {

                        const isActive =
                            item === button;


                        item.classList.toggle(
                            "active",
                            isActive
                        );


                        item.setAttribute(
                            "aria-selected",
                            isActive
                                ? "true"
                                : "false"
                        );

                    }
                );


                renderResources();

            }
        );

    }
);


/* =========================================================
   SEARCH
   ========================================================= */

resourceSearch.addEventListener(
    "input",
    event => {

        currentSearch =
            event.target.value;


        clearSearch.classList.toggle(
            "visible",
            currentSearch.length > 0
        );


        renderResources();

    }
);


/* =========================================================
   CLEAR SEARCH
   ========================================================= */

clearSearch.addEventListener(
    "click",
    () => {

        resourceSearch.value =
            "";

        currentSearch =
            "";


        clearSearch.classList.remove(
            "visible"
        );


        resourceSearch.focus();


        renderResources();

    }
);


/* =========================================================
   RESET FILTERS
   ========================================================= */

resetFilters.addEventListener(
    "click",
    () => {

        currentFilter =
            "all";

        currentSearch =
            "";


        resourceSearch.value =
            "";


        clearSearch.classList.remove(
            "visible"
        );


        filterButtons.forEach(
            button => {

                const isActive =
                    button.dataset.filter ===
                    "all";


                button.classList.toggle(
                    "active",
                    isActive
                );


                button.setAttribute(
                    "aria-selected",
                    isActive
                        ? "true"
                        : "false"
                );

            }
        );


        renderResources();

    }
);


/* =========================================================
   OPEN RESOURCE
   ========================================================= */

function openResource(resourceId) {

    const resource =
        resources.find(
            item =>
                String(item.id) ===
                String(resourceId)
        );


    if (!resource) {

        return;

    }


    modalTitle.textContent =
        resource.title;


    modalCategory.textContent =
        resource.categoryLabel;


    modalDate.textContent =
        resource.date;


    modalAuthor.textContent =
        resource.author ||
        "OGL Research Team";


    modalBody.textContent =
        resource.description ||
        "No description available.";


    modalReadingTime.textContent =
        resource.readingTime;


    /*
     * Store resource ID
     */

    modalAction.dataset.resourceId =
        resource.id;


    /*
     * Store signed URL
     */

    modalAction.dataset.fileAccessUrl =
        resource.fileAccessUrl ||
        "";


    /*
     * Update action button
     */

    if (resource.fileAccessUrl) {

        modalAction.innerHTML =
            `
                Read full resource
                <span>→</span>
            `;


        modalAction.disabled =
            false;

    } else {

        modalAction.innerHTML =
            `
                Document unavailable
            `;


        modalAction.disabled =
            true;

    }


    /*
     * Open modal
     */

    resourceModal.classList.add(
        "active"
    );


    resourceModal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow =
        "hidden";


    modalClose.focus();

}


/* =========================================================
   RESOURCE CARD CLICK
   ========================================================= */

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "[data-resource-id]"
            );


        if (!button) {

            return;

        }


        const resourceId =
            button.dataset.resourceId;


        /*
         * Don't trigger this handler
         * for the modal action button.
         */

        if (
            resourceId &&
            button !== modalAction
        ) {

            openResource(
                resourceId
            );

        }

    }
);


/* =========================================================
   FEATURED RESOURCE CLICK
   ========================================================= */

if (featuredButton) {

    featuredButton.addEventListener(
        "click",
        () => {

            if (
                featuredResourceData
            ) {

                openResource(
                    featuredResourceData.id
                );

            }

        }
    );

}


/* =========================================================
   MODAL CLOSE
   ========================================================= */

function closeResourceModal() {

    resourceModal.classList.remove(
        "active"
    );


    resourceModal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.style.overflow =
        "";

}


/* =========================================================
   CLOSE BUTTON
   ========================================================= */

modalClose.addEventListener(
    "click",
    closeResourceModal
);


/* =========================================================
   OVERLAY CLOSE
   ========================================================= */

modalOverlay.addEventListener(
    "click",
    closeResourceModal
);


/* =========================================================
   ESCAPE KEY
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            resourceModal.classList.contains(
                "active"
            )
        ) {

            closeResourceModal();

        }

    }
);


/* =========================================================
   MODAL ACTION
   ========================================================= */

modalAction.addEventListener(
    "click",
    () => {

        const resourceId =
            modalAction.dataset.resourceId;


        const resource =
            resources.find(
                item =>
                    String(item.id) ===
                    String(resourceId)
            );


        if (!resource) {

            return;

        }


        /*
         * IMPORTANT
         *
         * file_url is only the private
         * Supabase Storage path.
         *
         * fileAccessUrl is the temporary
         * signed URL generated by Flask.
         */

        const fileAccessUrl =
            resource.fileAccessUrl;


        if (fileAccessUrl) {

            window.open(
                fileAccessUrl,
                "_blank",
                "noopener,noreferrer"
            );

            return;

        }


        alert(
            "The full resource document has not been uploaded yet."
        );

    }
);


/* =========================================================
   MOBILE MENU
   ========================================================= */

menuToggle.addEventListener(
    "click",
    () => {

        const isOpen =
            mobileNav.classList.toggle(
                "open"
            );


        menuToggle.setAttribute(
            "aria-expanded",
            isOpen
                ? "true"
                : "false"
        );

    }
);


/* =========================================================
   CLOSE MOBILE MENU WHEN NAVIGATING
   ========================================================= */

document.querySelectorAll(
    ".mobile-nav a"
).forEach(
    link => {

        link.addEventListener(
            "click",
            () => {

                mobileNav.classList.remove(
                    "open"
                );


                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }
        );

    }
);


/* =========================================================
   SCROLL REVEAL
   ========================================================= */

let revealObserver;


function observeRevealElements() {

    const elements =
        document.querySelectorAll(
            ".reveal:not(.observed)"
        );


    if (!revealObserver) {

        revealObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(
                        entry => {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target.classList.add(
                                    "visible"
                                );


                                entry.target.classList.add(
                                    "observed"
                                );


                                revealObserver.unobserve(
                                    entry.target
                                );

                            }

                        }
                    );

                },
                {
                    threshold: 0.12
                }
            );

    }


    elements.forEach(
        element => {

            element.classList.add(
                "observed"
            );


            revealObserver.observe(
                element
            );

        }
    );

}


/* =========================================================
   INITIALISE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        observeRevealElements();

        loadResources();

    }
);