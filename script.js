const menuLinks = document.querySelectorAll(".menu-link");
const sections = document.querySelectorAll(".page-section");
const homeLink = document.getElementById("homeLink");
const backToTopButton = document.getElementById("backToTop");

const projectItems = document.querySelectorAll(".project-item");
const projectButtons = document.querySelectorAll(".project-toggle");
const viewer = document.getElementById("projectViewer");
const viewerImage = document.getElementById("projectViewerImage");
const viewerDots = document.getElementById("projectViewerDots");

const exhibitionItem = document.querySelector(".exhibition-item-left");
const exhibitionViewer = document.getElementById("exhibitionViewer");
const exhibitionViewerImage = document.getElementById("exhibitionViewerImage");
const exhibitionViewerDots = document.getElementById("exhibitionViewerDots");

/* -----------------------------
   Flèche visible / cachée
----------------------------- */
function updateBackToTop(sectionId) {
  if (!backToTopButton) return;

  if (sectionId === "home" || sectionId === "contact") {
    backToTopButton.style.display = "none";
  } else {
    backToTopButton.style.display = "block";
  }
}

/* -----------------------------
   Galerie projets
----------------------------- */
let currentProjectImages = [];
let currentProjectIndex = 0;

function clearViewerDots() {
  if (!viewerDots) return;
  viewerDots.innerHTML = "";
}

function setEmptyViewer() {
  currentProjectImages = [];
  currentProjectIndex = 0;

  if (viewerImage) {
    viewerImage.src = "";
    viewerImage.classList.add("is-empty");
  }

  clearViewerDots();
}

function showSinglePreviewImage(src) {
  if (!viewerImage || !src) return;

  viewerImage.src = src;
  viewerImage.classList.remove("is-empty");
  clearViewerDots();
}

function buildViewerDots(total) {
  if (!viewerDots) return;

  viewerDots.innerHTML = "";

  for (let i = 0; i < total; i++) {
    const dot = document.createElement("span");
    dot.className = "dot";

    if (i === currentProjectIndex) {
      dot.classList.add("active");
    }

    viewerDots.appendChild(dot);
  }
}

function updateViewer() {
  if (!viewerImage) return;

  if (!currentProjectImages.length) {
    setEmptyViewer();
    return;
  }

  viewerImage.src = currentProjectImages[currentProjectIndex];
  viewerImage.classList.remove("is-empty");

  const dots = viewerDots.querySelectorAll(".dot");
  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentProjectIndex);
  });
}

function setViewerImages(imagesArray, startIndex = 0) {
  currentProjectImages = imagesArray;
  currentProjectIndex = startIndex;
  buildViewerDots(imagesArray.length);
  updateViewer();
}

function getImagesFromItem(item) {
  const raw = item.dataset.images || "";
  return raw
    .split(",")
    .map((src) => src.trim())
    .filter(Boolean);
}

function setPreview(item) {
  const preview = item.dataset.preview;
  const images = getImagesFromItem(item);

  if (preview) {
    showSinglePreviewImage(preview);
    return;
  }

  if (images.length) {
    showSinglePreviewImage(images[0]);
  }
}

/* -----------------------------
   Accordion projets
----------------------------- */
function setOpenHeight(details) {
  if (!details) return;
  details.style.maxHeight = details.scrollHeight + 40 + "px";
}

function resetAllProjects() {
  projectItems.forEach((item) => {
    const details = item.querySelector(".project-details");
    item.classList.remove("open");

    if (details) {
      details.style.maxHeight = "0px";
    }
  });
}

function resetProjectsToDefault() {
  resetAllProjects();
  setEmptyViewer();
}

function openProject(item) {
  const details = item.querySelector(".project-details");
  if (!details) return;

  item.classList.add("open");
  details.style.maxHeight = "0px";
  details.offsetHeight;
  setOpenHeight(details);

  const images = getImagesFromItem(item);
  if (images.length) {
    setViewerImages(images, 0);
  } else if (item.dataset.preview) {
    showSinglePreviewImage(item.dataset.preview);
  }
}

function closeProject(item) {
  const details = item.querySelector(".project-details");
  if (!details) return;

  setOpenHeight(details);
  details.offsetHeight;
  item.classList.remove("open");
  details.style.maxHeight = "0px";
  setEmptyViewer();
}

/* -----------------------------
   Navigation générale
----------------------------- */
function showSection(sectionId) {
  const currentActive = document.querySelector(".page-section.active");
  const currentActiveId = currentActive ? currentActive.id : null;

  if (currentActiveId === "projects" && sectionId !== "projects") {
    resetProjectsToDefault();
  }

  sections.forEach((section) => {
    section.classList.remove("active");
  });

  const target = document.getElementById(sectionId);
  if (target) {
    target.classList.add("active");
  }

  menuLinks.forEach((link) => {
    link.classList.remove("active-link");
    if (link.dataset.section === sectionId) {
      link.classList.add("active-link");
    }
  });

  if (sectionId === "projects") {
    resetProjectsToDefault();
  }

  updateBackToTop(sectionId);

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

menuLinks.forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    showSection(this.dataset.section);
  });
});

if (homeLink) {
  homeLink.addEventListener("click", function (e) {
    e.preventDefault();
    showSection("home");
  });
}

/* -----------------------------
   Retour en haut
----------------------------- */
if (backToTopButton) {
  backToTopButton.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

/* -----------------------------
   Hover aperçu
----------------------------- */
projectItems.forEach((item) => {
  item.addEventListener("mouseenter", function () {
    if (item.classList.contains("open")) {
      const images = getImagesFromItem(item);

      if (images.length) {
        currentProjectImages = images;
        updateViewer();
      } else if (item.dataset.preview) {
        showSinglePreviewImage(item.dataset.preview);
      }

      return;
    }

    setPreview(item);
  });
});

const projectsList = document.querySelector(".projects-list");

if (projectsList) {
  projectsList.addEventListener("mouseleave", function () {
    const openItem = document.querySelector(".project-item.open");

    if (!openItem) {
      setEmptyViewer();
      return;
    }

    const images = getImagesFromItem(openItem);
    if (!images.length) return;

    currentProjectImages = images;

    if (currentProjectIndex >= images.length) {
      currentProjectIndex = 0;
    }

    buildViewerDots(images.length);
    updateViewer();
  });
}

/* -----------------------------
   Clic ouvre / ferme
----------------------------- */
projectButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const item = this.closest(".project-item");
    if (!item) return;

    const isOpen = item.classList.contains("open");
    const alreadyOpen = document.querySelector(".project-item.open");

    if (isOpen) {
      closeProject(item);
      return;
    }

    if (alreadyOpen && alreadyOpen !== item) {
      const oldDetails = alreadyOpen.querySelector(".project-details");
      const newDetails = item.querySelector(".project-details");

      if (oldDetails) {
        setOpenHeight(oldDetails);
      }

      if (newDetails) {
        newDetails.style.maxHeight = "0px";
      }

      if (oldDetails) {
        oldDetails.offsetHeight;
      }

      if (newDetails) {
        newDetails.offsetHeight;
      }

      alreadyOpen.classList.remove("open");
      item.classList.add("open");

      requestAnimationFrame(() => {
        if (oldDetails) {
          oldDetails.style.maxHeight = "0px";
        }

        if (newDetails) {
          setOpenHeight(newDetails);
        }
      });

      const images = getImagesFromItem(item);
      if (images.length) {
        setViewerImages(images, 0);
      } else if (item.dataset.preview) {
        showSinglePreviewImage(item.dataset.preview);
      }

      return;
    }

    openProject(item);
  });
});

/* -----------------------------
   Resize
----------------------------- */
window.addEventListener("resize", function () {
  const openItem = document.querySelector(".project-item.open");
  if (!openItem) return;

  const details = openItem.querySelector(".project-details");
  if (!details) return;

  setOpenHeight(details);
});

/* -----------------------------
   Clic image suivante projets
----------------------------- */
if (viewer) {
  viewer.addEventListener("click", function () {
    const openItem = document.querySelector(".project-item.open");
    if (!openItem) return;
    if (!currentProjectImages.length) return;

    currentProjectIndex++;

    if (currentProjectIndex >= currentProjectImages.length) {
      currentProjectIndex = 0;
    }

    updateViewer();
  });
}

/* -----------------------------
   Recalcul si sigile chargé
----------------------------- */
document.querySelectorAll(".project-sigil img").forEach((img) => {
  img.addEventListener("load", () => {
    const openItem = img.closest(".project-item.open");
    if (!openItem) return;

    const details = openItem.querySelector(".project-details");
    if (!details) return;

    setOpenHeight(details);
  });
});

/* -----------------------------
   Exhibition viewer
----------------------------- */
let currentExhibitionImages = [];
let currentExhibitionIndex = 0;

function getExhibitionImages() {
  if (!exhibitionItem) return [];

  const raw = exhibitionItem.dataset.images || "";
  return raw
    .split(",")
    .map((src) => src.trim())
    .filter(Boolean);
}

function buildExhibitionDots(total) {
  if (!exhibitionViewerDots) return;

  exhibitionViewerDots.innerHTML = "";

  for (let i = 0; i < total; i++) {
    const dot = document.createElement("span");
    dot.className = "dot";

    if (i === currentExhibitionIndex) {
      dot.classList.add("active");
    }

    exhibitionViewerDots.appendChild(dot);
  }
}

function updateExhibitionViewer() {
  if (!exhibitionViewerImage || !currentExhibitionImages.length) return;

  exhibitionViewerImage.src = currentExhibitionImages[currentExhibitionIndex];
  exhibitionViewerImage.style.display = "block";
  exhibitionViewerImage.style.opacity = "1";
  exhibitionViewerImage.style.visibility = "visible";
  exhibitionViewerImage.style.width = "100%";
  exhibitionViewerImage.style.height = "100%";
  exhibitionViewerImage.style.objectFit = "contain";

  const dots = exhibitionViewerDots.querySelectorAll(".dot");
  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentExhibitionIndex);
  });
}

function initExhibitionViewer() {
  currentExhibitionImages = getExhibitionImages();
  currentExhibitionIndex = 0;
  buildExhibitionDots(currentExhibitionImages.length);
  updateExhibitionViewer();
}

if (exhibitionViewer) {
  exhibitionViewer.addEventListener("click", function () {
    if (!currentExhibitionImages.length) return;

    currentExhibitionIndex++;

    if (currentExhibitionIndex >= currentExhibitionImages.length) {
      currentExhibitionIndex = 0;
    }

    updateExhibitionViewer();
  });
}

initExhibitionViewer();
showSection("home");