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
// ============================= //

const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault(); // stops the default page-reload behaviour

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        console.log('Form submitted (not yet sent anywhere):', data);
        alert('Thanks! This form isn\'t connected to a server yet — that\'s our next step.');

        contactForm.reset();
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