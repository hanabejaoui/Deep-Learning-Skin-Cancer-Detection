// 1️⃣ Get elements
const input = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const predictBtn = document.getElementById("predictBtn");
const resultDiv = document.getElementById("result");
const consentCheckbox = document.getElementById("consentCheckbox");

// 2️⃣ State
let selectedFile = null;

// 3️⃣ Image selection
input.addEventListener("change", () => {
  selectedFile = input.files[0];

  if (!selectedFile) {
    predictBtn.disabled = true;
    return;
  }

  // Show preview
  const url = URL.createObjectURL(selectedFile);
  preview.src = url;
  preview.style.display = "block";

  // Enable predict ONLY if consent is checked
  predictBtn.disabled = !consentCheckbox.checked;
  resultDiv.textContent = "";
});

// 4️⃣ Consent checkbox change
consentCheckbox.addEventListener("change", () => {
  if (selectedFile && consentCheckbox.checked) {
    predictBtn.disabled = false;
  } else {
    predictBtn.disabled = true;
  }
});

// 5️⃣ Predict button
predictBtn.addEventListener("click", async () => {
  if (!selectedFile) return;

  resultDiv.textContent = "Predicting...";

  const formData = new FormData();
  formData.append("image", selectedFile);

  const response = await fetch("/predict", {
    method: "POST",
    credentials: "same-origin",
    body: formData,
  });

  if (response.status === 401) {
    window.location.href = "login.html";
    return;
  }

  const data = await response.json();

  resultDiv.innerHTML = `
    <strong>Prediction:</strong> ${data.prediction}<br />
    <strong>Confidence:</strong> ${data.confidence}
  `;
});
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    try {
      const response = await fetch("/logout", {
        method: "POST",
        credentials: "same-origin", // 🔴 REQUIRED
      });

      if (response.ok) {
        window.location.href = "login.html";
      } else {
        alert("Logout failed");
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  });
}

