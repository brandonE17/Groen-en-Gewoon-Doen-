import { testPackages } from "../data/packages.js";

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("demo").innerHTML = JSON.stringify(testPackages, null, 2);

  const modal = document.getElementById("loginModal");
  const btn = document.getElementById("loginBtn");
  const closeBtn = document.querySelector(".close");

  btn.addEventListener("click", function () {
    modal.style.display = "block";
  });

  closeBtn.addEventListener("click", function () {
    modal.style.display = "none";
  });

  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

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

    try {
      const res = await fetch("/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hours }),
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
});
