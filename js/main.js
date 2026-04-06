document.addEventListener("DOMContentLoaded", function () {

  // Check if logged in
  if (localStorage.getItem('loggedIn') === 'true') {
    document.getElementById("loginBtn").innerText = "Uitloggen";
  }

  const modal = document.getElementById("loginModal");
  const btn = document.getElementById("loginBtn");
  const closeBtn = document.querySelector(".close");

  btn.addEventListener("click", function () {
    if (btn.innerText === "Uitloggen") {
      if (confirm("Weet je zeker dat je wilt uitloggen?")) {
        const messageDiv = document.getElementById("loginMessage");
        messageDiv.style.display = "none";
        btn.innerText = "Login";
        localStorage.removeItem('loggedIn');
      }
    } else {
      modal.style.display = "block";
    }
  });

  closeBtn.addEventListener("click", function () {
    modal.style.display = "none";
  });

  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  document.getElementById("loginSubmitBtn").addEventListener("click", async function () {
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value;
    const errorMsg = document.getElementById("loginError");

    errorMsg.style.display = "none";

    try {
      const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        modal.style.display = "none";
        localStorage.setItem('loggedIn', 'true');
        window.location.href = "/admin.html";
      } else {
        errorMsg.style.display = "block";
      }
    } catch (err) {
      console.error("Login fout:", err); 
      errorMsg.style.display = "block";
    }
  });

  // Custom offer modal
  const custom = document.getElementById("customOffer");
  const customBtn = document.getElementById("customBtn");
  const span = document.getElementsByClassName("customClose")[0];

  customBtn.onclick = () => (custom.style.display = "block");
  span.onclick = () => (custom.style.display = "none");
  window.onclick = (event) => {
    if (event.target === custom) custom.style.display = "none";
  };

  document.getElementById("customForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const hours = Number(document.getElementById("Hours").value);
    const klantNaam = document.getElementById("klantNaam").value;

    try {
      const ratesRes = await fetch("/rates");
      const rates = await ratesRes.json();
      const price = hours * rates.hourlyRate;

      const res = await fetch("/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hours, price, klant: klantNaam }),
      });

      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }

      const data = await res.json();
      console.log(data);

      custom.style.display = "none";
      e.target.reset();
      loadOrders();
    } catch (err) {
      console.error("Could not submit order:", err);
      alert("Kon bestelling niet verzenden. Controleer of de server draait op http://localhost:3000.");
    }
  });

  // Bestel standaard pakket (uit test-branche)
  document.getElementById("bestelStandaard").addEventListener("click", async () => {
    const selected = document.querySelector("select").value;
    try {
      const res = await fetch("/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ package: selected, price: 0 })
      });
      if (res.ok) {
        alert("Bestelling geplaatst!");
        loadOrders();
      } else {
        alert("Fout bij bestellen");
      }
    } catch (err) {
      alert("Fout: " + err.message);
    }
  });

  // Calculator (correcte versie)
  document.getElementById("calcBtn").addEventListener("click", calculate);

  async function calculate() {
    const grassM2 = Number(document.getElementById("gras").value);
    const tegels = Number(document.getElementById("tegels").value);
    const heg = Number(document.getElementById("heg").value);

    const rates = await (await fetch("./data/rates.json")).json();

    const grassRate = rates.items.find(rate => rate.id === "gras").number || 0;
    const tegelsRate = rates.items.find(rate => rate.id === "tegels").number || 0;
    const hegRate = rates.items.find(rate => rate.id === "heg").number || 0;

    const result = (grassM2 * grassRate) + (tegels * tegelsRate) + (heg * hegRate);

    document.getElementById("result").innerText = "Resultaat: €" + result.toFixed(2);
  }

  // Laden van orders bij start
  loadOrders();
});

// Load orders
async function loadOrders() {
  try {
    const response = await fetch("./orders.json");
    const orders = await response.json();
    const tbody = document.getElementById("ordersTable");
    tbody.innerHTML = "";
    orders.forEach(order => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${order.id}</td>
        <td>${order.klant || "Anoniem"} - ${order.hours ? order.hours + " uur" : order.package || "N/A"}</td>
        <td>€${order.price || order.total || 0}</td>
        <td>${order.status}</td>
        <td>${new Date(order.date).toLocaleDateString()}</td>
      `;
      tbody.appendChild(row);
    });
  } catch (err) {
    console.error("Kon orders niet laden:", err);
  }
}