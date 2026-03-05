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
    const data = fs.readFileSync("data/rates.json", "utf8");
    res.json(JSON.parse(data));
  } else {
    res.json({});
  }
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
