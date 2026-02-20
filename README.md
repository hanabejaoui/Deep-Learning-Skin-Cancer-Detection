# Deep Learning Skin Cancer Detection – Web Application

A web-based binary skin lesion classification system developed as part of a Master's thesis research project.  
This application deploys a deep learning model trained on the HAM10000 dataset to classify dermoscopic images as **Benign** or **Malignant**.

---

## 📌 Project Overview

This project demonstrates a complete end-to-end machine learning pipeline:

- Deep learning model training using transfer learning
- Comparison of architectures: ResNet-50, EfficientNet-B0, EfficientNet-B4
- Model evaluation and selection
- Deployment of the best-performing model into a web application
- Real-time image upload and prediction interface

The application is intended strictly for **research and educational purposes**.

---

## 🧠 Model Information

- Dataset: HAM10000 (Human Against Machine with 10000 training images)
- Task: Binary classification (Benign vs Malignant)
- Approach: Transfer learning
- Architectures evaluated:
  - ResNet-50
  - EfficientNet-B0
  - EfficientNet-B4

The best-performing model was integrated into this web application for inference.

⚠️ Due to size constraints, the dataset is not included in this repository.
## 📥 Dataset Download & Setup

This project uses the **HAM10000** dataset.

The dataset is publicly available and must be downloaded separately due to size limitations.

### 🔗 Download Links

You can download the dataset from:

- Kaggle: https://www.kaggle.com/datasets/kmader/skin-cancer-mnist-ham10000
- ISIC Archive: https://www.isic-archive.com/

---

## 🌐 Web Application Features

- User registration and login system
- Secure authentication
- Image upload functionality
- Real-time prediction output
- Research disclaimer confirmation
- Clean and minimal user interface

---

## 🛠️ Technology Stack

### Backend
- Node.js
- Express.js
- SQLite (for authentication database)
- Multer (for image uploads)

### Frontend
- HTML
- CSS
- JavaScript (Vanilla)

### Machine Learning
- Python
- TensorFlow / Keras
- Transfer learning

---

## 🚀 Installation & Setup

### 1️⃣ Clone the repository
git clone https://github.com/hanabejaoui/Deep-Learning-Skin-Cancer-Detection.git

cd Web-application
### 2️⃣ Install dependencies
npm install
### 3️⃣ Start the server
node server.js
### 4️⃣ Open in browser
http://localhost:3000

---

## ⚠️ Disclaimer

This application does NOT provide medical diagnosis.  
It is intended strictly for research and educational purposes.

Always consult a qualified healthcare professional for medical advice.

---

## 🎓 Academic Context

This project was developed as part of a Master's thesis focused on:

> Development of a Web-Based Application for Skin Cancer Detection Using Deep Learning

The work explores the integration of deep learning models into real-world web deployment scenarios.

---

## 📬 Author

Hana Bejaoui  
Master’s Student – Artificial Intelligence & Computer Science  
2026
