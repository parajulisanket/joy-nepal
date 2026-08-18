document.addEventListener("DOMContentLoaded", () => {
  // == Elements ==
  const menuButton = document.getElementById("menuButton");
  const sidebar = document.getElementById("sidebar");
  const sidebarBackdrop = document.getElementById("sidebarBackdrop");
  const closeSidebarButton = document.getElementById("closeSidebarButton");

  const searchButton = document.getElementById("searchButton");
  const searchOverlay = document.getElementById("searchOverlay");
  const searchBox = document.getElementById("searchBox");
  const closeSearchButton = document.getElementById("closeSearchButton");
  const searchInput = document.getElementById("searchInput");
  const searchForm = document.getElementById("searchForm");

  // == English Date ==
  function updateDate() {
    const now = new Date();

    // Line 1: Day of the week (e.g., "Friday")
    const dayName = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Kathmandu",
      weekday: "long",
    }).format(now);

    // Line 2: Month, Day, Year (e.g., "August 14, 2026")
    const dateFormatted = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Kathmandu",
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(now);

    const currentDayEl = document.getElementById("currentDay");
    const currentDateEl = document.getElementById("currentDate");

    if (currentDayEl) currentDayEl.textContent = dayName;
    if (currentDateEl) currentDateEl.textContent = dateFormatted;
  }

  updateDate();
  setInterval(updateDate, 60 * 1000);

  // == Sticky Navbar with Hysteresis ==
  const siteHeader = document.getElementById("siteHeader");
  const SCROLL_DOWN_THRESHOLD = 60;
  const SCROLL_UP_THRESHOLD = 20;
  let isHeaderCollapsed = false;

  function handleScroll() {
    if (!siteHeader) return;
    const currentScrollY = window.scrollY;

    if (!isHeaderCollapsed && currentScrollY > SCROLL_DOWN_THRESHOLD) {
      isHeaderCollapsed = true;
      siteHeader.classList.add("is-scrolled");
    } else if (isHeaderCollapsed && currentScrollY < SCROLL_UP_THRESHOLD) {
      isHeaderCollapsed = false;
      siteHeader.classList.remove("is-scrolled");
    }
  }

  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true },
  );

  handleScroll();

  // == Sidebar ==
  function openSidebar() {
    closeSearch();
    if (sidebar) sidebar.classList.remove("translate-x-full");
    if (sidebarBackdrop) {
      sidebarBackdrop.classList.remove("opacity-0", "pointer-events-none");
      sidebarBackdrop.classList.add("opacity-100", "pointer-events-auto");
    }
    document.body.classList.add("overflow-hidden");
  }

  function closeSidebar() {
    if (sidebar) sidebar.classList.add("translate-x-full");
    if (sidebarBackdrop) {
      sidebarBackdrop.classList.add("opacity-0", "pointer-events-none");
      sidebarBackdrop.classList.remove("opacity-100", "pointer-events-auto");
    }
    document.body.classList.remove("overflow-hidden");
  }

  if (menuButton) menuButton.addEventListener("click", openSidebar);
  if (closeSidebarButton)
    closeSidebarButton.addEventListener("click", closeSidebar);
  if (sidebarBackdrop) sidebarBackdrop.addEventListener("click", closeSidebar);

  // == Search ==
  function openSearch() {
    closeSidebar();
    if (searchOverlay) {
      searchOverlay.classList.remove("opacity-0", "pointer-events-none");
      searchOverlay.classList.add("opacity-100", "pointer-events-auto");
    }
    if (searchBox) {
      searchBox.classList.remove("-translate-y-4", "opacity-0");
      searchBox.classList.add("translate-y-0", "opacity-100");
    }
    document.body.classList.add("overflow-hidden");

    setTimeout(() => {
      if (searchInput) searchInput.focus();
    }, 250);
  }

  function closeSearch() {
    if (!searchOverlay || !searchBox) return;
    searchOverlay.classList.add("opacity-0", "pointer-events-none");
    searchOverlay.classList.remove("opacity-100", "pointer-events-auto");
    searchBox.classList.add("-translate-y-4", "opacity-0");
    searchBox.classList.remove("translate-y-0", "opacity-100");
    document.body.classList.remove("overflow-hidden");
  }

  if (searchButton) searchButton.addEventListener("click", openSearch);
  if (closeSearchButton)
    closeSearchButton.addEventListener("click", closeSearch);

  if (searchOverlay) {
    searchOverlay.addEventListener("click", (event) => {
      if (event.target === searchOverlay) {
        closeSearch();
      }
    });
  }

  // == Search Submission ==
  if (searchForm) {
    searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const query = searchInput.value.trim();
      if (!query) return;
      window.location.href = `/search.html?q=${encodeURIComponent(query)}`;
    });
  }

  // == Escape Key ==
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeSidebar();
      closeSearch();
    }
  });

  // == Weather ==
  if (typeof loadWeather === "function") {
    loadWeather();
  }
});

// banner carousle
document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".carousel-slide");
  const counterEl = document.getElementById("slide-counter");

  const nextBtn = document.getElementById("next-btn");
  const prevBtn = document.getElementById("prev-btn");

  let currentIndex = 0;
  let isAnimating = false;
  let autoRotateTimer = null;

  if (!slides.length) return;

  function updateButtons() {
    // Disable previous button on first slide
    if (currentIndex === 0) {
      prevBtn?.classList.add("opacity-30", "pointer-events-none");
    } else {
      prevBtn?.classList.remove("opacity-30", "pointer-events-none");
    }

    // Disable next button on last slide
    if (currentIndex === slides.length - 1) {
      nextBtn?.classList.add("opacity-30", "pointer-events-none");
    } else {
      nextBtn?.classList.remove("opacity-30", "pointer-events-none");
    }
  }

  function setSlideStates(newIndex, direction) {
    if (isAnimating || newIndex === currentIndex) return;

    // Don't allow movement outside carousel
    if (newIndex < 0 || newIndex >= slides.length) return;

    isAnimating = true;

    const currentSlide = slides[currentIndex];
    const nextSlide = slides[newIndex];

    nextSlide.classList.remove("pointer-events-none", "opacity-0", "z-0");

    nextSlide.classList.add("z-10");

    // Position incoming slide
    if (direction === "next") {
      nextSlide.classList.remove("-translate-x-full");
      nextSlide.classList.add("translate-x-full");
    } else {
      nextSlide.classList.remove("translate-x-full");
      nextSlide.classList.add("-translate-x-full");
    }

    // Force repaint
    void nextSlide.offsetWidth;

    // Move current slide away
    if (direction === "next") {
      currentSlide.classList.remove("translate-x-0");
      currentSlide.classList.add("-translate-x-full");
    } else {
      currentSlide.classList.remove("translate-x-0");
      currentSlide.classList.add("translate-x-full");
    }

    // Bring new slide in
    nextSlide.classList.remove("translate-x-full", "-translate-x-full");

    nextSlide.classList.add("translate-x-0");

    setTimeout(() => {
      currentSlide.classList.remove("z-10");

      currentSlide.classList.add("z-0", "pointer-events-none", "opacity-0");

      currentIndex = newIndex;

      updateButtons();

      isAnimating = false;
    }, 500);

    if (counterEl) {
      counterEl.textContent = `${newIndex + 1} / ${slides.length}`;
    }
  }

  function nextSlide() {
    // STOP if already at last slide
    if (currentIndex >= slides.length - 1) {
      stopTimer();
      return;
    }

    setSlideStates(currentIndex + 1, "next");
  }

  function prevSlide() {
    // STOP if already at first slide
    if (currentIndex <= 0) return;

    setSlideStates(currentIndex - 1, "prev");
  }

  function startTimer() {
    stopTimer();

    autoRotateTimer = setInterval(() => {
      // Stop automatic carousel when last slide is reached
      if (currentIndex >= slides.length - 1) {
        stopTimer();
        return;
      }

      nextSlide();
    }, 10000);
  }

  function stopTimer() {
    if (autoRotateTimer) {
      clearInterval(autoRotateTimer);
      autoRotateTimer = null;
    }
  }

  function resetTimer() {
    stopTimer();

    // Only restart if we're not on the last slide
    if (currentIndex < slides.length - 1) {
      startTimer();
    }
  }

  nextBtn?.addEventListener("click", () => {
    nextSlide();
    resetTimer();
  });

  prevBtn?.addEventListener("click", () => {
    prevSlide();
    resetTimer();
  });

  // Initial button state
  updateButtons();

  startTimer();
});
