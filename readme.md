# 🎨 Image to Color Palette Generator

[![Made with Love](https://img.shields.io/badge/Made%20with-%E2%9D%A4-red)](https://github.com/Tanay-Bhatt) [![Python](https://img.shields.io/badge/Backend-Python%203.8+-blue?logo=python)](https://www.python.org/) [![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61dafb?logo=react)](https://reactjs.org/) [![Live App](https://img.shields.io/badge/Live%20Demo-%F0%9F%9A%80-green?style=flat&logo=vercel)](https://image-to-color-palette.vercel.app/) [![Stars](https://img.shields.io/github/stars/Tanay-Bhatt/Image-to-color-palette?style=social)](https://github.com/Tanay-Bhatt/Image-to-color-palette/stargazers) [![Open Issues](https://img.shields.io/github/issues/Tanay-Bhatt/Image-to-color-palette)](https://github.com/Tanay-Bhatt/Image-to-color-palette/issues) [![License](https://img.shields.io/github/license/Tanay-Bhatt/Image-to-color-palette)](LICENSE) [![Repo Size](https://img.shields.io/github/repo-size/Tanay-Bhatt/Image-to-color-palette)](https://github.com/Tanay-Bhatt/Image-to-color-palette)


Upload any image and instantly extract a stunning 16-color palette using intelligent color clustering. Click any color to view its HEX, RGB, HSL, CMYK values, generate shades, and even build a live mock UI card using your selected theme colors.

Built with **React + Vite** (frontend) and **Flask + Pillow** (backend).

---

## 🌐 Live App

👉 **Live Website**: [https://image-to-color-palette.vercel.app/](https://image-to-color-palette.vercel.app/)  
📺 **Preview Video**: [https://vimeo.com/1086487953](https://vimeo.com/1086487953)

---

## 🌟 Features

- 📷 Drag & Drop or click-to-upload image
- 🎨 Extracts **16 dominant colors** using adaptive clustering
- 🖍 View colors in **HEX, RGB, HSL, and CMYK**
- 🌈 Auto-generate **lighter shade variations**
- 📋 **Copy** any color value with 1 click
- 📤 **Export** full palette as PNG
- 🧱 Build a live **mock Material UI-style card** using selected colors
- 🧑‍💻 Fully responsive and mobile-friendly
- ⚡ Blazing fast with **Vite**, styled with **custom CSS** (Neumorphism + Material)

---

## 📦 Tech Stack

| Frontend                | Backend                |
|-------------------------|------------------------|
| React (Vite)            | Python (Flask)         |
| Custom CSS (Responsive) | Pillow (Image Processing) |
| JavaScript (ES6+)       | Flask-CORS             |

---


## 🔧 Setup Instructions

### 🔹 1. Backend (Flask)

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
flask run
```

### 🔹 2.  Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

## 🧠 How It Works

1. **Flask + Pillow** processes the uploaded image to extract a 16-color adaptive palette.
2. **React** displays the palette and allows:
   - Detailed color inspection
   - Lighter shade generation
   - One-click copy/export
   - Live preview in a mock UI card
3. Palette can be exported as an image, and all actions are instant and interactive.

---

## 🛠 Requirements

- Node.js `18+`
- Python `3.8+`
- Git
- [Render](https://render.com/) – for backend hosting
- [Vercel](https://vercel.com/) – for frontend hosting
- VS Code or Any IDE

