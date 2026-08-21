// ============================= //
// HAMBURGER MENU TOGGLE          //
// ============================= //

const menuToggle = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.navbar__menu');

// Only wire this up if both elements exist on the current page —
// prevents a null.addEventListener() crash that would otherwise
// stop every script below this point from running.
if (menuToggle && menuLinks) {
    menuToggle.addEventListener('click', () => {
        menuLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
}

const navLinks = document.querySelectorAll('.navbar__links');

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (menuLinks) menuLinks.classList.remove('active');
        if (menuToggle) menuToggle.classList.remove('active');
    });
});


// ============================= //
// NAVBAR SCROLL RIBBON           //
// ============================= //

const navbar = document.querySelector('.navbar');

if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}


// ============================= //
// BACKGROUND SLIDESHOW           //
// ============================= //

const slides = document.querySelectorAll('.hero__slide');

if (slides.length > 0) {
    let currentSlide = 0;

    function showNextSlide() {
        slides[currentSlide].classList.remove('hero__slide--active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('hero__slide--active');
    }

    setInterval(showNextSlide, 5000);
}

// ============================= //
// ACCREDITATIONS DISPLAY ON HERO//
// ============================= //


document.querySelectorAll('.hero__accreditations img').forEach(img => {
    img.addEventListener('click', () => {
        const isExpanded = img.classList.contains('expanded');
        document.querySelectorAll('.hero__accreditations img').forEach(i => i.classList.remove('expanded'));
        if (!isExpanded) {
            img.classList.add('expanded');
        }
    });
});

// ============================= //
// STATS COUNT-UP (Screen 2)      //
// ============================= //

const statNumbers = document.querySelectorAll('.stat__number');

function animateCount(el) {
    const targetStr = el.dataset.target;   // e.g. "£50k–£10m", "75–100", "40+ "
    const duration = 1500;
    const startTime = performance.now();

    // Find every run of digits in the string, with its position
    const matches = [...targetStr.matchAll(/\d+/g)];

    // Rebuild the string for a given progress (0 -> 1)
    function buildString(progress) {
        let result = '';
        let lastIndex = 0;

        matches.forEach(match => {
            const numStr = match[0];
            const start = match.index;
            const end = start + numStr.length;
            const targetNum = parseInt(numStr, 10);
            const currentNum = Math.floor(progress * targetNum);

            result += targetStr.slice(lastIndex, start); // text before this number, unchanged
            result += currentNum;                        // animated number
            lastIndex = end;
        });

        result += targetStr.slice(lastIndex); // any trailing text
        return result;
    }

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        el.textContent = buildString(progress);

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            el.textContent = targetStr; // snap to exact final text, no rounding drift
        }
    }

    requestAnimationFrame(update);
}

if (statNumbers.length > 0) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCount(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(num => statsObserver.observe(num));
}


// ============================= //
// HISTORY TOGGLE (Screen 3)      //
// ============================= //

const historyToggleBtn = document.getElementById('history-toggle-btn');
const historyPanel = document.getElementById('history-panel');

if (historyToggleBtn && historyPanel) {
    historyToggleBtn.addEventListener('click', () => {
        historyPanel.classList.toggle('toggle-panel--active');
    });
}


// ============================= //
// CONTACT FORM (Screen 4)        //
// Submits to Netlify Forms via fetch (AJAX) so the page never
// reloads. Netlify collects the submission, runs it through spam
// filtering (honeypot field in the HTML), and — once you add a
// notification in the Netlify dashboard — emails it to you.
// ============================= //

const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('formStatus');

// Helper that turns a FormData object into the
// "application/x-www-form-urlencoded" string Netlify expects.
function encodeFormData(formData) {
    return new URLSearchParams(formData).toString();
}

if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault(); // we're handling the submission ourselves, via fetch

        // Make sure an enquiry type was actually chosen (the hidden
        // #enquiryType input only gets a value once a toggle button
        // has been clicked — see the WORK ENQUIRY TOGGLE section below).
        const enquiryTypeInput = document.getElementById('enquiryType');
        if (enquiryTypeInput && !enquiryTypeInput.value) {
            if (formStatus) {
                formStatus.textContent = 'Please choose "General Enquiry" or "Business Enquiry" above first.';
                formStatus.style.color = '#c0392b';
            }
            return;
        }

        const formData = new FormData(contactForm);

        fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: encodeFormData(formData)
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not OK');
                }

                if (formStatus) {
                    formStatus.textContent = "Thanks — your enquiry has been sent. We'll be in touch soon.";
                    formStatus.style.color = '#1F9678';
                }

                contactForm.reset();

                // Collapse the form back to its "choose a type" starting state
                if (formFields) formFields.classList.remove('contact-form__fields--active');
                if (workFields) workFields.classList.remove('contact-form__work-fields--active');
                if (btnGeneral) btnGeneral.classList.remove('enquiry-toggle__btn--active');
                if (btnWork) btnWork.classList.remove('enquiry-toggle__btn--active');
            })
            .catch(() => {
                if (formStatus) {
                    formStatus.textContent = 'Sorry, something went wrong sending your enquiry. Please try again, or email us directly at info@manstal.co.uk.';
                    formStatus.style.color = '#c0392b';
                }
            });
    });
}


// ============================= //
// WORK ENQUIRY TOGGLE           //
// ============================= //

const enquiryType = document.getElementById("enquiryType");
const workFields = document.getElementById("workFields");
const formFields = document.getElementById("formFields");
const btnGeneral = document.getElementById("btnGeneral");
const btnWork = document.getElementById("btnWork");

if (enquiryType && workFields && formFields && btnGeneral && btnWork) {

    const workInputs = workFields.querySelectorAll("input, select");

    function setEnquiryType(type) {
        enquiryType.value = type;

        const isWork = type === "work";

        // reveal the whole field block now that a type is chosen
        formFields.classList.add("contact-form__fields--active");

        // show/hide + require only the work-specific fields
        workFields.classList.toggle("contact-form__work-fields--active", isWork);
        workInputs.forEach(input => { input.required = isWork; });

        // highlight the active button
        btnGeneral.classList.toggle("enquiry-toggle__btn--active", type === "general");
        btnWork.classList.toggle("enquiry-toggle__btn--active", isWork);
    }

    btnGeneral.addEventListener("click", () => setEnquiryType("general"));
    btnWork.addEventListener("click", () => setEnquiryType("work"));

    // NOTE: removed the auto-run on page load — fields stay hidden
    // until a button is actually clicked
}

// ============================= //
// CASE STUDY SLIDESHOWS (Screen 2.5) //
// ============================= //

document.querySelectorAll('.case-slideshow').forEach((slideshow, i) => {
    const caseSlides = slideshow.querySelectorAll('.case-slideshow__slide');
    if (caseSlides.length === 0) return;

    let currentCaseSlide = 0;

    setInterval(() => {
        caseSlides[currentCaseSlide].classList.remove('case-slideshow__slide--active');
        currentCaseSlide = (currentCaseSlide + 1) % caseSlides.length;
        caseSlides[currentCaseSlide].classList.add('case-slideshow__slide--active');
    }, 4000 + i * 500);
});


// =========================================================
// PROJECTS PAGE — DATA
// EDIT THIS ARRAY TO ADD / REMOVE / CHANGE PROJECTS
// =========================================================
const PROJECTS = [
    {
        title: "Project One",
        image: "images/project-1.jpg",
        colorClass: "",
        summary: "Short summary of the project goes here.",
        sector: "Retail",
        service: "Design & Build",
        details: "A longer description of Project One goes here — what it involved, the challenges, and the outcome for the client."
    },
    {
        title: "Project Two",
        image: "images/project-2.jpg",
        colorClass: "",
        summary: "Short summary of the project goes here.",
        sector: "Health",
        service: "Project Design & BIM",
        details: "A longer description of Project Two goes here — what it involved, the challenges, and the outcome for the client."
    },
    {
        title: "Project Three",
        image: "images/project-3.jpg",
        colorClass: "",
        summary: "Short summary of the project goes here.",
        sector: "Health",
        service: "Project Management",
        details: "A longer description of Project Three goes here — what it involved, the challenges, and the outcome for the client."
    },
    {
        title: "Project Four",
        image: "images/project-4.jpg",
        colorClass: "",
        summary: "Short summary of the project goes here.",
        sector: "Industrial",
        service: "Design & Build",
        details: "A longer description of Project Four goes here — what it involved, the challenges, and the outcome for the client."
    },
    {
        title: "Project Five",
        image: "images/project-5-a.jpg",
        colorClass: "",
        summary: "Short summary of the project goes here.",
        sector: "Commercial",
        service: "Planned & Reactive Maintainence",
        details: "A longer description of Project Five goes here — what it involved, the challenges, and the outcome for the client."
    },
    {
        title: "Project Six",
        image: "images/project-6-a.jpg",
        colorClass: "",
        summary: "Short summary of the project goes here.",
        sector: "Education",
        service: "Design & Build",
        details: "A longer description of Project Six goes here — what it involved, the challenges, and the outcome for the client."
    }
    // Add more projects here following the same format...
];

// =========================================================
// PROJECTS PAGE — BUILD CARDS + MODAL LOGIC
// Only runs if #projectsGrid exists on the page (i.e. projects.html)
// =========================================================
const projectsGrid = document.getElementById('projectsGrid');

if (projectsGrid) {
    // Build every card up front (indices stay stable for the modal)
    PROJECTS.forEach((project, index) => {
        const card = document.createElement('div');
        card.className = `case-slideshow ${project.colorClass}`;
        card.dataset.sector = project.sector;
        card.dataset.service = project.service;
        card.innerHTML = `
            <div class="case-slideshow__slide case-slideshow__slide--active" style="background-image: url('${project.image}');">
                <div class="case-slideshow__overlay"></div>
                <div class="case-slideshow__content">
                    <h3>${project.title}</h3>
                    <p>${project.summary}</p>
                    <a href="#" class="case-card__link" data-index="${index}">Find Out More</a>
                </div>
            </div>
        `;
        projectsGrid.appendChild(card);
    });

    // ===== Modal logic (unchanged) =====
    const projectOverlay    = document.getElementById('projectModalOverlay');
    const projectModalImg   = document.getElementById('projectModalImg');
    const projectModalTitle = document.getElementById('projectModalTitle');
    const projectModalBody  = document.getElementById('projectModalBody');
    const projectModalClose = document.getElementById('projectModalClose');

    function openProjectModal(project) {
        projectModalImg.src = project.image;
        projectModalImg.alt = project.title;
        projectModalTitle.textContent = project.title;
        projectModalBody.textContent  = project.details;

        projectOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeProjectModal() {
        projectOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    projectsGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('case-card__link')) {
            e.preventDefault();
            const index = e.target.dataset.index;
            openProjectModal(PROJECTS[index]);
        }
    });

    projectModalClose.addEventListener('click', closeProjectModal);

    projectOverlay.addEventListener('click', (e) => {
        if (e.target === projectOverlay) closeProjectModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && projectOverlay.classList.contains('active')) closeProjectModal();
    });

    // ===== Filters =====
    const filterSector = document.getElementById('filterSector');
    const filterService = document.getElementById('filterService');
    const filterClear = document.getElementById('filterClear');
    const emptyMsg = document.getElementById('projectsEmptyMsg');

    // Build dropdown options dynamically from whatever sectors/services
    // exist in the PROJECTS array — no need to hand-write <option> tags
    const sectors = [...new Set(PROJECTS.map(p => p.sector))].sort();
    const services = [...new Set(PROJECTS.map(p => p.service))].sort();

    sectors.forEach(sector => {
        const opt = document.createElement('option');
        opt.value = sector;
        opt.textContent = sector;
        filterSector.appendChild(opt);
    });

    services.forEach(service => {
        const opt = document.createElement('option');
        opt.value = service;
        opt.textContent = service;
        filterService.appendChild(opt);
    });

    function applyFilters() {
        const sectorVal = filterSector.value;
        const serviceVal = filterService.value;
        const cards = projectsGrid.querySelectorAll('.case-slideshow');
        let visibleCount = 0;

        cards.forEach(card => {
            const matchesSector = sectorVal === 'all' || card.dataset.sector === sectorVal;
            const matchesService = serviceVal === 'all' || card.dataset.service === serviceVal;
            const isMatch = matchesSector && matchesService;

            card.classList.toggle('project-card--hidden', !isMatch);
            if (isMatch) visibleCount++;
        });

        emptyMsg.classList.toggle('active', visibleCount === 0);
    }

    filterSector.addEventListener('change', applyFilters);
    filterService.addEventListener('change', applyFilters);

    filterClear.addEventListener('click', () => {
        filterSector.value = 'all';
        filterService.value = 'all';
        applyFilters();
    });
}
// =========================================================
// HOME PAGE CASE STUDIES
// (unchanged logic — used on index.html)
// EDIT THIS ARRAY TO ADD / REMOVE / CHANGE HOME CASE STUDY CARDS
// =========================================================
const HOME_CASE_STUDIES = [
    {
        title: "Case Study One",
        image: "images/replace_cs1.png",
        summary: "Short summary of the project goes here.",
        details: "A longer description of Case Study One goes here — what it involved, the challenges, and the outcome for the client."
    },
    {
        title: "Case Study Two",
        image: "images/replace_cs2.png",
        summary: "Short summary of the project goes here.",
        details: "A longer description of Case Study Two goes here — what it involved, the challenges, and the outcome for the client."
    },
    {
        title: "Case Study Three",
        image: "images/replace_cs3.png",
        summary: "Short summary of the project goes here.",
        details: "A longer description of Case Study Three goes here — what it involved, the challenges, and the outcome for the client."
    },
    {
        title: "Case Study Four",
        image: "images/replace_cs4.png",
        summary: "Short summary of the project goes here.",
        details: "A longer description of Case Study Four goes here — what it involved, the challenges, and the outcome for the client."
    }
];

const homeCaseStudiesGrid = document.getElementById('homeCaseStudiesGrid');

if (homeCaseStudiesGrid) {
    HOME_CASE_STUDIES.forEach((study, index) => {
        const card = document.createElement('div');
        card.className = 'case-slideshow';
        card.innerHTML = `
            <div class="case-slideshow__slide case-slideshow__slide--active" style="background-image: url('${study.image}');">
                <div class="case-slideshow__overlay"></div>
                <div class="case-slideshow__content">
                    <h3>${study.title}</h3>
                    <p>${study.summary}</p>
                    <a href="#" class="case-card__link" data-index="${index}">Find Out More</a>
                </div>
            </div>
        `;
        homeCaseStudiesGrid.appendChild(card);
    });

    const homeCaseOverlay    = document.getElementById('homeCaseModalOverlay');
    const homeCaseModalImg   = document.getElementById('homeCaseModalImg');
    const homeCaseModalTitle = document.getElementById('homeCaseModalTitle');
    const homeCaseModalBody  = document.getElementById('homeCaseModalBody');
    const homeCaseModalClose = document.getElementById('homeCaseModalClose');

    function openHomeCaseModal(study) {
        homeCaseModalImg.src = study.image;
        homeCaseModalImg.alt = study.title;
        homeCaseModalTitle.textContent = study.title;
        homeCaseModalBody.textContent  = study.details;

        homeCaseOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeHomeCaseModal() {
        homeCaseOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    homeCaseStudiesGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('case-card__link')) {
            e.preventDefault();
            const index = e.target.dataset.index;
            openHomeCaseModal(HOME_CASE_STUDIES[index]);
        }
    });

    homeCaseModalClose.addEventListener('click', closeHomeCaseModal);

    homeCaseOverlay.addEventListener('click', (e) => {
        if (e.target === homeCaseOverlay) closeHomeCaseModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && homeCaseOverlay.classList.contains('active')) closeHomeCaseModal();
    });
}

// =========================================================
// CASE STUDIES PAGE
// (renamed/scoped to cs-page-card — used on caseStudies.html)
// EDIT THIS ARRAY TO ADD / REMOVE / CHANGE CASE STUDIES
// bulletPoints is OPTIONAL — omit it or leave as [] if a
// case study doesn't need a bullet list.
// =========================================================
const CASE_STUDIES = [
    {
        title: "Waverly School",
        image: "images/REPLACE_CS1_waverly_school.png",
        summary: "Delivering full electrical fit-out across two new teaching and community blocks.",
        sector: "Education",
        service: "Electrical Installation",
        details: "Waverly School is a community and sixth form school located in the Small Heath Area of Birmingham. The project consisted of two new two storey blocks, one being a teaching facility consisting of science, IT and multi-use rooms. The second block was a community facility offering a new dining area, and multi-use activity centre.",
        location: "Birmingham",
        client: "Galliford Try",
        buildingType: "Teaching and Community Blocks",
        mepValue: "£540,000.00",
        bulletPoints: [
            "LV distribution systems",
            "Small power system",
            "Internal lighting",
            "Data distribution",
            "Telecoms system",
            "Access control",
            "CCTV",
            "Intruder alarms",
            "Fire alarms",
            "AV Systems",
            "Emergency voice system",
            "Lightning protection",
        ]
    }
];

// =========================================================
// RENDER: build one card per case study into #caseStudiesGrid
// =========================================================
function renderCaseStudyCards() {
    const grid = document.getElementById("caseStudiesGrid");
    if (!grid) return;

    grid.innerHTML = CASE_STUDIES.map((study, index) => `
        <article class="cs-page-card">
            <div class="cs-page-card__image">
                <img src="${study.image}" alt="${study.title}">
                ${study.sector ? `<span class="cs-page-card__sector">${study.sector}</span>` : ""}
            </div>
            <div class="cs-page-card__body">
                ${study.service ? `<span class="cs-page-card__service">${study.service}</span>` : ""}
                <h3 class="cs-page-card__title">${study.title}</h3>
                <p class="cs-page-card__summary">${study.summary || ""}</p>

                <dl class="cs-page-card__meta">
                    <div>
                        <dt>Location</dt>
                        <dd>${study.location || "—"}</dd>
                    </div>
                    <div>
                        <dt>Client</dt>
                        <dd>${study.client || "—"}</dd>
                    </div>
                    <div>
                        <dt>Value</dt>
                        <dd>${study.mepValue || "—"}</dd>
                    </div>
                </dl>

                <button class="cs-page-card__cta" data-case-index="${index}">Find Out More</button>
            </div>
        </article>
    `).join("");
}

// =========================================================
// MODAL: populate + open/close
// =========================================================
function openCaseModal(index) {
    const study = CASE_STUDIES[index];
    if (!study) return;

    const overlay = document.getElementById("caseModalOverlay");
    const img = document.getElementById("caseModalImg");
    const service = document.getElementById("caseModalService");
    const title = document.getElementById("caseModalTitle");
    const meta = document.getElementById("caseModalMeta");
    const body = document.getElementById("caseModalBody");
    const bullets = document.getElementById("caseModalBullets");

    img.src = study.image;
    img.alt = study.title;
    service.textContent = study.service || "";
    title.textContent = study.title;
    body.textContent = study.details || "";

    const metaFields = [
        { label: "Sector", value: study.sector },
        { label: "Location", value: study.location },
        { label: "Client", value: study.client },
        { label: "Building Type", value: study.buildingType },
        { label: "MEP Value", value: study.mepValue },
    ].filter(field => field.value);

    meta.innerHTML = metaFields.map(field => `
        <div>
            <dt>${field.label}</dt>
            <dd>${field.value}</dd>
        </div>
    `).join("");

    const points = study.bulletPoints || [];
    bullets.innerHTML = points.map(point => `<li>${point}</li>`).join("");

    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeCaseModal() {
    const overlay = document.getElementById("caseModalOverlay");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
}

// =========================================================
// EVENT WIRING
// =========================================================
document.addEventListener("DOMContentLoaded", () => {
    renderCaseStudyCards();

    const grid = document.getElementById("caseStudiesGrid");
    if (!grid) return;

    const overlay = document.getElementById("caseModalOverlay");
    const closeBtn = document.getElementById("caseModalClose");

    grid.addEventListener("click", (e) => {
        const btn = e.target.closest(".cs-page-card__cta");
        if (!btn) return;
        openCaseModal(Number(btn.dataset.caseIndex));
    });

    closeBtn.addEventListener("click", closeCaseModal);

    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeCaseModal();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && overlay.classList.contains("active")) {
            closeCaseModal();
        }
    });
});

// =========================================================
// SERVICES PAGE — DATA
// EDIT THIS ARRAY TO ADD / REMOVE / CHANGE SERVICES
// =========================================================
const SERVICES = [
    {
        title: "Electrical installation ",
        image: "images/services-elec.jpg",
        summary: "One line description of the service goes here.",
        details: "A longer description of Service One goes here — what it involves, who it's for, and what the client gets out of it."
    },
    {
        title: "Mechanical installation ",
        image: "images/services-mech.jpg",
        summary: "One line description of the service goes here.",
        details: "A longer description of Service Two goes here — what it involves, who it's for, and what the client gets out of it."
    },
    {
        title: "Project design and BIM ",
        image: "images/services-bim.jpg",
        summary: "One line description of the service goes here.",
        details: "A longer description of Service Three goes here — what it involves, who it's for, and what the client gets out of it."
    },
    {
        title: "Project Management ",
        image: "images/services-pm.jpg",
        summary: "One line description of the service goes here.",
        details: "A longer description of Service Four goes here — what it involves, who it's for, and what the client gets out of it."
    },

    {
        title: "Planned and Reactive Maintenance ",
        image: "images/services-maintin.jpg",
        summary: "One line description of the service goes here.",
        details: "A longer description of Service Four goes here — what it involves, who it's for, and what the client gets out of it."
    },

    {
        title: "Renewables and Energy Efficiency  ",
        image: "images/services-energy.jpg",
        summary: "One line description of the service goes here.",
        details: "A longer description of Service Four goes here — what it involves, who it's for, and what the client gets out of it."
    }
    // Add more services here following the same format...
];

// =========================================================
// SERVICES PAGE — BUILD CARDS + MODAL LOGIC
// Only runs if #servicesGrid exists on the page (i.e. services.html)
// =========================================================
const servicesGrid = document.getElementById('servicesGrid');

if (servicesGrid) {
    SERVICES.forEach((service, index) => {
        const card = document.createElement('div');
        card.className = 'case-slideshow';
        card.innerHTML = `
            <div class="case-slideshow__slide case-slideshow__slide--active" style="background-image: url('${service.image}');">
                <div class="case-slideshow__overlay"></div>
                <div class="case-slideshow__content">
                    <h3>${service.title}</h3>
                    <p>${service.summary}</p>
                    <a href="#" class="case-card__link" data-index="${index}">Find Out More</a>
                </div>
            </div>
        `;
        servicesGrid.appendChild(card);
    });

    const serviceOverlay    = document.getElementById('serviceModalOverlay');
    const serviceModalImg   = document.getElementById('serviceModalImg');
    const serviceModalTitle = document.getElementById('serviceModalTitle');
    const serviceModalBody  = document.getElementById('serviceModalBody');
    const serviceModalClose = document.getElementById('serviceModalClose');

    function openServiceModal(service) {
        serviceModalImg.src = service.image;
        serviceModalImg.alt = service.title;
        serviceModalTitle.textContent = service.title;
        serviceModalBody.textContent  = service.details;

        serviceOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeServiceModal() {
        serviceOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    servicesGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('case-card__link')) {
            e.preventDefault();
            const index = e.target.dataset.index;
            openServiceModal(SERVICES[index]);
        }
    });

    serviceModalClose.addEventListener('click', closeServiceModal);

    serviceOverlay.addEventListener('click', (e) => {
        if (e.target === serviceOverlay) closeServiceModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && serviceOverlay.classList.contains('active')) closeServiceModal();
    });
}


// =========================================================
// HOME PAGE — PROJECTS PREVIEW DATA
// EDIT THIS ARRAY TO ADD / REMOVE / CHANGE HOME PROJECT CARDS
// =========================================================
const HOME_PROJECTS = [
    {
        title: "Project One",
        image: "images/replace_project1.png",
        summary: "Short description of the project goes here and what it involved and the outcome for the client.",
        details: "A longer description of Project One goes here — what it involved, the challenges, and the outcome for the client."
    },
    {
        title: "Project Two",
        image: "images/replace_project2.png",
        summary: "Short description of the project goes here and what it involved and the outcome for the client.",
        details: "A longer description of Project Two goes here — what it involved, the challenges, and the outcome for the client."
    },
    {
        title: "Project Three",
        image: "images/replace_project_3.png",
        summary: "Short description of the project goes here and what it involved and the outcome for the client.",
        details: "A longer description of Project Three goes here — what it involved, the challenges, and the outcome for the client."
    }
    
];

// =========================================================
// HOME PAGE — PROJECTS PREVIEW: BUILD CARDS + MODAL LOGIC
// Only runs if #homeProjectsGrid exists (i.e. index.html)
// =========================================================
const homeProjectsGrid = document.getElementById('homeProjectsGrid');

if (homeProjectsGrid) {
    HOME_PROJECTS.forEach((project, index) => {
        const row = document.createElement('div');
        row.className = index % 2 === 1 ? 'project-row project-row--reverse' : 'project-row';
        row.innerHTML = `
            <div class="project-row__text">
                <h3>${project.title}</h3>
                <p>${project.summary}</p>
                <a href="#" class="button button--wide project-row__link" data-index="${index}">Learn More <span class="arrow">&#8594;</span></a>
            </div>
            <div class="project-row__image">
                <img src="${project.image}" alt="${project.title}">
            </div>
        `;
        homeProjectsGrid.appendChild(row);
    });

    const homeProjectOverlay    = document.getElementById('homeProjectModalOverlay');
    const homeProjectModalImg   = document.getElementById('homeProjectModalImg');
    const homeProjectModalTitle = document.getElementById('homeProjectModalTitle');
    const homeProjectModalBody  = document.getElementById('homeProjectModalBody');
    const homeProjectModalClose = document.getElementById('homeProjectModalClose');

    function openHomeProjectModal(project) {
        homeProjectModalImg.src = project.image;
        homeProjectModalImg.alt = project.title;
        homeProjectModalTitle.textContent = project.title;
        homeProjectModalBody.textContent  = project.details;

        homeProjectOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeHomeProjectModal() {
        homeProjectOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    homeProjectsGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('project-row__link')) {
            e.preventDefault();
            const index = e.target.dataset.index;
            openHomeProjectModal(HOME_PROJECTS[index]);
        }
    });

    homeProjectModalClose.addEventListener('click', closeHomeProjectModal);

    homeProjectOverlay.addEventListener('click', (e) => {
        if (e.target === homeProjectOverlay) closeHomeProjectModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && homeProjectOverlay.classList.contains('active')) closeHomeProjectModal();
    });
}



// =========================================================
// HOME PAGE — NEWS PREVIEW DATA
// EDIT THIS ARRAY TO ADD / REMOVE / CHANGE HOME NEWS CARDS
// =========================================================
const HOME_NEWS = [
    {
        title: "News Title One",
        image: "images/replaceTeam.jpg",
        summary: "Short paragraph summary goes here.",
        details: "A longer version of News Title One goes here — the full story, context, and why it matters."
    },
    {
        title: "News Title Two",
        image: "images/replaceCAD.jpg",
        summary: "Short paragraph summary goes here.",
        details: "A longer version of News Title Two goes here — the full story, context, and why it matters."
    },
    {
        title: "News Title Three",
        image: "images/renameAbout.jpg",
        summary: "Short paragraph summary goes here.",
        details: "A longer version of News Title Three goes here — the full story, context, and why it matters."
    }
];

// =========================================================
// HOME PAGE — NEWS PREVIEW: BUILD CARDS + MODAL LOGIC
// Only runs if #homeNewsScroller exists (i.e. index.html)
// =========================================================
const homeNewsScroller = document.getElementById('homeNewsScroller');

if (homeNewsScroller) {
    HOME_NEWS.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'news-card';
        card.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="news-card__img">
            <h3>${item.title}</h3>
            <p>${item.summary}</p>
            <a href="#" class="case-card__link" data-index="${index}">Read More</a>
        `;
        homeNewsScroller.appendChild(card);
    });

    const homeNewsOverlay    = document.getElementById('homeNewsModalOverlay');
    const homeNewsModalImg   = document.getElementById('homeNewsModalImg');
    const homeNewsModalTitle = document.getElementById('homeNewsModalTitle');
    const homeNewsModalBody  = document.getElementById('homeNewsModalBody');
    const homeNewsModalClose = document.getElementById('homeNewsModalClose');

    function openHomeNewsModal(item) {
        homeNewsModalImg.src = item.image;
        homeNewsModalImg.alt = item.title;
        homeNewsModalTitle.textContent = item.title;
        homeNewsModalBody.textContent  = item.details;

        homeNewsOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeHomeNewsModal() {
        homeNewsOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    homeNewsScroller.addEventListener('click', (e) => {
        if (e.target.classList.contains('case-card__link')) {
            e.preventDefault();
            const index = e.target.dataset.index;
            openHomeNewsModal(HOME_NEWS[index]);
        }
    });

    homeNewsModalClose.addEventListener('click', closeHomeNewsModal);

    homeNewsOverlay.addEventListener('click', (e) => {
        if (e.target === homeNewsOverlay) closeHomeNewsModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && homeNewsOverlay.classList.contains('active')) closeHomeNewsModal();
    });
}


// ============================= //
// COOKIE CONSENT BANNER          //
// Shows once on first visit, remembers dismissal in a cookie.
// NOTE: only include this if/when you actually add tracking —
// right now the site sets no cookies, so this banner is optional
// scaffolding for later, not currently required.
// ============================= //

function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
}

function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

const cookieBanner = document.getElementById('cookieBanner');
const cookieAccept = document.getElementById('cookieAccept');

if (cookieBanner && cookieAccept) {
    // Only show if the person hasn't already accepted
    if (!getCookie('cookieConsent')) {
        cookieBanner.classList.add('active');
    }

    cookieAccept.addEventListener('click', () => {
        setCookie('cookieConsent', 'accepted', 365);
        cookieBanner.classList.remove('active');
    });
}






// =========================================================
// JOBS PAGE — edit JOB_LISTINGS to add/remove/change roles
// =========================================================
const jobsGrid = document.getElementById('jobsGrid');

if (jobsGrid) {
    // ---- 1. JOB DATA — EDIT THIS TO ADD / REMOVE / CHANGE ROLES ----
    // To ADD a job: copy an object below, paste it, change details.
    // To REMOVE a job: delete its whole { ... } object.
    // requirements -> array of short bullet points shown in the pop-up
    // applyLink    -> mailto:, application form URL, or job board link
    const JOB_LISTINGS = [
        {
            title: "Site Engineer",
            location: "Birmingham, UK",
            type: "Full-Time",
            description: "We're looking for a Site Engineer to oversee day-to-day operations on active project sites, ensuring work is delivered safely, on time, and to specification.",
            requirements: [
                "Relevant engineering or construction qualification",
                "2+ years' site experience",
                "Strong communication and problem-solving skills",
                "Full UK driving licence"
            ],
            applyLink: "mailto:careers@manstallimited.com?subject=Application - Site Engineer"
        },
        {
            title: "Project Coordinator",
            location: "Birmingham, UK",
            type: "Full-Time",
            description: "Support our project managers with scheduling, supplier coordination, and day-to-day admin to keep projects running smoothly from start to finish.",
            requirements: [
                "Excellent organisational skills",
                "Comfortable using Microsoft Office / project software",
                "Experience in construction or a similar industry preferred",
                "Strong attention to detail"
            ],
            applyLink: "mailto:careers@manstallimited.com?subject=Application - Project Coordinator"
        },
        {
            title: "Business Development Executive",
            location: "Hybrid / Birmingham, UK",
            type: "Full-Time",
            description: "Help grow our client base by identifying new opportunities, building relationships, and representing Manstal Limited at industry events.",
            requirements: [
                "Proven track record in B2B sales or business development",
                "Confident communicator and relationship builder",
                "Self-motivated with a target-driven mindset",
                "Willingness to travel for client meetings"
            ],
            applyLink: "mailto:careers@manstallimited.com?subject=Application - Business Development Executive"
        }
        // Add more roles here following the same format...
    ];

    // ---- 2. BUILD THE CARDS (shouldn't need to edit this) ----
    function renderJobs() {
        jobsGrid.innerHTML = '';

        if (JOB_LISTINGS.length === 0) {
            jobsGrid.innerHTML = '<p class="jobs-empty">There are no open roles right now — check back soon.</p>';
            return;
        }

        JOB_LISTINGS.forEach((job, index) => {
            const card = document.createElement('div');
            card.className = 'job-card';
            card.innerHTML = `
                <h3 class="job-card__title">${job.title}</h3>
                <div class="job-card__meta">
                    <span>${job.location}</span>
                    <span>${job.type}</span>
                </div>
                <button class="job-card__viewrole" data-index="${index}">View Role</button>
            `;
            jobsGrid.appendChild(card);
        });
    }

    renderJobs();

    // ---- 3. MODAL (POP-UP) LOGIC (shouldn't need to edit this) ----
    const jobModalOverlay   = document.getElementById('jobModalOverlay');
    const jobModalTitle     = document.getElementById('jobModalTitle');
    const jobModalLocation  = document.getElementById('jobModalLocation');
    const jobModalType      = document.getElementById('jobModalType');
    const jobModalDesc      = document.getElementById('jobModalDescription');
    const jobModalReqs      = document.getElementById('jobModalRequirements');
    const jobModalApply     = document.getElementById('jobModalApply');
    const jobModalClose     = document.getElementById('jobModalClose');

    function openJobModal(job) {
        jobModalTitle.textContent    = job.title;
        jobModalLocation.textContent = job.location;
        jobModalType.textContent     = job.type;
        jobModalDesc.textContent     = job.description;
        jobModalApply.href           = job.applyLink;

        jobModalReqs.innerHTML = '';
        job.requirements.forEach(req => {
            const li = document.createElement('li');
            li.textContent = req;
            jobModalReqs.appendChild(li);
        });

        jobModalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeJobModal() {
        jobModalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    jobsGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('job-card__viewrole')) {
            const index = e.target.dataset.index;
            openJobModal(JOB_LISTINGS[index]);
        }
    });

    jobModalClose.addEventListener('click', closeJobModal);

    jobModalOverlay.addEventListener('click', (e) => {
        if (e.target === jobModalOverlay) closeJobModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && jobModalOverlay.classList.contains('active')) closeJobModal();
    });
}

// =========================================================
// TEAM PAGE — edit TEAM_MEMBERS to add/remove/change people
// =========================================================
const teamGrid = document.getElementById('teamGrid');

if (teamGrid) {
    // ---- 1. TEAM DATA — EDIT THIS TO ADD / REMOVE / CHANGE PEOPLE ----
    // image     -> path to their photo (put photos in /images/team/)
    // linkedin  -> full https://linkedin.com/in/... URL
    // bio       -> shown in the pop-up only (keep cards clean)
    const TEAM_MEMBERS = [

        {
            name: "Aaron Arnold",
            role: "Project Director ",
            image: "images/team/aaron.png",
            linkedin: "https://uk.linkedin.com/in/aaron-arnold-669667192",
            bio: "Aaron Arnold is an accomplished Project Director with 25 years of experience in electrical installation, project management, and commercial office fit-out. With a comprehensive understanding of the industry from initial survey and design through to estimating, project delivery, and completion, Aaron brings a wealth of technical expertise and practical experience to every project. Over the course of his career, Aaron has successfully delivered more than 200 commercial office fit-out projects across London and the surrounding areas. His extensive experience enables him to manage complex projects effectively, ensuring high standards of quality, programme, and client satisfaction. Known for his hands-on approach, attention to detail, and strong project leadership, Aaron works closely with clients, consultants, contractors, and project teams to deliver solutions that meet both technical requirements and commercial objectives."
        },

        {
            name: "Harry Maskell",
            role: "Project Director ",
            image: "images/team/harry.jpg",
            linkedin: "linkedin.com/in/alfie-timmins-581a422b3 ",
            bio: "Harry Maskell is a Director with 18 years of experience in installation, project management, and commercial office fit-outs. He has a proven track record of successfully delivering projects of various sizes, primarily across London, from pre-construction through to completion. Harry is recognised for meeting tight deadlines, maintaining high standards, and building strong relationships with both new and existing clients."
        },

        {
            name: "David Climo",
            role: "Contracts Director ",
            image: "images/team/dave.png",
            linkedin: "https://www.linkedin.com/in/amara-okafor",
            bio: "David joined Manstal Ltd in 2006 and is involved in a number of projects across many different market sectors from initial conception to completion of employers requirements through to commissioning. David has experience of managing and delivering live education campus projects and strives to achieve client expectations. His role is to ensure the delivery of the M&E services to a project high standard, safe and on time."
        },

         {
            name: "Brad Baker",
            role: "Head of Pre-Contracts",
            image: "images/replace_bio.jpg",
            linkedin: "https://www.linkedin.com/in/brad-baker-320527260/",
            bio: "Brad Baker is Head of Pre-Contracts at Manstal, having joined the company in October 2018. A Mechanical and Public Health specialist, Brad leads the company's pre-construction activities, managing M&E enquiries, client engagement, mechanical design and build estimating, and the development of detailed MEP proposals. Working closely with the Electrical Pre-Construction team, he helps deliver coordinated and commercially competitive building services solutions. Brad works with clients and project teams throughout the pre-construction process, supporting projects from initial enquiry through to contract award."
        },
        {
            name: "Edward Williams",
            role: "Senior Mechanical Project Manager",
            image: "images/team/ed.png",
            linkedin: "https://uk.linkedin.com/in/edward-williams-76a98925",
            bio: "Edward Williams is a Senior Mechanical Project Manager with over 25 years of experience in the mechanical engineering and MEP sector. He specialises in the delivery of complex mechanical building services projects, combining strong technical knowledge with commercial management, design coordination and client liaison.Having progressed from hands-on project engineering into senior design, estimating and pre-construction roles, Edward brings a broad understanding of projects from pre-construction and design through to installation and completion.   He has worked across commercial, healthcare, education, logistics, residential, office and leisure sectors and has successfully supported the delivery and tendering of projects ranging from £5m to £26.5m."
        },
      
       
        
        {
            name: "Andy Wilkinson",
            role: "Electrical Project Manager",
            image: "images/replace_bio.jpg",
            linkedin: "https://www.linkedin.com/in/amara-okafor",
            bio: "Andy Wilkinson is an accomplished Project Manager with 27 years of experience in electrical installation, project management, estimating and commercial office fit-out. With a comprehensive understanding of the industry from initial survey and design through to estimating, project delivery, and completion, Andy brings a wealth of technical expertise and practical experience to every project. Over the course of his career, Andy has successfully project managed more than 50 projects in and around London and the surrounding areas and other areas of the country from office fit outs to LV panel upgrades. His extensive experience enables him to manage complex projects effectively, ensuring high standards of quality, programme, and client satisfaction. As of recent Andy has been spending more of his time carrying out pre-contracts side of the business but also still carries some project management due to his time been split between the two rolls. Known for hands-on approach, attention to detail, and strong project leadership, Andy has closely with consultants, contractors, and project teams to deliver solutions that meet both technical requirements and commercial objectives. "
        },
        {

            name: "Trevor Savatard",
            role: "Electrical Project Manager",
            image: "images/team/trevor.png",
            linkedin: "https://www.linkedin.com/in/trevor-savatard-76572960/",
            bio: "Trevor Savatard is an Electrical Project Manager with over 30 years of industry-leading experience. At Manstal Ltd, he oversees the end-to-end execution of electrical construction projects valued up to £750k. Specialising in Design & Build (D&B) frameworks, Trevor Savatard manages projects from initial pre-contract design and in-depth site surveys through to final client handover. He excels at precise labour coordination and implementing value engineering techniques that optimize budgets without sacrificing quality.Trevor Savatard is deeply committed to operational safety, ensuring rigid compliance with risk and method statements (RAMS) and obtaining all necessary compliance certifications. A natural leader and problem-solver, he serves as the core bridge between subcontractors and clients, consistently driving project efficiency, timeline adherence, and exceptional service value"
        },
     
        {
            name: "Keith Macbeth ",
            role: "Electrical Projects Manager ",
            image: "images/team/keith.png",
            linkedin: "https://www.linkedin.com/in/amara-okafor",
            bio: "I have been employed by Mansal since June 1997. After completing my apprenticeship with Mansal, I quickly became a site supervisor for many projects. In 2010 I became the lead site manager on various projects including a new build in 2021 for the University of Birmingham (TSE SRIC Tyseley Business Park).In 2022 I was offered a position as Project manager within Mansal, and have worked within that role on the complex refurbishment of Two Colmore Square, in Birmingham city centre."
        },

        {
            name: "Kshitij Rajiv Nigadikar",
            role: "BIM Manager",
            image: "images/team/krish.png",
            linkedin: "https://www.linkedin.com/in/amara-okafor",
            bio: "Kshitij Rajiv Nigadikar is a BIM Manager with 8 years of experience in BIM, digital construction, architectural design, and M&E project coordination. He is highly skilled in BIM coordination, model management, multidisciplinary coordination, and BIM software, including Revit, Navisworks, Solibri, BIMcollab, and other digital construction platforms. Kshitij has extensive experience in managing BIM workflows, coordinating complex projects, maintaining model standards, and supporting teams in delivering accurate, compliant, and information-rich models."
        },
       
        
        {
            name: "Brian Oguno",
            role: "BIM Technician",
            image: "images/team/brian.png",
            linkedin: "www.linkedin.com/in/brian-oguno",
            bio: "Brian is an Architectural Technology graduate and BIM Technician with a strong focus on digital design, multidisciplinary coordination, and the delivery of accurate, efficient documentation. With professional experience across commercial, healthcare, retail, office, and film studio projects, Brian works with architectural and structural disciplines to develop and coordinate BIM models throughout the technical design stage. His technical expertise includes Revit, AutoCAD, and Navisworks, with particular experience in clash detection, model management, drawing production, and BIM coordination in accordance with ISO 19650 standards. "
        },

        {
            name: "Alfie Timmins",
            role: "Junior Project Manager",
            image: "images/replace_bio.jpg",
            linkedin: "linkedin.com/in/alfie-timmins-581a422b3 ",
            bio: "Alfie is a Junior Project Manager at Manstal, working across building services projects from pre-construction through to delivery. He supports the coordination of mechanical and electrical services, working closely with clients, consultants, subcontractors and site teams to help ensure projects are delivered efficiently and to a high standard. Alfie holds a HNC in Building Services Engineering, which provides a strong technical foundation for his role and supports his understanding of mechanical and electrical building services. This technical knowledge, combined with his project experience, supports his involvement across project coordination, commercial management and on-site delivery. " 
        },
        
        {
            name: "Thomas Kyriakou",
            role: "Project Coordinator",
            image: "images/team/thomas.png",
            linkedin: "https://www.linkedin.com/in/amara-okafor",
            bio: "Thomas Kyriakou is a Project Coordinator with 1 year of experience in the industry. Specialising in mechanical systems, Thomas currently supervises installations for Sainsburys’ and Argos’ across the UK.   "
        },

         {
            name: "Richard Beardmore",
            role: "Qualifying Supervisor",
            image: "images/replace_bio.jpg",
            linkedin: "https://www.linkedin.com/in/amara-okafor",
            bio: "Richard Beardmore is the Qualifying Supervisor and holder of the company’s NICEIC registration. He has over 18 years’ experience within the electrical industry and has worked on a wide range of projects, from commercial developments and large industrial installations to hospitals and other complex environments. Richard is an experienced Electrical Test Engineer, with 12 years’ experience in electrical testing and inspection. In his current role at Manstal, he is responsible for ensuring that electrical projects comply with the relevant standards and regulations. He oversees the testing and inspection of electrical installations, ensuring that all works are completed to the required standards and that appropriate testing is undertaken to maintain ongoing electrical safety and compliance."
        },

        {
            name: "Sarah Drayton",
            role: "Contracts Administrator",
            image: "images/team/sarah.jpg",
            linkedin: "https://www.linkedin.com/in/amara-okafor",
            bio: "Sarah Drayton is an experienced Contracts Administrator working within the Electrical and Mechanical contracting sector, with strong experience in contract administration and commercial support. Sarah is responsible for managing and reviewing subcontractor applications for payment, assessing valuations, approving applications, and issuing payment notices. She also prepares applications for payment to clients, manages sales invoicing, and provides wider contracts administration support throughout the project lifecycle. With a highly organised and detail-oriented approach, Sarah works closely with subcontractors, clients, contractors, and internal teams to ensure contractual requirements, documentation, applications, and payment processes are managed accurately and efficiently. She is confident in managing competing priorities within a fast-paced environment while maintaining strong professional relationships and clear communication. Known for her thorough approach, attention to detail and commitment to delivering quality outcomes, Sarah provides reliable commercial and contractual support and contributes to the effective financial and contractual management of projects."
        },
        
        {
            name: "Rachel Savatard",
            role: "Office Administrator/Fleet Manager",
            image: "images/replace_bio.jpg",
            linkedin: "https://www.linkedin.com/in/amara-okafor",
            bio: "Rachel is an Office Administrator/ Fleet Manager with 8yrs experience within the business. Mainly dealing with Supplier invoices and the general day to day running of the office. Also running a small fleet of Company vehicles."
        },


        {
            name: "Helena Plant",
            role: "Assistant Accountant",
            image: "images/replace_bio.jpg",
            linkedin: "https://www.linkedin.com/in/amara-okafor",
            bio: "Helena is an assistant accountant with over 10 years experience in the finance sector. She currently specialises on the purchase ledger but also acts as a supporting role through-out the accounts department.   "
        },

          {
            name: "Sanju Karki",
            role: "Accounts/Payroll",
            image: "images/team/sanju.png",
            linkedin: "https://www.linkedin.com/in/amara-okafor",
            bio: "Payroll Professional with more than 10 years of experience. Specialising in PAYE and Subcontractor Payroll with strong expertise in payroll processing, HMRC compliance and end to end payroll administration."
        }
    
        
    ];

    // ---- 2. BUILD THE CARDS (you shouldn't need to edit this) ----
    TEAM_MEMBERS.forEach((member, index) => {
        const card = document.createElement('div');
        card.className = 'team-card';
        card.innerHTML = `
            <img src="${member.image}" alt="${member.name}" class="team-card__img">
            <h3 class="team-card__name">${member.name}</h3>
            <p class="team-card__role">${member.role}</p>
            <button class="team-card__readbio" data-index="${index}">Read Bio</button>
        `;
        teamGrid.appendChild(card);
    });

    // ---- 3. MODAL (POP-UP) LOGIC (you shouldn't need to edit this) ----
    const teamModalOverlay  = document.getElementById('teamModalOverlay');
    const teamModalImg      = document.getElementById('teamModalImg');
    const teamModalName     = document.getElementById('teamModalName');
    const teamModalRole     = document.getElementById('teamModalRole');
    const teamModalBio      = document.getElementById('teamModalBio');
    const teamModalLinkedin = document.getElementById('teamModalLinkedin');
    const teamModalClose    = document.getElementById('teamModalClose');

    function openTeamModal(member) {
        teamModalImg.src       = member.image;
        teamModalImg.alt       = member.name;
        teamModalName.textContent = member.name;
        teamModalRole.textContent = member.role;
        teamModalBio.textContent  = member.bio;
        teamModalLinkedin.href    = member.linkedin;

        teamModalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeTeamModal() {
        teamModalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    teamGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('team-card__readbio')) {
            const index = e.target.dataset.index;
            openTeamModal(TEAM_MEMBERS[index]);
        }
    });

    teamModalClose.addEventListener('click', closeTeamModal);

    teamModalOverlay.addEventListener('click', (e) => {
        if (e.target === teamModalOverlay) closeTeamModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && teamModalOverlay.classList.contains('active')) closeTeamModal();
    });
}