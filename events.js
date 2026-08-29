/* =========================================================
   OUR GENDER LENS — EVENTS PAGE
   Independent JavaScript — No Dependencies
========================================================= */


/* =========================================================
   EVENT DATA
   Replace this data with the final OGL event information.
========================================================= */

const events = [
    {
        id: 1,
        title: "Gender, Work & Social Change",
        date: "15 September 2026",
        time: "10:30 AM – 1:00 PM",
        location: "New Delhi, India",
        type: "Panel Discussion",
        category: "Gender & Work",
        description:
            "A multidisciplinary conversation exploring changing workplaces, care responsibilities, economic participation, and the role of gender in shaping professional opportunities."
    },

    {
        id: 2,
        title: "Building Inclusive Public Spaces",
        date: "28 September 2026",
        time: "3:00 PM – 5:00 PM",
        location: "Online",
        type: "Webinar",
        category: "Gender & Society",
        description:
            "An interactive discussion on how public spaces can become safer, more accessible, and more inclusive for people across different genders and communities."
    },

    {
        id: 3,
        title: "Gender Lens: Research to Action",
        date: "10 October 2026",
        time: "11:00 AM – 2:00 PM",
        location: "Mumbai, India",
        type: "Workshop",
        category: "Research & Policy",
        description:
            "A practical workshop focused on translating gender research and evidence into meaningful policy, advocacy, and community action."
    },

    {
        id: 4,
        title: "Conversations on Care",
        date: "24 October 2026",
        time: "4:00 PM – 6:00 PM",
        location: "Online",
        type: "Conversation",
        category: "Gender & Society",
        description:
            "A conversation examining unpaid care work, caregiving responsibilities, and the social and economic structures that shape everyday care."
    },

    {
        id: 5,
        title: "Gender & Climate Justice",
        date: "8 November 2026",
        time: "10:00 AM – 12:30 PM",
        location: "Pune, India",
        type: "Roundtable",
        category: "Gender & Climate",
        description:
            "A roundtable bringing together researchers and practitioners to discuss the intersections between gender, climate change, resilience, and environmental justice."
    },

    {
        id: 6,
        title: "Young Voices, New Perspectives",
        date: "21 November 2026",
        time: "2:00 PM – 4:30 PM",
        location: "Bengaluru, India",
        type: "Youth Dialogue",
        category: "Youth & Gender",
        description:
            "A youth-focused dialogue creating space for young people to share perspectives on identity, equality, representation, and social change."
    },

    {
        id: 7,
        title: "Gender Data & Evidence",
        date: "5 December 2026",
        time: "11:00 AM – 1:30 PM",
        location: "Online",
        type: "Research Seminar",
        category: "Data & Research",
        description:
            "A seminar exploring how gender-responsive data and evidence can strengthen research, policymaking, and public understanding."
    },

    {
        id: 8,
        title: "Rethinking Representation",
        date: "18 December 2026",
        time: "5:00 PM – 7:00 PM",
        location: "Kolkata, India",
        type: "Public Dialogue",
        category: "Representation",
        description:
            "A public dialogue examining representation in media, institutions, culture, and public life through a gender-responsive lens."
    }
];


const pastEvents = [
    {
        id: 101,
        title: "Understanding Gender in Everyday Life",
        date: "18 July 2026",
        location: "Online",
        type: "Public Conversation",
        category: "Gender & Society",
        description:
            "An introductory conversation exploring how gender influences everyday experiences, institutions, relationships, and opportunities."
    },

    {
        id: 102,
        title: "Gender-Responsive Policy: Why It Matters",
        date: "26 June 2026",
        location: "Hyderabad, India",
        type: "Policy Dialogue",
        category: "Research & Policy",
        description:
            "A discussion on incorporating gender perspectives into policy design, implementation, and evaluation."
    },

    {
        id: 103,
        title: "Research, Evidence & Social Change",
        date: "14 May 2026",
        location: "Online",
        type: "Research Dialogue",
        category: "Data & Research",
        description:
            "Researchers and practitioners came together to discuss the role of evidence-based research in creating meaningful social change."
    },

    {
        id: 104,
        title: "Women, Work & Economic Participation",
        date: "22 April 2026",
        location: "Mumbai, India",
        type: "Roundtable",
        category: "Gender & Work",
        description:
            "A roundtable examining women's participation in the workforce and the structural factors influencing economic opportunities."
    }
];


/* =========================================================
   DOM ELEMENTS
========================================================= */

const siteHeader = document.getElementById("siteHeader");
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

const upcomingEventsContainer =
    document.getElementById("upcomingEvents");

const pastEventsContainer =
    document.getElementById("pastEvents");

const eventFilters =
    document.getElementById("eventFilters");


/* =========================================================
   HEADER SCROLL EFFECT
========================================================= */

function handleHeaderScroll() {

    if (!siteHeader) {
        return;
    }

    if (window.scrollY > 30) {
        siteHeader.classList.add("scrolled");
    } else {
        siteHeader.classList.remove("scrolled");
    }
}

window.addEventListener("scroll", handleHeaderScroll);

handleHeaderScroll();


/* =========================================================
   MOBILE NAVIGATION
========================================================= */

if (menuToggle && mainNav) {

    menuToggle.addEventListener("click", () => {

        const isOpen =
            menuToggle.classList.toggle("open");

        mainNav.classList.toggle("open", isOpen);

        menuToggle.setAttribute(
            "aria-expanded",
            isOpen.toString()
        );

        document.body.style.overflow =
            isOpen ? "hidden" : "";
    });


    const navLinks =
        mainNav.querySelectorAll("a");

    navLinks.forEach(link => {

        link.addEventListener("click", () => {

            menuToggle.classList.remove("open");
            mainNav.classList.remove("open");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            document.body.style.overflow = "";
        });

    });

}


/* =========================================================
   DATE HELPERS
========================================================= */

function formatEventDate(dateString) {

    const dateParts =
        dateString.split(" ");

    if (dateParts.length < 3) {
        return {
            day: "",
            month: "",
            year: ""
        };
    }

    return {
        day: dateParts[0],
        month: dateParts[1].replace(",", ""),
        year: dateParts[2]
    };
}


/* =========================================================
   UPCOMING EVENT CARD
========================================================= */

function createEventCard(event) {

    const card =
        document.createElement("article");

    card.className =
        "event-card card-visible";

    card.dataset.category =
        event.category;

    card.innerHTML = `

        <div class="card-top">

            <span class="card-date">
                ${formatEventDate(event.date).day}
                ${formatEventDate(event.date).month}
            </span>

            <span class="card-category">
                ${event.category}
            </span>

        </div>


        <h3>
            ${event.title}
        </h3>


        <p>
            ${event.description}
        </p>


        <div class="card-footer">

            <span class="card-location">
                ${event.location}
                &nbsp; · &nbsp;
                ${event.time}
            </span>

            <span class="card-arrow">
                →
            </span>

        </div>
    `;

    return card;
}


/* =========================================================
   RENDER UPCOMING EVENTS
========================================================= */

function renderUpcomingEvents(filter = "all") {

    if (!upcomingEventsContainer) {
        return;
    }

    upcomingEventsContainer.innerHTML = "";

    const filteredEvents =
        filter === "all"
            ? events
            : events.filter(
                event => event.category === filter
            );


    if (filteredEvents.length === 0) {

        upcomingEventsContainer.innerHTML = `
            <div class="no-events">
                No events found in this category.
            </div>
        `;

        return;
    }


    filteredEvents.forEach((event, index) => {

        const card =
            createEventCard(event);

        card.style.animationDelay =
            `${index * 0.07}s`;

        upcomingEventsContainer.appendChild(card);

    });
}


/* =========================================================
   PAST EVENT
========================================================= */

function createPastEvent(event) {

    const item =
        document.createElement("article");

    item.className = "past-event";

    item.innerHTML = `

        <div class="past-date">
            ${event.date}
        </div>


        <div class="past-content">

            <h3>
                ${event.title}
            </h3>

            <p>
                ${event.description}
            </p>

        </div>


        <div class="past-meta">

            <span>
                ${event.type}
            </span>

            <span>
                ${event.location}
            </span>

        </div>
    `;

    return item;
}


/* =========================================================
   RENDER PAST EVENTS
========================================================= */

function renderPastEvents() {

    if (!pastEventsContainer) {
        return;
    }

    pastEventsContainer.innerHTML = "";

    pastEvents.forEach(event => {

        pastEventsContainer.appendChild(
            createPastEvent(event)
        );

    });
}


/* =========================================================
   EVENT FILTERS
========================================================= */

if (eventFilters) {

    const filterButtons =
        eventFilters.querySelectorAll(
            ".filter-button"
        );


    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            filterButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            const filter =
                button.dataset.filter;

            renderUpcomingEvents(filter);

        });

    });

}


/* =========================================================
   SCROLL REVEAL
========================================================= */

function initializeRevealAnimations() {

    const revealElements =
        document.querySelectorAll(".reveal");

    if (!("IntersectionObserver" in window)) {

        revealElements.forEach(element => {
            element.classList.add("visible");
        });

        return;
    }


    const observer =
        new IntersectionObserver(
            (entries, observerInstance) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "visible"
                        );

                        observerInstance.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -40px 0px"
            }
        );


    revealElements.forEach(element => {
        observer.observe(element);
    });
}


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    renderUpcomingEvents();
    renderPastEvents();
    initializeRevealAnimations();

});