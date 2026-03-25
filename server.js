const fs = require("fs");
const path = require("path");
const express = require("express");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.get('/status', (req, res) => {
  res.json({
    status: 'Running',
    timestamp: new Date().toISOString()
  });
});

// return current rate settings from data/rates.json
app.get('/rates', (req, res) => {
  if (fs.existsSync("data/rates.json")) {
    const data = JSON.parse(fs.readFileSync("data/rates.json", "utf8"));
    if (data.pricing) {
      return res.json({
        hourlyRate: data.pricing.hourlyRate || 0,
        packages: data.pricing.packages || []
      });
    }
    return res.json(data);
  } else {
    res.json({ hourlyRate: 0, packages: [] });
  }
});

// Update hourly rate
app.post('/rates', (req, res) => {
  const { hourlyRate } = req.body; 
  let data = { hourlyRate: 70, packages: [] };

  if (fs.existsSync("data/rates.json")) { 
    data = JSON.parse(fs.readFileSync("data/rates.json", "utf8"));
  }

  if (data.pricing) {
    data.pricing.hourlyRate = hourlyRate;
  } else {
    data.hourlyRate = hourlyRate;
    if (!Array.isArray(data.packages)) data.packages = [];
  }

  fs.writeFileSync("data/rates.json", JSON.stringify(data, null, 2));
  res.json({ message: "Rate updated", hourlyRate });
});

app.post('/orders', (req, res) => {
  const newOrder = req.body;
  let orders = [];

  if (fs.existsSync("orders.json")) {
    const data = fs.readFileSync("orders.json", "utf8");
    orders = JSON.parse(data);
  }

  orders.push(newOrder);
  fs.writeFileSync("orders.json", JSON.stringify(orders, null, 2));

  res.json({ message: "Order saved", order: newOrder });
});

// Manage packages
app.post('/packages', (req, res) => {
  const newPackage = req.body;
  if (!newPackage || typeof newPackage !== 'object') {
    return res.status(400).json({ message: 'Ongeldige request body' });
  }

  if (!newPackage.name || !newPackage.hours || !newPackage.price) {
    return res.status(400).json({ message: 'Vul naam, uren en prijs in' });
  }

  if (Number(newPackage.hours) <= 0 || Number(newPackage.price) <= 0) {
    return res.status(400).json({ message: 'Uren en prijs moeten groter dan 0 zijn' });
  }

  let data = { hourlyRate: 70, packages: [] };

  if (fs.existsSync("data/rates.json")) {
    data = JSON.parse(fs.readFileSync("data/rates.json", "utf8"));
  }

  if (data.pricing) {
    if (!Array.isArray(data.pricing.packages)) data.pricing.packages = [];
    data.pricing.packages.push(newPackage);
  } else {
    if (!Array.isArray(data.packages)) data.packages = [];
    data.packages.push(newPackage);
  }

  fs.writeFileSync("data/rates.json", JSON.stringify(data, null, 2));

  res.json({ message: "Package added", package: newPackage });
});
app.put('/packages/:id', (req, res) => {
  const { id } = req.params;
  const updatedPackage = req.body;
  let data = { hourlyRate: 70, packages: [] };

  if (fs.existsSync("data/rates.json")) {
    data = JSON.parse(fs.readFileSync("data/rates.json", "utf8"));
  }

  if (data.pricing) {
    if (!Array.isArray(data.pricing.packages)) data.pricing.packages = [];
    data.pricing.packages[id] = updatedPackage;
  } else {
    if (!Array.isArray(data.packages)) data.packages = [];
    data.packages[id] = updatedPackage;
  }

  fs.writeFileSync("data/rates.json", JSON.stringify(data, null, 2));
  res.json({ message: "Package updated", package: updatedPackage });
});

app.delete('/packages/:id', (req, res) => {
  const { id } = req.params;
  let data = { hourlyRate: 70, packages: [] };

  if (fs.existsSync("data/rates.json")) {
    data = JSON.parse(fs.readFileSync("data/rates.json", "utf8"));
  }

  if (data.pricing) {
    if (!Array.isArray(data.pricing.packages)) data.pricing.packages = [];
    data.pricing.packages.splice(id, 1);
  } else {
    if (!Array.isArray(data.packages)) data.packages = [];
    data.packages.splice(id, 1);
  }

  fs.writeFileSync("data/rates.json", JSON.stringify(data, null, 2));
  res.json({ message: "Package deleted" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
