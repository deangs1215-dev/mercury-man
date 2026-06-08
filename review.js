const form = document.querySelector("[data-review-form]");
const result = document.querySelector("[data-review-result]");
const intro = document.querySelector("[data-review-intro]");
const stars = [...document.querySelectorAll("[data-star]")];
const feedbackKey = "mercuryManFeedback";
const shareReviewLink = "https://wa.me/27797034628?text=Hi%20Mercury%20Man%2C%20I%20had%20a%20great%20experience.";
const params = new URLSearchParams(window.location.search);
const customerName = params.get("name") || "there";
let rating = 0;

intro.textContent = `Hi ${customerName}, thank you for visiting Mercury Man. Please rate your experience.`;

const updateStars = () => {
  stars.forEach((star) => {
    star.classList.toggle("active", Number(star.dataset.star) <= rating);
  });
};

stars.forEach((star) => {
  star.addEventListener("click", () => {
    rating = Number(star.dataset.star);
    updateStars();
  });
});

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!rating) {
    result.hidden = false;
    result.textContent = "Please select a star rating first.";
    return;
  }

  const data = new FormData(form);
  const feedback = JSON.parse(localStorage.getItem(feedbackKey) || "[]");
  feedback.unshift({
    appointment: params.get("appointment") || "walk-in",
    name: customerName,
    rating,
    message: data.get("message"),
    createdAt: new Date().toISOString(),
  });
  localStorage.setItem(feedbackKey, JSON.stringify(feedback));

  result.hidden = false;
  if (rating >= 4.5) {
    result.innerHTML = `
      <p>Thank you, ${customerName}. We are glad you had a great experience.</p>
      <p>Would you mind sharing this with the Mercury Man team too?</p>
      <a class="button primary" href="${shareReviewLink}" target="_blank" rel="noreferrer">Send review</a>
    `;
  } else {
    result.innerHTML = `
      <p>Thank you for your honest feedback, ${customerName}. We are sorry we missed the mark.</p>
      <p>The Mercury Man team will use this for a personal follow-up.</p>
    `;
  }
  form.hidden = true;
});
