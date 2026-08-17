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
