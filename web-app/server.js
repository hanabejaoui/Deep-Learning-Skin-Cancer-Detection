const express = require("express");
const path = require("path");
const multer = require("multer");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const { spawn } = require("child_process");
const fs = require("fs");

const db = require("./db/database");

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());

app.use(
  session({
    secret: "skin-app-secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.static(path.join(__dirname, "public")));

/* -------------------- AUTH CHECK -------------------- */

function requireLogin(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  next();
}

/* -------------------- MULTER -------------------- */

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      const uniqueName = Date.now() + "-" + file.originalname;
      cb(null, uniqueName);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
});

/* -------------------- REGISTER -------------------- */

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

/* -------------------- LOGIN -------------------- */

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing credentials" });
  }

  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    req.session.userId = user.id;
    req.session.email = user.email;

    res.json({ message: "Login successful" });
  });
});

/* -------------------- LOGOUT -------------------- */

app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Logged out" });
  });
});

/* -------------------- CHECK AUTH -------------------- */

app.get("/check-auth", (req, res) => {
  if (req.session.userId) {
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});

/* -------------------- PREDICTION ROUTE -------------------- */

app.post("/predict", requireLogin, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image uploaded" });
  }

  const imagePath = req.file.path;

  const pythonExe = path.join(__dirname, "venv", "Scripts", "python.exe");

  const pythonProcess = spawn(pythonExe, [
    path.join(__dirname, "ML", "predict.py"),
    imagePath,
  ]);

  let resultData = "";

  pythonProcess.stdout.on("data", (data) => {
    resultData += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error("Python Error:", data.toString());
  });

  pythonProcess.on("close", (code) => {
    try {
      const result = JSON.parse(resultData.trim());
      res.json(result);
    } catch (error) {
      console.error("JSON parse error:", error);
      console.error("Raw output:", resultData);
      res.status(500).json({ error: "Prediction parsing failed" });
    }

    fs.unlink(imagePath, (err) => {
      if (err) console.error("Failed to delete image:", err);
    });
  });
});

/* -------------------- START SERVER -------------------- */

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});