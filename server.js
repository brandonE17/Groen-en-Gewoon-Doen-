const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// simple logger for all requests
app.use((req, res, next) => {
  console.log(`Incoming ${req.method} ${req.url}`);
  next();
});

app.get('/status', (req, res) => {
  res.json({
    status: 'Running',
    timestamp: new Date().toISOString()
  });
});

// return current rate settings from data/rates.json
app.get('/rates', (req, res) => {
  if (fs.existsSync("data/rates.json")) {
    const data = fs.readFileSync("data/rates.json", "utf8");
    res.json(JSON.parse(data));
  } else {
    res.json({});
  }
});

// Update hourly rate
app.post('/rates', (req, res) => {
  const { hourlyRate } = req.body;
  let rates = { hourlyRate: 70, packages: [] };

  if (fs.existsSync("data/rates.json")) {
    const data = fs.readFileSync("data/rates.json", "utf8");
    rates = JSON.parse(data); 
  }
 
  rates.hourlyRate = hourlyRate;
  fs.writeFileSync("data/rates.json", JSON.stringify(rates, null, 2));

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
  let rates = { hourlyRate: 70, packages: [] };

  if (fs.existsSync("data/rates.json")) {
    const data = fs.readFileSync("data/rates.json", "utf8");
    rates = JSON.parse(data);
  }

  rates.packages.push(newPackage);
  fs.writeFileSync("data/rates.json", JSON.stringify(rates, null, 2));

  res.json({ message: "Package added", package: newPackage });
});

app.put('/packages/:id', (req, res) => {
  const { id } = req.params;
  const updatedPackage = req.body;
  let rates = { hourlyRate: 70, packages: [] };

  if (fs.existsSync("data/rates.json")) {
    const data = fs.readFileSync("data/rates.json", "utf8");
    rates = JSON.parse(data);
  }

  rates.packages[id] = updatedPackage;
  fs.writeFileSync("data/rates.json", JSON.stringify(rates, null, 2));

  res.json({ message: "Package updated", package: updatedPackage });
});

app.delete('/packages/:id', (req, res) => {
  const { id } = req.params;
  let rates = { hourlyRate: 70, packages: [] };

  if (fs.existsSync("data/rates.json")) {
    const data = fs.readFileSync("data/rates.json", "utf8");
    rates = JSON.parse(data);
  }

  rates.packages.splice(id, 1);
  fs.writeFileSync("data/rates.json", JSON.stringify(rates, null, 2));

  res.json({ message: "Package deleted" });
});

const PORT = process.env.PORT || 3000;
// bind to 0.0.0.0 so both IPv4 and IPv6 clients can connect
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
