document.addEventListener("DOMContentLoaded", async function () {
  // laad pakketten van de server en toon ze in de admin interface
  async function loadPackages() {
    try {
      const res = await fetch("/rates");
      const data = await res.json();
      const packagesTable = document.getElementById("packagesTable");
      
      // Eerst alle bestaande rijen verwijderen behalve de header ( chatGPT)
      const rows = packagesTable.querySelectorAll("tr:not(:first-child)");
      rows.forEach(row => row.remove());
      
      // toevoegen van pakketten aan de tabel
      if (data.packages && Array.isArray(data.packages)) {a
        data.packages.forEach((pkg, index) => {
          const row = packagesTable.insertRow();
          row.innerHTML = `
            <td>${pkg.name}</td>
            <td>${pkg.hours}</td>
            <td>€${pkg.price.toFixed(2)}</td>
            <td><button type="button" onclick="deletePackage(${index})">Verwijderen</button></td>
          `;
        });
      }
    } catch (err) {
      console.error("Error loading packages:", err);
    }
  }

  // verwijder pakket functie 
  window.deletePackage = async function (id) {
    if (confirm("Weet je zeker dat je dit pakket wilt verwijderen?")) {
      try {
        const res = await fetch(`/packages/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete package");
        await loadPackages();
      } catch (err) {
        console.error("Error deleting package:", err);
        alert("Pakket kon niet verwijderd worden");
      }
    }
  };

  // toevoegen van pakket functie
  const packageForm = document.getElementById("packageForm");
  if (packageForm) {
    packageForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("packageName").value.trim();
      const hours = Number(document.getElementById("packageHours").value);
      const price = Number(document.getElementById("packagePrice").value);

      if (!name || !hours || !price || hours <= 0 || price <= 0) {
        alert("Vul een geldige naam, uren en prijs in voor het pakket.");
        return;
      }
// Probeer eerst via de huidige origin te posten, als dat mislukt probeer dan localhost:3000 
      const apiBase = window.location.origin;
      const endpoint = `${apiBase}/packages`;

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, hours, price }),
        });

        if (!res.ok) {
          const body = await res.text();
          throw new Error(`HTTP ${res.status} - ${res.statusText}: ${body}`);
        }

        packageForm.reset();
        await loadPackages();
        alert(`Pakket '${name}' is toegevoegd.`);
      } catch (err) {
        console.error("Error adding package:", err);

        // tweede poging als origin geen werkende API heeft 
        if (apiBase !== "http://localhost:3000") {
          try {
            const res2 = await fetch("http://localhost:3000/packages", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name, hours, price }),
            });

            if (!res2.ok) {
              const body2 = await res2.text();
              throw new Error(`HTTP ${res2.status} - ${res2.statusText}: ${body2}`);
            }
// Als deze poging lukt, reset het formulier, herlaad de pakketten en toon een succesmelding
            packageForm.reset();
            await loadPackages();
            alert(`Pakket '${name}' is toegevoegd via http://localhost:3000.`);
            return;
          } catch (err2) {
            console.error("Fallback error adding package:", err2);
          }
        }

        alert("Pakket kon niet toegevoegd worden. Controleer of de backend draait op http://localhost:3000 en probeer opnieuw.");
      }
    });
  }

  // update van het uurtarief
  const rateForm = document.getElementById("rateForm");
  if (rateForm) {
    rateForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const hourlyRate = Number(document.getElementById("hourlyRate").value);

      try {
        const res = await fetch("/rates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ hourlyRate }),
        });

        if (!res.ok) throw new Error("Failed to update rate");

        alert("Tarief opgeslagen!");
        rateForm.reset();
      } catch (err) {
        console.error("Error updating rate:", err);
        alert("Tarief kon niet opgeslagen worden");
      }
    });
  }

  // orders laden van de server 
  async function loadOrders() {
    try {
      const res = await fetch("/orders");
      const orders = await res.json();
      const tbody = document.getElementById("order-table-body");
      tbody.innerHTML = "";
      
      if (!orders || orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6">Er zijn nog geen bestellingen.</td></tr>';
        return;
      }
      
      orders.forEach(order => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${order.id}</td>
          <td>${order.klant || "Anoniem"}</td>
          <td>${order.hours ? order.hours + " uur" : order.package || "N/A"}</td>
          <td>€${order.price || 0}</td>
          <td>${order.status}</td>
          <td>${new Date(order.date).toLocaleDateString()}</td>
        `;
        tbody.appendChild(row);
      });
    } catch (err) {
      console.error("Orders laden mislukt:", err);
    }
  }
  
  window.loadOrders = loadOrders;

  // Load packages on page load
  await loadPackages();
});

let orderList = [
  {
    id: 1,
    customer: "klant A ",
    items: ["10 uur pakket"],
    total: 17,
  },
  {
    id: 2,
    customer: "klant B",
    items: ["50 uur pakket"],
    total: 85,
  }
];

function handleOrderAction(orderId, action) {
  orderList = orderList.filter(order => order.id !== orderId);
  renderCustomersOrders(orderList);
  alert(`Order ${orderId} is ${action} en verwijderd uit de lijst.`);
}

function renderCustomersOrders(orderList) {
  const tbody = document.getElementById("order-table-body");
  tbody.innerHTML = "";

  if (!orderList || orderList.length === 0) {
    tbody.innerHTML = ` 
      <tr>
        <td colspan="6">Er zijn nog geen bestellingen.</td>
      </tr>
    `;
    return;
  }

  orderList.forEach(order => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${order.id}</td>
      <td>${order.customer}</td>
      <td>${order.items.join(", ")}</td>
      <td>€${order.total.toFixed(2)}</td>
      <td>In behandeling</td>
      <td class="order-actions">
        <button class="btn-details">Details</button>
      </td>
    `;

    const detailsBtn = row.querySelector(".btn-details");
    detailsBtn.addEventListener("click", () => {
      const actionCell = row.querySelector(".order-actions");

      // Toon niet opnieuw als actie-knoppen al zichtbaar zijn
      if (actionCell.querySelector(".btn-approve")) {
        return;
      }

      const approveBtn = document.createElement("button");
      approveBtn.textContent = "Goedkeuren";
      approveBtn.className = "btn-approve";

      const rejectBtn = document.createElement("button");
      rejectBtn.textContent = "Afkeuren";
      rejectBtn.className = "btn-reject";

      const cancelBtn = document.createElement("button");
      cancelBtn.textContent = "Annuleren";
      cancelBtn.className = "btn-cancel";

      actionCell.append(" ", approveBtn, " ", rejectBtn, " ", cancelBtn);

      approveBtn.addEventListener("click", () => handleOrderAction(order.id, "goedgekeurd"));
      rejectBtn.addEventListener("click", () => handleOrderAction(order.id, "afgekeurd"));
      cancelBtn.addEventListener("click", () => renderCustomersOrders(orderList));
    });

    tbody.appendChild(row);
  });
}
renderCustomersOrders(orderList);

window.openOders = function (evt, tabName) {
    const tabs = ["admin-orders", "admin-packages", "Tarieven-content"];

    // Verberg alles
    tabs.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = "none";
    });

    // Laat de gevraagde tab zien
    const activeTab = document.getElementById(tabName);
    if (activeTab) activeTab.style.display = "block";

    // Als het de orders tab is, laad orders van server
    if (tabName === "admin-orders") {
        loadOrders();
    }
};