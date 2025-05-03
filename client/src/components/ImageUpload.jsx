import React, { useState } from "react";
import "./ImageUpload.css";

const ImageUpload = ({ onImageUpload }) => {
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result.split(",")[1];
      onImageUpload(base64Image); // ✅ lift to parent (Home.jsx)
      setPreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="upload-container">
      <div className="upload-box-clean">
        <img
          src="https://cdn-icons-png.flaticon.com/512/1828/1828911.png"
          alt="upload"
          className="upload-icon-clean"
        />

        <label className="upload-btn-clean">
          <input type="file" onChange={handleFileChange} />
          📤 Upload Chart
        </label>

        <p className="upload-hint-clean">Drag and drop your stock chart here</p>
      </div>

      {preview && (
        <div className="upload-preview-box">
          <img src={preview} alt="Preview" className="upload-preview-img" />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
