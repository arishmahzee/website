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
// STATS COUNT-UP (Screen 2)      //
// ============================= //

const statNumbers = document.querySelectorAll('.stat__number');

function animateCount(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1500;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        el.textContent = Math.floor(progress * target);

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            el.textContent = target;
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
        colorClass: "project-card--amber",
        summary: "Short summary of the project goes here.",
        sector: "Retail",
        service: "Design & Build",
        details: "A longer description of Project One goes here — what it involved, the challenges, and the outcome for the client."
    },
    {
        title: "Project Two",
        image: "images/project-2.jpg",
        colorClass: "project-card--coral",
        summary: "Short summary of the project goes here.",
        sector: "Retail",
        service: "Design & Build",
        details: "A longer description of Project Two goes here — what it involved, the challenges, and the outcome for the client."
    },
    {
        title: "Project Three",
        image: "images/project-3.jpg",
        colorClass: "project-card--teal",
        summary: "Short summary of the project goes here.",
        sector: "Retail",
        service: "Design & Build",
        details: "A longer description of Project Three goes here — what it involved, the challenges, and the outcome for the client."
    },
    {
        title: "Project Four",
        image: "images/project-4.jpg",
        colorClass: "project-card--violet",
        summary: "Short summary of the project goes here.",
        sector: "Retail",
        service: "Design & Build",
        details: "A longer description of Project Four goes here — what it involved, the challenges, and the outcome for the client."
    },
    {
        title: "Project Five",
        image: "images/project-5-a.jpg",
        colorClass: "project-card--amber",
        summary: "Short summary of the project goes here.",
        sector: "Retail",
        service: "Design & Build",
        details: "A longer description of Project Five goes here — what it involved, the challenges, and the outcome for the client."
    },
    {
        title: "Project Six",
        image: "images/project-6-a.jpg",
        colorClass: "project-card--coral",
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
// CASE STUDIES PAGE — DATA
// EDIT THIS ARRAY TO ADD / REMOVE / CHANGE CASE STUDIES
// =========================================================
const CASE_STUDIES = [
    {
        title: "Case Study One",
        image: "images/case-1-a.jpg",
        summary: "Short summary of the project goes here.",
        details: "A longer description of Case Study One goes here — what it involved, the challenges, and the outcome for the client."
    },
    {
        title: "Case Study Two",
        image: "images/case-2-a.jpg",
        summary: "Short summary of the project goes here.",
        details: "A longer description of Case Study Two goes here — what it involved, the challenges, and the outcome for the client."
    },
    {
        title: "Case Study Three",
        image: "images/case-3-a.jpg",
        summary: "Short summary of the project goes here.",
        details: "A longer description of Case Study Three goes here — what it involved, the challenges, and the outcome for the client."
    },
    {
        title: "Case Study Four",
        image: "images/case-4-a.jpg",
        summary: "Short summary of the project goes here.",
        details: "A longer description of Case Study Four goes here — what it involved, the challenges, and the outcome for the client."
    },
    {
        title: "Case Study Five",
        image: "images/case-5-a.jpg",
        summary: "Short summary of the project goes here.",
        details: "A longer description of Case Study Five goes here — what it involved, the challenges, and the outcome for the client."
    },
    {
        title: "Case Study Six",
        image: "images/case-6-a.jpg",
        summary: "Short summary of the project goes here.",
        details: "A longer description of Case Study Six goes here — what it involved, the challenges, and the outcome for the client."
    },
    {
        title: "Case Study Seven",
        image: "images/case-7-a.jpg",
        summary: "Short summary of the project goes here.",
        details: "A longer description of Case Study Seven goes here — what it involved, the challenges, and the outcome for the client."
    },
    {
        title: "Case Study Eight",
        image: "images/case-8-a.jpg",
        summary: "Short summary of the project goes here.",
        details: "A longer description of Case Study Eight goes here — what it involved, the challenges, and the outcome for the client."
    }
    // Add more case studies here following the same format...
];

// =========================================================
// CASE STUDIES PAGE — BUILD CARDS + MODAL LOGIC
// Only runs if #caseStudiesGrid exists on the page (i.e. caseStudies.html)
// =========================================================
const caseStudiesGrid = document.getElementById('caseStudiesGrid');

if (caseStudiesGrid) {
    CASE_STUDIES.forEach((study, index) => {
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
        caseStudiesGrid.appendChild(card);
    });

    const caseOverlay    = document.getElementById('caseModalOverlay');
    const caseModalImg   = document.getElementById('caseModalImg');
    const caseModalTitle = document.getElementById('caseModalTitle');
    const caseModalBody  = document.getElementById('caseModalBody');
    const caseModalClose = document.getElementById('caseModalClose');

    function openCaseModal(study) {
        caseModalImg.src = study.image;
        caseModalImg.alt = study.title;
        caseModalTitle.textContent = study.title;
        caseModalBody.textContent  = study.details;

        caseOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeCaseModal() {
        caseOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    caseStudiesGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('case-card__link')) {
            e.preventDefault();
            const index = e.target.dataset.index;
            openCaseModal(CASE_STUDIES[index]);
        }
    });

    caseModalClose.addEventListener('click', closeCaseModal);

    caseOverlay.addEventListener('click', (e) => {
        if (e.target === caseOverlay) closeCaseModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && caseOverlay.classList.contains('active')) closeCaseModal();
    });
}


// =========================================================
// SERVICES PAGE — DATA
// EDIT THIS ARRAY TO ADD / REMOVE / CHANGE SERVICES
// =========================================================
const SERVICES = [
    {
        title: "Service One",
        image: "images/service-1.jpg",
        summary: "One line description of the service goes here.",
        details: "A longer description of Service One goes here — what it involves, who it's for, and what the client gets out of it."
    },
    {
        title: "Service Two",
        image: "images/service-2.jpg",
        summary: "One line description of the service goes here.",
        details: "A longer description of Service Two goes here — what it involves, who it's for, and what the client gets out of it."
    },
    {
        title: "Service Three",
        image: "images/service-3.jpg",
        summary: "One line description of the service goes here.",
        details: "A longer description of Service Three goes here — what it involves, who it's for, and what the client gets out of it."
    },
    {
        title: "Service Four",
        image: "images/service-4.jpg",
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
        image: "images/project-1.jpg",
        summary: "Short description of the project goes here and what it involved and the outcome for the client.",
        details: "A longer description of Project One goes here — what it involved, the challenges, and the outcome for the client."
    },
    {
        title: "Project Two",
        image: "images/project-2.jpg",
        summary: "Short description of the project goes here and what it involved and the outcome for the client.",
        details: "A longer description of Project Two goes here — what it involved, the challenges, and the outcome for the client."
    },
    {
        title: "Project Three",
        image: "images/project-3.jpg",
        summary: "Short description of the project goes here and what it involved and the outcome for the client.",
        details: "A longer description of Project Three goes here — what it involved, the challenges, and the outcome for the client."
    },
    {
        title: "Project Four",
        image: "images/project-4.jpg",
        summary: "Short description of the project goes here and what it involved and the outcome for the client.",
        details: "A longer description of Project Four goes here — what it involved, the challenges, and the outcome for the client."
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
// HOME PAGE — CASE STUDIES PREVIEW DATA
// EDIT THIS ARRAY TO ADD / REMOVE / CHANGE HOME CASE STUDY CARDS
// =========================================================
const HOME_CASE_STUDIES = [
    {
        title: "Case Study One",
        image: "images/case-1-a.jpg",
        summary: "Short summary of the project goes here.",
        details: "A longer description of Case Study One goes here — what it involved, the challenges, and the outcome for the client."
    },
    {
        title: "Case Study Two",
        image: "images/case-2-a.jpg",
        summary: "Short summary of the project goes here.",
        details: "A longer description of Case Study Two goes here — what it involved, the challenges, and the outcome for the client."
    },
    {
        title: "Case Study Three",
        image: "images/case-3-a.jpg",
        summary: "Short summary of the project goes here.",
        details: "A longer description of Case Study Three goes here — what it involved, the challenges, and the outcome for the client."
    },
    {
        title: "Case Study Four",
        image: "images/case-4-a.jpg",
        summary: "Short summary of the project goes here.",
        details: "A longer description of Case Study Four goes here — what it involved, the challenges, and the outcome for the client."
    }
];

// =========================================================
// HOME PAGE — CASE STUDIES PREVIEW: BUILD CARDS + MODAL LOGIC
// Only runs if #homeCaseStudiesGrid exists (i.e. index.html)
// =========================================================
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
// HOME PAGE — NEWS PREVIEW DATA
// EDIT THIS ARRAY TO ADD / REMOVE / CHANGE HOME NEWS CARDS
// =========================================================
const HOME_NEWS = [
    {
        title: "News Title One",
        image: "images/news1.jpg",
        summary: "Short paragraph summary goes here.",
        details: "A longer version of News Title One goes here — the full story, context, and why it matters."
    },
    {
        title: "News Title Two",
        image: "images/news2.jpg",
        summary: "Short paragraph summary goes here.",
        details: "A longer version of News Title Two goes here — the full story, context, and why it matters."
    },
    {
        title: "News Title Three",
        image: "images/news3.jpg",
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
// CONTACT US FORM — sends data to the backend server
// =========================================================
// While testing on your own computer, this points at
// http://localhost:3000 — that's the small backend server
// from the "manstal-backend" folder, running via `npm start`.
//
// Once your backend is hosted live on the internet, change
// BACKEND_URL below to that live address, e.g.
// "https://your-backend-address.com/api/contact"
// =========================================================

const contactUsForm = document.getElementById('contact-us-form');

if (contactUsForm) {
    const BACKEND_URL = "http://localhost:3000/api/contact";
    const statusEl = document.getElementById('contact-form-status');
    const submitBtn = document.getElementById('contact-submit-btn');

    contactUsForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(contactUsForm);
        const data = Object.fromEntries(formData);

        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";
        statusEl.textContent = "";

        try {
            const response = await fetch(BACKEND_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                statusEl.textContent = "Thanks! Your message has been sent — we'll be in touch soon.";
                statusEl.style.color = "#1F4E96";
                contactUsForm.reset();
            } else {
                statusEl.textContent = "Something went wrong sending your message. Please try again, or email us directly.";
                statusEl.style.color = "#c0392b";
            }
        } catch (error) {
            console.error('Contact form error:', error);
            statusEl.textContent = "Couldn't reach the server. Please try again, or email us directly at info@manstallimited.com.";
            statusEl.style.color = "#c0392b";
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = "Send Message";
        }
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
            name: "Jane Doe",
            role: "Managing Director",
            image: "images/team/jane-doe.jpg",
            linkedin: "https://www.linkedin.com/in/jane-doe",
            bio: "A short bio about Jane's background, experience, and role at Manstal Limited goes here."
        },
        {
            name: "John Smith",
            role: "Head of Operations",
            image: "images/team/john-smith.jpg",
            linkedin: "https://www.linkedin.com/in/john-smith",
            bio: "A short bio about John's background, experience, and role at Manstal Limited goes here."
        },
        {
            name: "Amara Okafor",
            role: "Lead Engineer",
            image: "images/team/amara-okafor.jpg",
            linkedin: "https://www.linkedin.com/in/amara-okafor",
            bio: "A short bio about Amara's background, experience, and role at Manstal Limited goes here."
        },
        {
            name: "Arishmah Zeeshan",
            role: "Best Intern Ever",
            image: "images/team/amara-okafor.jpg",
            linkedin: "https://www.linkedin.com/in/arishmah-zeeshan",
            bio: "A short bio about background, experience, and role at Manstal Limited goes here."
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