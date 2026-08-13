document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("carouselTrack");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  if (!track || !prevBtn || !nextBtn) return;

  // Calculates width of one card + gap (gap is 24px for gap-6)
  const getScrollAmount = () => {
    const firstCard = track.querySelector("a");
    const cardWidth = firstCard ? firstCard.offsetWidth : 320;
    const gap = 24;
    return cardWidth + gap;
  };

  // Scroll Left
  prevBtn.addEventListener("click", () => {
    track.scrollBy({
      left: -getScrollAmount(),
      behavior: "smooth",
    });
  });

  // Scroll Right
  nextBtn.addEventListener("click", () => {
    track.scrollBy({
      left: getScrollAmount(),
      behavior: "smooth",
    });
  });
});
