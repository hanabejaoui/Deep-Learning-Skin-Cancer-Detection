const express = require("express");
const path = require("path");
const multer = require("multer");
const session = require("express-session");
const bcrypt = require("bcryptjs");

const db = require("./db/database"); // SQLite connection

const app = express();
const PORT = process.env.PORT || 3000;
secret: process.env.SESSION_SECRET || "dev-secret"





app.use(express.json());


app.use(
  session({
    secret: "skin-app-secret",
    resave: false,
    saveUninitialized: false,
  })
);


app.use(express.static(path.join(__dirname, "public")));



function requireLogin(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  next();
}


const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});


function dummyPredict() {
  const isMalignant = Math.random() > 0.5;
  const confidence = Math.random();

  return {
    prediction: isMalignant ? "Malignant" : "Benign",
    confidence: (confidence * 100).toFixed(2) + "%",
  };
}




app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, hashedPassword],
      function (err) {
        if (err) {
          return res.status(400).json({ error: "User already exists" });
        }
        res.json({ message: "User registered successfully" });
      }
    );
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing credentials" });
  }

  db.get(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, user) => {
      if (err || !user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Save user in session
      req.session.userId = user.id;
      req.session.email = user.email;

      res.json({ message: "Login successful" });
    }
  );
});

// LOGOUT
app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Logged out" });
  });
});

// CHECK AUTH
app.get("/check-auth", (req, res) => {
  if (req.session.userId) {
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});

/* -------------------- PREDICTION ROUTE -------------------- */

//  PROTECTED prediction route
app.post(
  "/predict",
  requireLogin,
  upload.single("image"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const result = dummyPredict();

    console.log(
      "User:",
      req.session.userId,
      "Prediction:",
      result.prediction,
      result.confidence
    );

    res.json(result);
  }
);



app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
