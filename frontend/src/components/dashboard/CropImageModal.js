"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";

async function getCroppedImg(imageSrc, pixelCrop, filename = "photo.jpg") {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width  = pixelCrop.width;
      canvas.height = pixelCrop.height;
      canvas
        .getContext("2d")
        .drawImage(img, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);
      canvas.toBlob(
        (blob) => {
          if (!blob) { reject(new Error("Canvas is empty")); return; }
          resolve(new File([blob], filename, { type: "image/jpeg" }));
        },
        "image/jpeg",
        0.92,
      );
    };
    img.onerror = reject;
    img.src = imageSrc;
  });
}

export default function CropImageModal({ imageSrc, aspect = 1, title = "Crop Photo", filename, onApply, onCancel }) {
  const [crop,              setCrop]              = useState({ x: 0, y: 0 });
  const [zoom,              setZoom]              = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [applying,          setApplying]          = useState(false);

  const onCropComplete = useCallback((_, pixels) => {
    setCroppedAreaPixels(pixels);
  }, []);

  async function handleApply() {
    if (!croppedAreaPixels) return;
    setApplying(true);
    try {
      const file = await getCroppedImg(imageSrc, croppedAreaPixels, filename);
      onApply(file);
    } catch {
      setApplying(false);
    }
  }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
      <div style={{ width: "90%", maxWidth: 420, background: "#fff", borderRadius: 20, overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 8px 40px rgba(0,0,0,0.28)" }}>

        {/* Header */}
        <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #f0f0f0" }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: "#111", margin: 0 }}>{title}</p>
          <button
            type="button"
            onClick={onCancel}
            style={{ fontSize: 22, lineHeight: 1, color: "#888", background: "none", border: "none", cursor: "pointer", padding: "0 4px" }}
          >
            ×
          </button>
        </div>

        {/* Crop area */}
        <div style={{ position: "relative", height: 280, background: "#222" }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            style={{
              containerStyle: { background: "#222" },
              cropAreaStyle:  { border: "2px solid #28DC4F", boxShadow: "0 0 0 9999px rgba(0,0,0,0.5)" },
            }}
          />
        </div>

        {/* Zoom slider */}
        <div style={{ padding: "14px 24px 6px", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: "#aaa", fontSize: 20, lineHeight: 1, userSelect: "none" }}>−</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            style={{ flex: 1, accentColor: "#28DC4F" }}
          />
          <span style={{ color: "#aaa", fontSize: 20, lineHeight: 1, userSelect: "none" }}>+</span>
        </div>

        {/* Action buttons */}
        <div style={{ padding: "12px 20px 20px", display: "flex", gap: 10 }}>
          <button
            type="button"
            onClick={onCancel}
            style={{ flex: 1, padding: "11px 0", borderRadius: 12, border: "1.5px solid #e0e0e0", background: "#fff", fontSize: 14, fontWeight: 600, color: "#555", cursor: "pointer" }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={applying}
            style={{ flex: 1, padding: "11px 0", borderRadius: 12, border: "none", background: applying ? "#a0e8b0" : "#28DC4F", fontSize: 14, fontWeight: 700, color: "#fff", cursor: applying ? "not-allowed" : "pointer" }}
          >
            {applying ? "Applying…" : "Apply Crop"}
          </button>
        </div>

      </div>
    </div>
  );
}
