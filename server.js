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

app.post('/login', (req, res) => {
  console.log('handling POST /login, body:', req.body);
  try {
    const { username, password } = req.body;
    const users = JSON.parse(fs.readFileSync("server.json", "utf8"));
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      res.json({ success: true, message: "Login successful" });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// static should be served after all dynamic routes
app.use(express.static(path.join(__dirname)));

const PORT = process.env.PORT || 3000;
// bind to 0.0.0.0 so both IPv4 and IPv6 clients can connect
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
