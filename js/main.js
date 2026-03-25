console.log("main.js loaded");

// ================= LOGIN MODAL =================
const modal = document.getElementById("loginModal");
const btn = document.getElementById("loginBtn");
const closeBtn = document.querySelector(".close");

if (btn && modal) {
  btn.addEventListener("click", () => {
    modal.style.display = "block";
  });
}

if (closeBtn && modal) {
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });
}

window.addEventListener("click", (event) => {
  if (modal && event.target === modal) {
    modal.style.display = "none";
  }
});

// ================= LOGIN =================
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const submitBtn = modal ? modal.querySelector("button[type='submit']") : null;

async function handleLogin() {
  if (!usernameInput || !passwordInput) return;

  const username = usernameInput.value;
  const password = passwordInput.value;

  console.log("Login attempt with:", username);

  try {
    const res = await fetch("http://127.0.0.1:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      throw new Error("Server error");
    }

    const data = await res.json();

    if (data.success) {
      alert("Login successful!");
      modal.style.display = "none";
      window.location.href = "/admin.html";
    } else {
      alert("Invalid credentials");
    }
  } catch (err) {
    console.error("Login error:", err);
    alert("Login failed. Check if server is running.");
  }
}

if (submitBtn && usernameInput && passwordInput) {
  submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    handleLogin();
  });

  passwordInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleLogin();
    }
  });
}

// ================= CUSTOM MODAL =================
const custom = document.getElementById("customOffer");
const customBtn = document.getElementById("customBtn");
const span = document.getElementsByClassName("customClose")[0];

if (customBtn && custom) {
  customBtn.onclick = () => (custom.style.display = "block");
}

if (span && custom) {
  span.onclick = () => (custom.style.display = "none");
}

window.addEventListener("click", (event) => {
  if (custom && event.target === custom) {
    custom.style.display = "none";
  }
});

// ================= CUSTOM FORM =================
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

      await res.json();

      custom.style.display = "none";
      e.target.reset();
    } catch (err) {
      console.error("Could not submit order:", err);
      alert("Kon bestelling niet verzenden.");
    }
  });
}

document.getElementById("calcBtn").addEventListener("click", calculate);

// window.calculate = calculate;

  async function calculate() {
 
    let grasValue = Number(document.getElementById("gras").value);
    let tegelsValue = Number(document.getElementById("tegels").value);
    let hegValue = Number(document.getElementById("heg").value);

const rates = await (await fetch("./data/rates.json")).json();
const items = Array.isArray(rates.items) ? rates.items : [];

const grassM2 = Number(document.getElementById("gras").value);
const tegels = Number(document.getElementById("tegels").value);
const heg = Number(document.getElementById("heg").value);

const grassRate = (items.find(rate => rate.id === "gras") || {}).number || 0;
const tegelsRate = (items.find(rate => rate.id === "tegels") || {}).number || 0;
const hegRate = (items.find(rate => rate.id === "heg") || {}).number || 0;

const result = (grassM2 * grassRate) + (tegels * tegelsRate) + (heg * hegRate);

document.getElementById("result").innerText =
     "resultaat:" + result


// ================= CALCULATOR =================
const calcBtn = document.getElementById("calcBtn");

if (calcBtn) {
  calcBtn.addEventListener("click", calculate);
}

async function calculate() {
  try {
    const rates = await (await fetch("./data/rates.json")).json();

    const grassM2 = Number(document.getElementById("gras").value);
    const tegels = Number(document.getElementById("tegels").value);
    const heg = Number(document.getElementById("heg").value);

    const grassRate = rates.find(r => r.id === "gras")?.number || 0;
    const tegelsRate = rates.find(r => r.id === "tegels")?.number || 0;
    const hegRate = rates.find(r => r.id === "heg")?.number || 0;

    const result = (grassM2 * grassRate) + (tegels * tegelsRate) + (heg * hegRate);

    document.getElementById("result").innerText = "resultaat: " + result;
  } catch (err) {
    console.error("Calculation error:", err);
  }
}

// ================= ORDERS TABLE =================
fetch("./orders.json")
  .then(response => response.json())
  .then(data => {
    const table = document.getElementById("ordersTable");

    if (!table) return;

    data.forEach((order) => {
      const row = `
        <tr>
          <td>${order.id}</td>
          <td>${order.pakket}</td>
          <td>${order.offerte}</td>
          <td>${order.status}</td>
          <td>${order.datum}</td>
        </tr>
      `;

      table.innerHTML += row;
    });
  });
  
};
  })
  .catch(err => console.error("Error loading orders:", err));
