import { Button, Paper, Typography } from "@mui/material";
import axios from "axios";
import React from "react";
import {
  downloadLicense,
  uploadLicenseZip,
} from "../../functions/API Calls/database_calls";
import { useSelector } from "react-redux";

const License = () => {
  const licenseAcquired = useSelector((state) => state.about.license);

  const handleDownload = async () => {
    if (licenseAcquired) return;

    try {
      downloadLicense()
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "license.txt");
          document.body.appendChild(link);
          link.click();
          link.remove();
        })
        .catch((err) => {
          console.log("download file failed", err);
        });
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  const handleUpload = async (e) => {
    if (licenseAcquired) return;

    const file = e.target.files?.[0];
    if (!file) return;

    try {
      uploadLicenseZip(file)
        .then((res) => {
          console.log("file upload successful", res);
          alert("Upload successful");
        })
        .catch((err) => {
          console.log("file upload failed", err);
          alert("Upload failed");
        });
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed");
    }
  };
  return (
    <div
      style={{
        height: "94vh",
        backgroundColor: "#2B2A25",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center",
      }}
    >
      <Paper
        style={{
          height: "45%",
          width: "50%",
          padding: 16,
          backgroundColor: "#0F0F0E",
          color: "white",
        }}
      >
        <Typography>Get the license file</Typography>
        <Button
          variant="outlined"
          onClick={handleDownload}
          style={{ marginTop: 10 }}
        >
          Download
        </Button>
      </Paper>
      <Paper
        style={{
          height: "45%",
          width: "50%",
          padding: 16,
          backgroundColor: "#0F0F0E",
          color: "white",
        }}
      >
        <Typography>Upload the License</Typography>
        <input
          type="file"
          accept=".zip"
          onChange={handleUpload}
          style={{ marginTop: 10 }}
        />
      </Paper>
    </div>
  );
};

export default License;
