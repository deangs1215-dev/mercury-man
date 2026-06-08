const loginPanel = document.querySelector("[data-login-panel]");
const dashboard = document.querySelector("[data-dashboard]");
const loginForm = document.querySelector("[data-login-form]");
const loginNote = document.querySelector("[data-login-note]");
const logoutButton = document.querySelector("[data-logout]");
const appointmentForm = document.querySelector("[data-appointment-form]");
const appointmentList = document.querySelector("[data-appointment-list]");
const feedbackList = document.querySelector("[data-feedback-list]");

const appointmentsKey = "mercuryManAppointments";
const feedbackKey = "mercuryManFeedback";
const sessionKey = "mercuryManAdmin";
const reviewBase = `${window.location.origin}${window.location.pathname.replace("admin.html", "review.html")}`;

const starterAppointments = [
  {
    id: "mm-001",
    name: "Thabo Jacobs",
    phone: "27797034628",
    service: "Classic Cut",
    time: "Today 09:30",
    status: "Booked",
  },
  {
    id: "mm-002",
    name: "Marcus Naidoo",
    phone: "27821234567",
    service: "Fade",
    time: "Today 11:00",
    status: "Booked",
  },
];

const getAppointments = () => {
  const stored = JSON.parse(localStorage.getItem(appointmentsKey) || "null");
  if (stored) return stored;
  localStorage.setItem(appointmentsKey, JSON.stringify(starterAppointments));
  return starterAppointments;
};

const setAppointments = (appointments) => {
  localStorage.setItem(appointmentsKey, JSON.stringify(appointments));
};

const getFeedback = () => JSON.parse(localStorage.getItem(feedbackKey) || "[]");

const cleanPhone = (phone) => phone.replace(/\D/g, "").replace(/^0/, "27");

const buildReviewLink = (appointment) => {
  const params = new URLSearchParams({
    appointment: appointment.id,
    name: appointment.name,
  });
  return `${reviewBase}?${params.toString()}`;
};

const buildWhatsAppLink = (appointment) => {
  const reviewLink = buildReviewLink(appointment);
  const message = `Hi ${appointment.name}, thank you for visiting Mercury Man today. We hope you loved your ${appointment.service}. Please rate your experience here: ${reviewLink}`;
  return `https://wa.me/${cleanPhone(appointment.phone)}?text=${encodeURIComponent(message)}`;
};

const renderAppointments = () => {
  const appointments = getAppointments();
  appointmentList.innerHTML = appointments
    .map((appointment) => {
      const isComplete = appointment.status === "Completed";
      return `
        <article class="appointment-item">
          <div>
            <h3>${appointment.name}</h3>
            <p>${appointment.service} - ${appointment.time} - ${appointment.phone} - ${appointment.source || "Admin"}</p>
            <p><span class="status-pill">${appointment.status}</span></p>
          </div>
          ${
            isComplete
              ? `<a class="button secondary complete-button" href="${buildWhatsAppLink(appointment)}" target="_blank" rel="noreferrer">Open WhatsApp</a>`
              : `<button class="button primary complete-button" type="button" data-complete="${appointment.id}">Complete</button>`
          }
        </article>
      `;
    })
    .join("");
};

const renderFeedback = () => {
  const feedback = getFeedback();
  feedbackList.innerHTML = feedback.length
    ? feedback
        .map(
          (item) => `
            <article class="feedback-item">
              <div>
                <h3>${item.name} - ${item.rating}/5</h3>
                <p>${item.message || "No message added."}</p>
              </div>
              <span class="status-pill">${item.rating >= 4.5 ? "Share prompt shown" : "Internal follow-up"}</span>
            </article>
          `
        )
        .join("")
    : `<p class="admin-note">No feedback submitted yet.</p>`;
};

const showDashboard = () => {
  loginPanel.hidden = true;
  dashboard.hidden = false;
  renderAppointments();
  renderFeedback();
};

if (localStorage.getItem(sessionKey) === "true") {
  showDashboard();
}

loginForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(loginForm);
  if (data.get("username") === "owner" && data.get("password") === "mercuryman2026") {
    localStorage.setItem(sessionKey, "true");
    showDashboard();
    return;
  }
  loginNote.textContent = "Use owner / mercuryman2026 for this demo.";
});

logoutButton?.addEventListener("click", () => {
  localStorage.removeItem(sessionKey);
  window.location.reload();
});

appointmentForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(appointmentForm);
  const appointments = getAppointments();
  appointments.unshift({
    id: `mm-${Date.now()}`,
    name: data.get("name"),
    phone: cleanPhone(data.get("phone")),
    service: data.get("service"),
    time: "Today",
    status: "Booked",
  });
  setAppointments(appointments);
  appointmentForm.reset();
  renderAppointments();
});

appointmentList?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-complete]");
  if (!button) return;
  const appointments = getAppointments();
  const appointment = appointments.find((item) => item.id === button.dataset.complete);
  if (!appointment) return;
  appointment.status = "Completed";
  appointment.completedAt = new Date().toISOString();
  setAppointments(appointments);
  renderAppointments();
  window.open(buildWhatsAppLink(appointment), "_blank", "noreferrer");
});
