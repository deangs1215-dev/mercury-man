const navLinks = [...document.querySelectorAll(".nav a")];
const reviewsTrack = document.querySelector(".reviews-track");
const reviewDots = [...document.querySelectorAll(".review-dots button")];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
);

sections.forEach((section) => observer.observe(section));

let reviewIndex = 0;
const reviewSteps = reviewDots.length;

const showReviewStep = (index) => {
  if (!reviewsTrack || !reviewSteps) return;
  reviewIndex = index % reviewSteps;
  reviewsTrack.style.setProperty("--review-index", reviewIndex);
  reviewDots.forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === reviewIndex);
  });
};

reviewDots.forEach((dot, index) => {
  dot.addEventListener("click", () => showReviewStep(index));
});

if (reviewsTrack && reviewSteps) {
  setInterval(() => showReviewStep(reviewIndex + 1), 5000);
}
