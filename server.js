const express = require('express');
const path = require('path');
const session = require('express-session');
const app = express();
const PORT = 8080;

// Middleware
app.use(express.static(path.join(__dirname)));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Sessie configuratie
app.use(session({
  secret: 'jouw-geheime-sleutel',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 dag
}));

// Voorbeeldgebruikers (in echte app zou dit in database zijn)
const users = {
  'admin': 'wachtwoord123',
  'user': 'test'
};

// Login endpoint
app.post('/login', (req, res) => {
  const { uname, psw } = req.body;
  
  // Check of gebruiker bestaat en wachtwoord klopt
  if (users[uname] && users[uname] === psw) {
    // Sla gebruiker op in sessie
    req.session.user = uname;
    res.json({ success: true, message: `Welkom ${uname}!` });
  } else {
    res.json({ success: false, message: 'Gebruikersnaam of wachtwoord incorrect' });
  }
});

// Logout endpoint
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.json({ success: false });
    }
    res.json({ success: true });
  });
});

// Check of je ingelogd bent
app.get('/check-login', (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Server draait op http://localhost:${PORT}/`);
});



