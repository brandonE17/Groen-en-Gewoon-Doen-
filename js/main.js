

document.addEventListener("DOMContentLoaded", function () {


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
      // fetch hourly rate from server
      const ratesRes = await fetch("/rates");
      const rates = await ratesRes.json();
      const price = hours * rates.hourlyRate;

      const res = await fetch("/orders", {
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

document.getElementById("calcBtn").addEventListener("click", calculate);

// window.calculate = calculate;

  async function calculate() {
 
    let grasValue = Number(document.getElementById("gras").value);
    let tegelsValue = Number(document.getElementById("tegels").value);
    let hegValue = Number(document.getElementById("heg").value);

const rates = await (await fetch("./data/rates.json")).json();

const grassM2 = Number(document.getElementById("gras").value);
const tegels = Number(document.getElementById("tegels").value);
const heg = Number(document.getElementById("heg").value);

const grassRate = rates.find(rate => rate.id === "gras").number || 0;
const tegelsRate = rates.find(rate => rate.id === "tegels").number || 0;
const hegRate = rates.find(rate => rate.id === "heg").number || 0;

const result = (grassM2 * grassRate) + (tegels * tegelsRate) + (heg * hegRate);

document.getElementById("result").innerText =
     "resultaat:" + result



    // let json = await response.json();

    // let jsonValue = json.number;

    // let result = inputValue * jsonValue;

    // document.getElementById("result").innerText =
    // "resultaat:" + result


  }
  
});
