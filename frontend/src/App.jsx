import React, { useState, useRef } from "react";
import "./App.css";

function App() {
  const [imagePreview, setImagePreview] = useState(null);
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [palette, setPalette] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [copied, setCopied] = useState(null);
  const [primary, setPrimary] = useState(null);
  const [secondary, setSecondary] = useState(null);
  const [accent, setAccent] = useState(null);
  const [pickerType, setPickerType] = useState(null);

  const fileInputRef = useRef();

  const handleFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      setImagePreview(URL.createObjectURL(file));
      setFile(file);
      setSelectedColor(null);
    }
  };

  const handleFileChange = (e) => handleFile(e.target.files[0]);
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) return alert("Upload an image first.");
    const formData = new FormData();
    formData.append("image", file);
    try {
      const URL = "https://image-to-color-palette.vercel.app/"  // use localhost for testing 
      const res = await fetch(`${URL}generate-palette`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setPalette(data.palette || []);
    } catch (err) {
      console.error(err);
      alert("Palette generation failed.");
    }
  };

  const RGBtoHEX = (rgb) => {
    const [r, g, b] = rgb.match(/\d+/g).map(Number);
    return (
      "#" +
      [r, g, b]
        .map((c) => c.toString(16).padStart(2, "0"))
        .join("")
        .toUpperCase()
    );
  };

  const RGBtoHSL = (rgb) => {
    let [r, g, b] = rgb.match(/\d+/g).map(Number);
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h = 0,
      s = 0,
      l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = d / (1 - Math.abs(2 * l - 1));
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h *= 60;
    }
    return `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(
      l * 100
    )}%)`;
  };

  const RGBtoCMYK = (rgb) => {
    let [r, g, b] = rgb.match(/\d+/g).map(Number);
    r /= 255;
    g /= 255;
    b /= 255;
    let k = 1 - Math.max(r, g, b);
    let c = (1 - r - k) / (1 - k) || 0;
    let m = (1 - g - k) / (1 - k) || 0;
    let y = (1 - b - k) / (1 - k) || 0;
    return `cmyk(${Math.round(c * 100)}, ${Math.round(m * 100)}, ${Math.round(
      y * 100
    )}, ${Math.round(k * 100)})`;
  };

  const generateShades = (rgb) => {
    const [r, g, b] = rgb.match(/\d+/g).map(Number);
    let shades = [];
    for (let i = 1; i <= 5; i++) {
      let factor = i * 0.15;
      let newR = Math.min(255, r + (255 - r) * factor);
      let newG = Math.min(255, g + (255 - g) * factor);
      let newB = Math.min(255, b + (255 - b) * factor);
      shades.push(
        `rgb(${Math.round(newR)}, ${Math.round(newG)}, ${Math.round(newB)})`
      );
    }
    return shades;
  };

  const exportPalette = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const size = 100;
    const cols = 4;
    canvas.width = cols * size;
    canvas.height = Math.ceil(palette.length / cols) * size;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    palette.forEach((color, i) => {
      const x = (i % cols) * size;
      const y = Math.floor(i / cols) * size;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, size, size);
      ctx.fillStyle = "#000";
      ctx.font = "12px Arial";
      ctx.fillText(RGBtoHEX(color), x + 5, y + 15);
    });
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "palette.png";
      a.click();
    });
  };

  return (
    <div className="main-wrapper">
      <div className="upload-card">
        <h1>Color Palette Generator</h1>
        <p className="tagline">
          Upload or drop an image to generate a stunning color palette
        </p>

        <div
          className={`upload-label drop-area ${
            dragActive ? "drag-active" : ""
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            hidden
            ref={fileInputRef}
          />
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" className="image-preview" />
          ) : (
            <div className="placeholder">
              <p>Click or drag & drop an image here</p>
            </div>
          )}
        </div>

        {imagePreview && (
          <>
            <p className="subtext">
              Image ready. Click below to generate palette.
            </p>
            <button className="submit-btn" onClick={handleSubmit}>
              Generate Palette
            </button>
          </>
        )}

        {palette.length > 0 && (
          <div className="palette-section">
            <div className="palette-column">
              {imagePreview && <img src={imagePreview} alt="Uploaded" />}
            </div>

            <div className="palette-column">
              <div className="palette-grid">
                {palette.map((color, idx) => (
                  <div
                    key={idx}
                    className="palette-color"
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                  >
                    <span>{RGBtoHEX(color)}</span>
                  </div>
                ))}
              </div>
              <button className="export-btn" onClick={exportPalette}>
                Export palette
              </button>
            </div>

            <div className="palette-column">
              {selectedColor ? (
                <div className="color-details">
                  <h3>{selectedColor}</h3>
                  <p>
                    HEX: {RGBtoHEX(selectedColor)}{" "}
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(RGBtoHEX(selectedColor));
                        setCopied("hex");
                        setTimeout(() => setCopied(null), 1500);
                      }}
                    >
                      {copied === "hex" ? "✅" : "🔗"}
                    </button>
                  </p>
                  <p>
                    RGB: {selectedColor}{" "}
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(selectedColor);
                        setCopied("rgb");
                        setTimeout(() => setCopied(null), 1500);
                      }}
                    >
                      {copied === "rgb" ? "✅" : "🔗"}
                    </button>
                  </p>
                  <p>
                    HSL: {RGBtoHSL(selectedColor)}{" "}
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(RGBtoHSL(selectedColor));
                        setCopied("hsl");
                        setTimeout(() => setCopied(null), 1500);
                      }}
                    >
                      {copied === "hsl" ? "✅" : "🔗"}
                    </button>
                  </p>
                  <p>
                    CMYK: {RGBtoCMYK(selectedColor)}{" "}
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(RGBtoCMYK(selectedColor));
                        setCopied("cmyk");
                        setTimeout(() => setCopied(null), 1500);
                      }}
                    >
                      {copied === "cmyk" ? "✅" : "🔗"}
                    </button>
                  </p>
                  <div className="shades">
                    {generateShades(selectedColor).map((shade, i) => (
                      <div
                        key={i}
                        className="shade"
                        style={{ background: shade }}
                        title={RGBtoHEX(shade)}
                        onClick={() => {
                          navigator.clipboard.writeText(shade);
                          setSelectedColor(shade);
                          setCopied("shade-" + i);
                          setTimeout(() => setCopied(null), 1500);
                        }}
                      >
                        {copied === "shade-" + i && (
                          <span className="copied-indicator">✅</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div
                  className="color-details"
                  style={{
                    background: "#fbd08888",
                    padding: "1rem",
                    borderRadius: "8px",
                  }}
                >
                  <p>Select color from palette to appear here</p>
                </div>
              )}
            </div>
          </div>
        )}

        {palette.length > 0 && (
          <div className="mock-ui-builder">
            <h3 style={{ textAlign: "left", marginBottom: "0.5rem" }}>
              🎨 Mock UI Card Builder
            </h3>

            <div className="selectors">
              <button onClick={() => setPickerType("primary")}>
                Pick Primary
              </button>
              <button onClick={() => setPickerType("secondary")}>
                Pick Secondary
              </button>
              <button onClick={() => setPickerType("accent")}>
                Pick Accent
              </button>
            </div>

            {primary && secondary && accent && (
              <div className="mock-card">
                <div
                  className="mock-card-header"
                  style={{ backgroundColor: primary }}
                />

                <div className="mock-avatar-wrapper">
                  <img
                    src="https://randomuser.me/api/portraits/men/4.jpg"
                    alt="Profile"
                    className="mock-avatar"
                    style={{ borderColor: primary }}
                  />
                </div>

                <div className="mock-card-body" style={{ color: secondary }}>
                  <h2 style={{ marginBottom: 4 }}>Alan Wick</h2>
                  <p className="role" style={{ color: accent }}>
                    Front-end Developer
                  </p>
                  <p
                    style={{
                      color: "#333",
                      fontSize: "0.9rem",
                      margin: "1rem 0",
                    }}
                  >
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quod alias ut.
                  </p>
                  <button
                    className="mock-btn"
                    style={{
                      backgroundColor: accent,
                      color: primary,
                    }}
                  >
                    View Profile
                  </button>
                </div>

                <div className="mock-colors-labels">
                  <p>
                    <strong>Primary:</strong> {RGBtoHEX(primary)}
                  </p>
                  <p>
                    <strong>Secondary:</strong> {RGBtoHEX(secondary)}
                  </p>
                  <p>
                    <strong>Accent:</strong> {RGBtoHEX(accent)}
                  </p>
                </div>
              </div>
            )}

            {pickerType && (
              <div className="color-picker-modal">
                <div
                  className="color-picker-backdrop"
                  onClick={() => setPickerType(null)}
                />
                <div className="color-picker-content">
                  <h4>Select {pickerType} Color</h4>
                  <div className="color-picker-grid">
                    {palette.map((color, i) => (
                      <div
                        key={i}
                        className="picker-color"
                        style={{ backgroundColor: color }}
                        title={RGBtoHEX(color)}
                        onClick={() => {
                          if (pickerType === "primary") setPrimary(color);
                          if (pickerType === "secondary") setSecondary(color);
                          if (pickerType === "accent") setAccent(color);
                          setPickerType(null);
                        }}
                      >
                        <span>{RGBtoHEX(color)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="info">
          <h2>How It Works</h2>
          <p>
            We extract the top 16 dominant colors from your image using
            intelligent color clustering. Great for branding, design, and
            creative inspiration.
          </p>
        </div>

        <div className="made-with">
          Made with <span style={{ color: "red" }}>❤️</span> by{" "}
          <a
            href="https://github.com/Tanay-Bhatt"
            target="_blank"
            rel="noopener noreferrer"
          >
            Tanay Bhatt
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;
