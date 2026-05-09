// Scroll animation observer
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add("visible");
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));

// Smooth active nav highlight
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach((s) => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach((l) => {
    l.style.color = l.getAttribute("href") === "#" + current ? "var(--accent)" : "";
  });
});

// Contact form submit via SMTP backend endpoint
const contactForm = document.getElementById("contact-form");
const contactFormStatus = document.getElementById("contact-form-status");

if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = contactForm.querySelector('button[type="submit"]');
    const formData = new FormData(contactForm);
    const payload = Object.fromEntries(formData.entries());

    contactFormStatus.style.display = "block";
    contactFormStatus.style.color = "var(--silver)";
    contactFormStatus.textContent = "Sending your message...";
    submitButton.disabled = true;

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Failed to send");

      contactForm.reset();
      contactFormStatus.style.color = "var(--cyan)";
      contactFormStatus.textContent = "Thank you! Your message was sent successfully.";
    } catch (error) {
      contactFormStatus.style.color = "#ff8080";
      contactFormStatus.textContent = "Sorry, message not sent. Please try again.";
    } finally {
      submitButton.disabled = false;
    }
  });
}
