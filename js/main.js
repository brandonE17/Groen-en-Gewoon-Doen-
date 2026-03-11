console.log("main.js loaded");

const modal = document.getElementById("loginModal");
const btn = document.getElementById("loginBtn");
const closeBtn = document.querySelector(".close");

if (btn) {
  btn.addEventListener("click", function () {
    modal.style.display = "block";
  });
}

if (closeBtn) {
  closeBtn.addEventListener("click", function () {
    modal.style.display = "none";
  });
}

window.addEventListener("click", function (event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

// Form was removed by browser, so find the submit button instead
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const submitBtn = modal ? modal.querySelector("button[type='submit']") : null;

console.log("Found inputs:", !!usernameInput, !!passwordInput);
console.log("Found submit button:", !!submitBtn);

if (submitBtn) {
  submitBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const username = usernameInput.value;
    const password = passwordInput.value;

    console.log("Login attempt with:", username, password);

    try {
      const res = await fetch("http://127.0.0.1:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      console.log("Response status:", res.status);

      const data = await res.json();
      console.log("Login response:", data);
      if (data.success) {
        alert("Login successful!");
        modal.style.display = "none";
        setTimeout(() => {
          window.location.href = "/admin.html";
        }, 100);
      } else {
        alert("Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed. Check if server is running.");
    }
  });
}

// Also handle Enter key on password input
if (passwordInput) {
  passwordInput.addEventListener("keypress", async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const username = usernameInput.value;
      const password = passwordInput.value;

      console.log("Login attempt (Enter key) with:", username, password);

      try {
        const res = await fetch("http://127.0.0.1:3000/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });

        console.log("Response status:", res.status);

        const data = await res.json();
        console.log("Login response:", data);
        if (data.success) {
          alert("Login successful!");
          modal.style.display = "none";
          setTimeout(() => {
            window.location.href = "/admin.html";
          }, 100);
        } else {
          alert("Invalid credentials");
        }
      } catch (err) {
        console.error("Login error:", err);
        alert("Login failed. Check if server is running.");
      }
    }
  });
}

const custom = document.getElementById("customOffer");
const customBtn = document.getElementById("customBtn");
const span = document.getElementsByClassName("customClose")[0];

if (customBtn && custom) {
  customBtn.onclick = () => (custom.style.display = "block");
}

if (span && custom) {
  span.onclick = () => (custom.style.display = "none");
}

window.onclick = (event) => {
  if (custom && event.target === custom) custom.style.display = "none";
};

const customForm = document.getElementById("customForm");
if (customForm) {
  customForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const hours = Number(document.getElementById("Hours").value);

    try {
      const ratesRes = await fetch("http://localhost:3000/rates");
      const rates = await ratesRes.json();
      const price = hours * rates.hourlyRate;

      const res = await fetch("http://localhost:3000/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hours, price }),
      });

      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }

      const data = await res.json();
      console.log(data);

      custom.style.display = "none";
      e.target.reset();
    } catch (err) {
      console.error("Could not submit order:", err);
      alert("Kon bestelling niet verzenden. Controleer of de server draait op http://localhost:3000.");
    }
  });
}
