import React, { useState } from "react";
import axios from "axios";
import './UploadFile.css'; // Assuming you will create a separate CSS file for styling

const UploadFile = () => {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    const uploadedFile = event.dataTransfer.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post("http://localhost:3003/uploadPlugin", formData, {
        headers: {
          "Content-Type": "application/octet-stream", // Sending raw binary data
        },
      });

      console.log(response.data.message);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleRun = async () => {
    try {
      const runResponse = await axios.post("http://localhost:3003/runPlugin");
      console.log(runResponse.data.message);
    } catch (err) {
      console.log("Run failed");
    }
  };

  return (
    <div className="upload-container">
      <h2 className="title">Upload Plugin</h2>
      <p className="subtitle">Drag and drop or click to upload your custom bundle</p>

      <div
        className={`drop-area ${dragging ? "dragging" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById('fileInput').click()} // Trigger file input when clicked
      >
        {!file ? (
          <p>Drag your .js file here or click to browse</p>
        ) : (
          <p>{file.name}</p>
        )}
        <input
          type="file"
          accept=".js"
          onChange={handleFileChange}
          className="file-input"
          id="fileInput"
        />
      </div>

      <div className="button-container">
        <button onClick={handleUpload} className="upload-button">
          Upload Plugin
        </button>
        <button onClick={handleRun} className="run-button">
          Run Plugin
        </button>
      </div>
    </div>
  );
};

export default UploadFile;
