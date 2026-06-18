const DEFAULT_API_BASE =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://127.0.0.1:8000"
    : "https://prime-axis-poyt4vlpn-itsthajume-1169s-projects.vercel.app";

const API_BASE_URL = window.PRIME_AXIS_API_BASE || DEFAULT_API_BASE;

function parseApiError(data) {
  if (Array.isArray(data.detail)) {
    return data.detail.map((item) => item.msg).join(" ");
  }
  if (typeof data.detail === "string") {
    return data.detail;
  }
  return data.message || "Failed to send message.";
}

function trackContactConversion() {
  if (typeof gtag === "function") {
    gtag("event", "ads_conversion_Contact_1", {});
  }
}

// Google tag (gtag.js) event - delayed navigation helper
function gtagSendEvent(url) {
  const callback = function () {
    if (typeof url === "string") {
      window.location = url;
    }
  };

  if (typeof gtag !== "function") {
    callback();
    return false;
  }

  gtag("event", "ads_conversion_Contact_1", {
    event_callback: callback,
    event_timeout: 2000,
  });
  return false;
}

window.gtagSendEvent = gtagSendEvent;

function trackContactLinkClick(url, openInNewTab) {
  const navigate = function () {
    if (typeof url !== "string") return;
    if (openInNewTab) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      window.location = url;
    }
  };

  if (typeof gtag !== "function") {
    navigate();
    return;
  }

  gtag("event", "ads_conversion_Contact_1", {
    event_callback: navigate,
    event_timeout: 2000,
  });
}

function initContactConversionLinks() {
  document
    .querySelectorAll('a[href^="mailto:"], a[href^="tel:"], a[href*="wa.me"]')
    .forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        trackContactLinkClick(
          link.getAttribute("href"),
          link.target === "_blank"
        );
      });
    });
}

export async function submitContactForm(formElement, apiBaseUrl = API_BASE_URL) {
  const formData = new FormData(formElement);
  const response = await fetch(`${apiBaseUrl.replace(/\/$/, "")}/api/contact`, {
    method: "POST",
    body: formData
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(parseApiError(data));
  }

  return data;
}

function initContactForm() {
  const form = document.getElementById("contact-form");
  const statusEl = document.getElementById("contact-form-status");
  if (!form || !statusEl) return;

  const submitButton = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    statusEl.style.display = "block";
    statusEl.style.color = "var(--silver)";
    statusEl.textContent = "Sending your message...";
    submitButton.disabled = true;

    try {
      const data = await submitContactForm(form);
      trackContactConversion();
      form.reset();
      statusEl.style.color = "var(--cyan)";
      statusEl.textContent =
        data.message || "Thank you! Your message was sent successfully.";
    } catch (error) {
      statusEl.style.color = "#ff8080";
      statusEl.textContent =
        error.message || "Sorry, message not sent. Please try again.";
    } finally {
      submitButton.disabled = false;
    }
  });
}

initContactForm();
initContactConversionLinks();
