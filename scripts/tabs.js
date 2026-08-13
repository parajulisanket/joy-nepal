document.addEventListener("DOMContentLoaded", () => {
  const tabContainers = document.querySelectorAll("[data-tabs-container]");

  tabContainers.forEach((container) => {
    const tabButtons = container.querySelectorAll("[data-tab]");
    const tabPanes = container.querySelectorAll("[data-pane]");
    const viewAllLink = container.querySelector("[data-view-all-text]");

    if (!tabButtons.length || !tabPanes.length) return;

    tabButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetTab = btn.getAttribute("data-tab");
        const viewAllText = btn.getAttribute("data-view-all");

        // Toggle active button style
        tabButtons.forEach((b) => {
          b.classList.remove(
            "bg-[var(--secondary-color)]",
            "text-[#091633]",
            "shadow",
          );
          b.classList.add("text-[#091633]");
        });

        btn.classList.add(
          "bg-[var(--secondary-color)]",
          "text-[#091633]",
          "shadow",
        );
        btn.classList.remove("text-[#091633]");

        // Update View All link text dynamically
        if (viewAllLink && viewAllText) {
          viewAllLink.textContent = viewAllText;
        }

        // Toggle tab panes dynamically
        tabPanes.forEach((pane) => {
          if (pane.getAttribute("data-pane") === targetTab) {
            pane.classList.remove("hidden");
            setTimeout(() => {
              pane.classList.remove("opacity-0");
              pane.classList.add("opacity-100");
            }, 20);
          } else {
            pane.classList.remove("opacity-100");
            pane.classList.add("opacity-0");
            setTimeout(() => {
              pane.classList.add("hidden");
            }, 300);
          }
        });
      });
    });
  });
});
