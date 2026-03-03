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
