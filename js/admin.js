document.addEventListener("DOMContentLoaded", async function () {
  // Load and display packages
  async function loadPackages() {
    try {
      const res = await fetch("/rates");
      const data = await res.json();
      const packagesTable = document.getElementById("packagesTable");
      
      // Clear existing rows except header
      const rows = packagesTable.querySelectorAll("tr:not(:first-child)");
      rows.forEach(row => row.remove());
      
      // Add package rows
      if (data.packages && Array.isArray(data.packages)) {
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

  // Delete package
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

  // Add new package
  const packageForm = document.getElementById("packageForm");
  if (packageForm) {
    packageForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("packageName").value;
      const hours = Number(document.getElementById("packageHours").value);
      const price = Number(document.getElementById("packagePrice").value);

      try {
        const res = await fetch("/packages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, hours, price }),
        });

        if (!res.ok) throw new Error("Failed to add package");

        packageForm.reset();
        await loadPackages();
      } catch (err) {
        console.error("Error adding package:", err);
        alert("Pakket kon niet toegevoegd worden");
      }
    });
  }

  // Update hourly rate
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

  // Load packages on page load
  await loadPackages();
});

const orderList = [
  {
    id: 1,
    customer: "Brandon ",
    items: ["10 uur pakket"],
    total: 17,
  },
  {
    id: 2,
    customer: "Tijn ",
    items: ["50 uur pakket"],
    total: 85,
  } 
  
]; 

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
      <td><button class="btn-details">Details</button></td>
    `;

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

    // Als het de orders tab is, render de orders
    if (tabName === "admin-orders") {
        renderCustomersOrders(orderList);
    }
};