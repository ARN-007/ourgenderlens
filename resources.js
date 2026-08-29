/* =========================================================
   OGL RESOURCES PAGE
   ========================================================= */


/* =========================================================
   RESOURCE DATA
   =========================================================
   
   TEMPORARY FRONTEND DATA
   
   Later, this section will be replaced by data received
   from the OGL backend API.

   ========================================================= */

const resources = [

    {
        id: "resource-01",
        category: "policy",
        categoryLabel: "POLICY BRIEF",
        title: "Gender-Responsive Policy: Moving from Intent to Action",
        description:
            "An overview of how gender-responsive approaches can strengthen policy development, implementation and evaluation across different sectors.",
        date: "20 August 2026",
        author: "OGL Research Team",
        readingTime: "8 min read",
        content: `
            <p>
                Gender-responsive policymaking asks an important question:
                how do policies affect people differently based on gender,
                social position and lived experience?
            </p>

            <p>
                This policy brief introduces key principles of
                gender-responsive policy development and explores how
                these approaches can move from intention into practical
                implementation.
            </p>

            <p>
                The brief also highlights the importance of evidence,
                participation and accountability when designing policies
                that aim to create more equitable outcomes.
            </p>
        `
    },

    {
        id: "resource-02",
        category: "policy",
        categoryLabel: "POLICY BRIEF",
        title: "Beyond Representation: Gender and Decision-Making",
        description:
            "Why representation matters and what institutions can do to make decision-making spaces more inclusive and responsive.",
        date: "12 August 2026",
        author: "OGL Research Team",
        readingTime: "6 min read",
        content: `
            <p>
                Representation is an important part of creating inclusive
                institutions, but representation alone does not guarantee
                meaningful participation.
            </p>

            <p>
                This brief explores the relationship between representation,
                voice and institutional decision-making.
            </p>
        `
    },

    {
        id: "resource-03",
        category: "policy",
        categoryLabel: "POLICY BRIEF",
        title: "Building Inclusive Public Spaces",
        description:
            "A gender lens on the design, accessibility and everyday experience of public spaces.",
        date: "04 August 2026",
        author: "OGL Research Team",
        readingTime: "7 min read",
        content: `
            <p>
                Public spaces shape how people move, work, interact and
                participate in society.
            </p>

            <p>
                This brief examines how planning and design can account for
                different experiences of safety, accessibility and mobility.
            </p>
        `
    },

    {
        id: "resource-04",
        category: "explainer",
        categoryLabel: "EXPLAINER",
        title: "What Does a Gender Lens Actually Mean?",
        description:
            "A simple introduction to understanding gender analysis and why it matters across different areas of society.",
        date: "18 August 2026",
        author: "OGL Editorial Team",
        readingTime: "4 min read",
        content: `
            <p>
                A gender lens is a way of examining how gender influences
                experiences, opportunities, expectations and outcomes.
            </p>

            <p>
                It helps us ask questions that might otherwise remain
                invisible in research, policy and everyday decision-making.
            </p>
        `
    },

    {
        id: "resource-05",
        category: "explainer",
        categoryLabel: "EXPLAINER",
        title: "Gender Equality vs. Gender Equity",
        description:
            "What is the difference between equality and equity, and why does the distinction matter?",
        date: "10 August 2026",
        author: "OGL Editorial Team",
        readingTime: "5 min read",
        content: `
            <p>
                Equality and equity are often used interchangeably, but they
                describe different approaches to addressing inequality.
            </p>

            <p>
                Understanding the distinction helps us think more carefully
                about the barriers different groups may experience.
            </p>
        `
    },

    {
        id: "resource-06",
        category: "explainer",
        categoryLabel: "EXPLAINER",
        title: "Why Gender Data Matters",
        description:
            "Understanding how better data can help reveal patterns of inequality and improve decision-making.",
        date: "01 August 2026",
        author: "OGL Research Team",
        readingTime: "5 min read",
        content: `
            <p>
                Data can help reveal patterns that are difficult to see
                through individual experiences alone.
            </p>

            <p>
                When data is collected and analysed thoughtfully, it can
                support more informed and responsive decision-making.
            </p>
        `
    },

    {
        id: "resource-07",
        category: "blog",
        categoryLabel: "BLOG",
        title: "The Questions We Forget to Ask",
        description:
            "Sometimes changing the conversation begins with asking a different question.",
        date: "15 August 2026",
        author: "OGL Editorial Team",
        readingTime: "5 min read",
        content: `
            <p>
                The questions we ask shape the answers we are able to see.
                This is particularly important when conversations involve
                complex social experiences.
            </p>

            <p>
                Looking at familiar questions through a gender lens can
                reveal assumptions that often go unnoticed.
            </p>
        `
    },

    {
        id: "resource-08",
        category: "blog",
        categoryLabel: "BLOG",
        title: "Who Gets to Be Heard?",
        description:
            "Reflecting on voice, visibility and whose experiences become part of public conversations.",
        date: "07 August 2026",
        author: "OGL Editorial Team",
        readingTime: "6 min read",
        content: `
            <p>
                Public conversations are shaped not only by what is said,
                but also by whose experiences are considered important enough
                to be heard.
            </p>

            <p>
                Creating space for different perspectives is an essential
                part of building more inclusive conversations.
            </p>
        `
    },

    {
        id: "resource-09",
        category: "blog",
        categoryLabel: "BLOG",
        title: "Looking at Everyday Life Through a Gender Lens",
        description:
            "Small everyday experiences can tell us a great deal about larger social structures.",
        date: "28 July 2026",
        author: "OGL Editorial Team",
        readingTime: "4 min read",
        content: `
            <p>
                Gender is not only something discussed in policy documents
                or academic research. It also shapes everyday experiences.
            </p>

            <p>
                Looking closely at ordinary routines can help us understand
                how larger social expectations are reproduced.
            </p>
        `
    }

];


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
   STATE
   ========================================================= */

let currentFilter = "all";
let currentSearch = "";


/* =========================================================
   CREATE RESOURCE CARD
   ========================================================= */

function createResourceCard(resource) {

    const card = document.createElement("article");

    card.className = "resource-card reveal";

    card.dataset.category = resource.category;

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
            ${resource.description}
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
        resources.filter(resource => {

            const matchesCategory =
                currentFilter === "all" ||
                resource.category === currentFilter;

            const searchText =
                currentSearch.toLowerCase().trim();

            const matchesSearch =
                !searchText ||
                resource.title.toLowerCase().includes(searchText) ||
                resource.description.toLowerCase().includes(searchText) ||
                resource.categoryLabel.toLowerCase().includes(searchText) ||
                resource.author.toLowerCase().includes(searchText);

            return matchesCategory && matchesSearch;

        });


    if (filteredResources.length === 0) {

        emptyState.hidden = false;

        resultsCount.textContent =
            "No resources found";

        return;

    }


    emptyState.hidden = true;


    resultsCount.textContent =
        `${filteredResources.length} ${
            filteredResources.length === 1
                ? "resource"
                : "resources"
        } found`;


    filteredResources.forEach(resource => {

        const card =
            createResourceCard(resource);

        resourceGrid.appendChild(card);

    });


    observeRevealElements();

}


/* =========================================================
   FILTER BUTTONS
   ========================================================= */

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        currentFilter =
            button.dataset.filter;


        filterButtons.forEach(item => {

            const isActive =
                item === button;

            item.classList.toggle(
                "active",
                isActive
            );

            item.setAttribute(
                "aria-selected",
                isActive ? "true" : "false"
            );

        });


        renderResources();

    });

});


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

        resourceSearch.value = "";

        currentSearch = "";

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

        currentFilter = "all";

        currentSearch = "";

        resourceSearch.value = "";

        clearSearch.classList.remove(
            "visible"
        );


        filterButtons.forEach(button => {

            const isActive =
                button.dataset.filter === "all";

            button.classList.toggle(
                "active",
                isActive
            );

            button.setAttribute(
                "aria-selected",
                isActive ? "true" : "false"
            );

        });


        renderResources();

    }
);


/* =========================================================
   OPEN RESOURCE
   ========================================================= */

function openResource(resourceId) {

    const resource =
        resources.find(
            item => item.id === resourceId
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
        resource.author;

    modalBody.innerHTML =
        resource.content;

    modalReadingTime.textContent =
        resource.readingTime;


    /*
        BACKEND INTEGRATION LATER:

        modalAction can eventually open:

        resource.file_url

        or

        /resources/resource-slug

        depending on the backend structure.
    */

    modalAction.dataset.resourceId =
        resource.id;


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


        if (
            resourceId &&
            button !== modalAction
        ) {

            openResource(resourceId);

        }

    }
);


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


modalClose.addEventListener(
    "click",
    closeResourceModal
);


modalOverlay.addEventListener(
    "click",
    closeResourceModal
);


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
                item => item.id === resourceId
            );


        if (!resource) {
            return;
        }


        /*
            TEMPORARY BEHAVIOUR

            Later this will be connected to the
            actual backend resource URL / PDF.
        */

        console.log(
            "Open full resource:",
            resource
        );

        alert(
            "The full resource/document will be connected through the backend."
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
            isOpen ? "true" : "false"
        );

    }
);


/* Close mobile menu when navigating */

document.querySelectorAll(
    ".mobile-nav a"
).forEach(link => {

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

});


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

                    entries.forEach(entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "visible"
                            );

                            revealObserver.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {
                    threshold: 0.12
                }
            );

    }


    elements.forEach(element => {

        element.classList.add(
            "observed"
        );

        revealObserver.observe(
            element
        );

    });

}


/* =========================================================
   INITIALISE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        renderResources();

        observeRevealElements();

    }
);