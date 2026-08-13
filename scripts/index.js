// == Global Helpers ==
function toNepaliNumber(number) {
  return new Intl.NumberFormat("ne-NP-u-nu-deva", {
    maximumFractionDigits: 0,
  }).format(number);
}

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

  // == Date ==
  function updateDate() {
    const now = new Date();

    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Kathmandu",
      weekday: "long",
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }).formatToParts(now);

    const getPart = (type) => parts.find((part) => part.type === type)?.value;

    const englishDay = getPart("weekday");
    const day = Number(getPart("day"));
    const month = Number(getPart("month"));
    const year = Number(getPart("year"));

    const nepaliDays = {
      Sunday: "आइतबार",
      Monday: "सोमबार",
      Tuesday: "मंगलबार",
      Wednesday: "बुधबार",
      Thursday: "बिहीबार",
      Friday: "शुक्रबार",
      Saturday: "शनिबार",
    };

    const nepaliMonths = [
      "",
      "जनवरी",
      "फेब्रुअरी",
      "मार्च",
      "अप्रिल",
      "मे",
      "जुन",
      "जुलाई",
      "अगस्ट",
      "सेप्टेम्बर",
      "अक्टोबर",
      "नोभेम्बर",
      "डिसेम्बर",
    ];

    document.getElementById("currentDay").textContent = nepaliDays[englishDay];

    document.getElementById("currentDate").textContent =
      `${toNepaliNumber(day)} ${nepaliMonths[month]} ${toNepaliNumber(year)}`;
  }

  updateDate();
  setInterval(updateDate, 60 * 1000);

  // == Sticky Navbar with Hysteresis (Prevents Slow-Scroll Glitches) ==
  const siteHeader = document.getElementById("siteHeader");
  const SCROLL_DOWN_THRESHOLD = 60; // Collapse header when scrolling past 60px
  const SCROLL_UP_THRESHOLD = 20; // Expand header only when scrolling back up past 20px
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
    sidebar.classList.remove("translate-x-full");
    sidebarBackdrop.classList.remove("opacity-0", "pointer-events-none");
    sidebarBackdrop.classList.add("opacity-100", "pointer-events-auto");
    document.body.classList.add("overflow-hidden");
  }

  function closeSidebar() {
    sidebar.classList.add("translate-x-full");
    sidebarBackdrop.classList.add("opacity-0", "pointer-events-none");
    sidebarBackdrop.classList.remove("opacity-100", "pointer-events-auto");
    document.body.classList.remove("overflow-hidden");
  }

  if (menuButton) menuButton.addEventListener("click", openSidebar);
  if (closeSidebarButton)
    closeSidebarButton.addEventListener("click", closeSidebar);
  if (sidebarBackdrop) sidebarBackdrop.addEventListener("click", closeSidebar);

  // == Search ==
  function openSearch() {
    closeSidebar();
    searchOverlay.classList.remove("opacity-0", "pointer-events-none");
    searchOverlay.classList.add("opacity-100", "pointer-events-auto");
    searchBox.classList.remove("-translate-y-4", "opacity-0");
    searchBox.classList.add("translate-y-0", "opacity-100");
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
  loadWeather();
});

// == Weather Settings ==
const DEFAULT_LOCATION = {
  latitude: 27.7172,
  longitude: 85.324,
  name: "काठमाडौं",
};

// == Weather API ==
async function getWeather(latitude, longitude, locationName) {
  const weatherTemperature = document.getElementById("weatherTemperature");
  const weatherLocation = document.getElementById("weatherLocation");
  const weatherIcon = document.getElementById("weatherIcon");

  try {
    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${latitude}` +
      `&longitude=${longitude}` +
      `&current=temperature_2m,weather_code,is_day` +
      `&timezone=auto`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Weather API request failed");

    const data = await response.json();
    const temperature = Math.round(data.current.temperature_2m);
    const weatherCode = data.current.weather_code;
    const isDay = data.current.is_day;

    if (weatherTemperature)
      weatherTemperature.textContent = `${toNepaliNumber(temperature)}°`;
    if (weatherLocation) weatherLocation.textContent = locationName;

    updateWeatherIcon(weatherIcon, weatherCode, isDay);
  } catch (error) {
    console.error("Weather error:", error);
    if (weatherTemperature) weatherTemperature.textContent = "--°";
    if (weatherLocation) weatherLocation.textContent = locationName;
    if (weatherIcon) weatherIcon.className = "ph ph-cloud-slash text-2xl";
  }
}

// == Load Weather ==
function loadWeather() {
  if (!navigator.geolocation) {
    useKathmanduWeather();
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      getWeather(latitude, longitude, "हालको स्थान");
    },
    () => {
      useKathmanduWeather();
    },
    {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 10 * 60 * 1000,
    },
  );
}

// == Kathmandu Fallback ==
function useKathmanduWeather() {
  getWeather(
    DEFAULT_LOCATION.latitude,
    DEFAULT_LOCATION.longitude,
    DEFAULT_LOCATION.name,
  );
}

// == Weather Icons ==
function updateWeatherIcon(element, weatherCode, isDay) {
  if (!element) return;
  let icon = "ph-cloud-sun";

  if (weatherCode === 0) {
    icon = isDay ? "ph-sun" : "ph-moon-stars";
  } else if ([1, 2].includes(weatherCode)) {
    icon = isDay ? "ph-cloud-sun" : "ph-cloud-moon";
  } else if (weatherCode === 3) {
    icon = "ph-cloud";
  } else if ([45, 48].includes(weatherCode)) {
    icon = "ph-cloud-fog";
  } else if (
    [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)
  ) {
    icon = "ph-cloud-rain";
  } else if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
    icon = "ph-cloud-snow";
  } else if ([95, 96, 99].includes(weatherCode)) {
    icon = "ph-cloud-lightning";
  }

  element.className = `ph ${icon} text-2xl`;
}
