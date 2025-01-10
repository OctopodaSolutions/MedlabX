import React, { useEffect, useState } from "react";
import axios from "axios";
import './UploadFile.css'; // Assuming you will create a separate CSS file for styling
import { store, websocketClient } from "../../store/fallbackStore";
import { combineReducers } from 'redux';

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
      formData.append("zipFile", file);

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

  const [group, setGroup] = useState([])
  const [plugins, setPlugins] = useState([])

  const handleRun = async () => {
    try {
      const runResponse = await axios.post("http://localhost:3003/runPlugin");
      console.log(runResponse.data);
      setGroup(runResponse.data.group)
    } catch (err) {
      console.log("Run failed");
    }
  };

  const injectReducer = (store, key, reducer) => {
    // Combine the existing reducers with the new one
    store.replaceReducer(
      combineReducers({
        ...store.getState(),
        [key]: combineReducers({...reducer})
      })
    );
  };

  useEffect(() => {
    if (group && group.length > 0) {
      // Use Promise.all to handle all imports
      Promise.all(
        group.map((item) => 
          import(item.react)
            .then((module) => ({
              plugin: module.default || module,  // Handle default export
              config: item.config
            }))
            .catch((error) => {
              console.error('Error loading plugin:', error);
              return null; // Return null for failed imports to avoid breaking the promise chain
            })
        )
      ).then((loadedPlugins) => {
        // Filter out any null values in case of failed imports
        const validPlugins = loadedPlugins.filter(plugin => plugin !== null);
        setPlugins(validPlugins);  // Set the state with the successfully loaded plugins
      });
    }
  }, [group]);

  useEffect(()=>{
    if(plugins){
      plugins.map((item,index)=>{
        if(item.plugin.initializePluginUI){
          item.plugin.initializePluginUI(store, item.config.route, `plugin-container-${index}`, injectReducer, websocketClient)
        }
      })
    }
  },[plugins])

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
          accept=".zip"
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

      {group.map((item,index)=>(
        <div id={`plugin-container-${index}`}></div>
      ))}
      
    </div>
  );
};

export default UploadFile;
