import React, { useState } from 'react';
import {
  Button, Typography, CircularProgress, Box, Paper, Grid, Card, CardContent, CardActions, Divider,
  Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemText
} from '@mui/material';
import { CloudUpload as CloudUploadIcon, Delete as DeleteIcon } from '@mui/icons-material';

const AddPluginPage = () => {
  const [pluginFile, setPluginFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false); // To handle the dialog visibility
  const [selectedPlugin, setSelectedPlugin] = useState(null); // To store the selected plugin
  const [activePlugins, setActivePlugins] = useState([]); // To store the list of active plugins

  // Dummy data for available plugins to start
  const availablePlugins = [
    { name: 'xspex', version: '0.1.1' },
    { name: 'xtract', version: '0.1.5' },
    { name: 'pluginZ', version: '0.2.0' },
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPluginFile(file);
    setErrorMessage(''); // Reset error message on file change
  };

  const handleFileRemove = () => {
    setPluginFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pluginFile) {
      setErrorMessage('Please select a plugin file.');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('plugin', pluginFile);

    try {
      const response = await fetch('/api/upload-plugin', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setErrorMessage('');
        alert('Plugin uploaded successfully!');
      } else {
        setErrorMessage('Failed to upload plugin. Please try again.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while uploading the plugin.');
      console.error('Error uploading plugin:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartPlugin = () => {
    setDialogOpen(true); // Open the dialog when the "Start Plugin" button is clicked
  };

  const handleSelectPlugin = (plugin) => {
    setSelectedPlugin(plugin); // Store the selected plugin
    setDialogOpen(false); // Close the dialog

    // Add the selected plugin to the active plugins list
    setActivePlugins((prevPlugins) => [...prevPlugins, plugin]);

    alert(`Starting plugin: ${plugin.name}, Version: ${plugin.version}`); // Example action after selection
  };

  const handleDeactivatePlugin = (pluginToRemove) => {
    setActivePlugins((prevPlugins) =>
      prevPlugins.filter(
        (plugin) => plugin.name !== pluginToRemove.name || plugin.version !== pluginToRemove.version
      )
    );
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f4f6f9',
        height: '94%',
      }}
    >
      <Paper
        elevation={4}
        sx={{
          padding: 4,
          borderRadius: 2,
          background: 'linear-gradient(145deg, #d1d1d1, #f9f9f9, #b5b5b5)',
          width: '100%',
          maxWidth: '95%',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
          Add Plugin
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Drag & drop a plugin file below, or click to select a file manually.
        </Typography>

        {/* Drag-and-drop area */}
        <Box
          sx={{
            border: '2px dashed #1976d2',
            borderRadius: 2,
            padding: 3,
            textAlign: 'center',
            marginBottom: 2,
            background: 'linear-gradient(145deg, #d1d1d1, #f9f9f9, #b5b5b5)',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: '#e3f2fd',
            },
          }}
        >
          <input
            type="file"
            accept=".zip,.tar.gz,.plugin"
            onChange={handleFileChange}
            style={{
              display: 'none',
            }}
            id="upload-file"
          />
          <label htmlFor="upload-file" style={{ cursor: 'pointer' }}>
            {pluginFile ? (
              <Typography variant="h6" sx={{ color: '#333' }}>
                {pluginFile.name}
              </Typography>
            ) : (
              <>
                <CloudUploadIcon sx={{ fontSize: 48, color: '#1976d2', marginBottom: 1 }} />
                <Typography variant="body2" sx={{ color: '#1976d2' }}>
                  Drag & Drop or Click to Upload
                </Typography>
              </>
            )}
          </label>
        </Box>

        {pluginFile && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 2,
            }}
          >
            <Typography variant="body2">{pluginFile.name}</Typography>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleFileRemove}
              size="small"
            >
              Remove
            </Button>
          </Box>
        )}

        {errorMessage && (
          <Typography
            color="error"
            variant="body2"
            sx={{
              marginBottom: 2,
              padding: '8px',
              backgroundColor: '#ffe6e6',
              borderRadius: 2,
              textAlign: 'center',
            }}
          >
            {errorMessage}
          </Typography>
        )}

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 2,
          }}
        >
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
            disabled={loading}
            sx={{
              width: '48%',
              padding: '12px 0',
              textTransform: 'none',
              fontWeight: 'bold',
              borderRadius: 2,
              background: loading
                ? 'linear-gradient(145deg, #e6e6e6, #ffffff, #d4d4d4)'
                : 'linear-gradient(145deg, #cfcfcf, #f8f8f8, #b8b8b8)',
              boxShadow: loading
                ? 'inset 2px 2px 5px #cccccc, inset -2px -2px 5px #ffffff, 0 0 5px 2px rgb(160, 160, 160)'
                : '2px 2px 8px rgba(255, 255, 255, 0.8), -2px -2px 8px rgba(0, 0, 0, 0.1), 0 0 6px 3px rgb(187, 187, 187)',
              color: loading ? '#aaaaaa' : '#333333',
              '&:hover': {
                background: 'linear-gradient(145deg, #d4d4d4, #ffffff, #c2c2c2)',
                boxShadow: '2px 2px 10px rgba(255, 255, 255, 0.9), -2px -2px 10px rgba(0, 0, 0, 0.2), 0 0 8px 3pxrgb(128, 128, 128)',
                transform: 'scale(1.02)',
              },
              '&:active': {
                background: 'linear-gradient(145deg, #bababa, #e8e8e8, #a8a8a8)',
                boxShadow: 'inset 3px 3px 6px #bbbbbb, inset -3px -3px 6px #ffffff, 0 0 4px 2pxrgb(85, 85, 85)',
              },
            }}
            onClick={handleSubmit}
          >
            {loading ? 'Uploading...' : 'Upload Plugin'}
          </Button>

          {/* Start Button */}
          <Button
            variant="contained"
            color="secondary"
            sx={{
              width: '48%',
              padding: '12px 0',
              textTransform: 'none',
              fontWeight: 'bold',
              borderRadius: 2,
              background: 'linear-gradient(145deg, #1976d2, #42a5f5, #1e88e5)',
              boxShadow: '2px 2px 8px rgba(255, 255, 255, 0.8), -2px -2px 8px rgba(0, 0, 0, 0.1), 0 0 6px 3px rgb(187, 187, 187)',
              color: '#fff',
              '&:hover': {
                background: 'linear-gradient(145deg, #1565c0, #1e88e5, #1976d2)',
                boxShadow: '2px 2px 10px rgba(255, 255, 255, 0.9), -2px -2px 10px rgba(0, 0, 0, 0.2), 0 0 8px 3pxrgb(128, 128, 128)',
                transform: 'scale(1.02)',
              },
            }}
            onClick={handleStartPlugin} // Open dialog
          >
            Start Plugin
          </Button>
        </Box>
      </Paper>

      {/* Active Plugins Section */}
      <Box sx={{ marginTop: 3, width: '100%', maxWidth: 600 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
          Active Plugins
        </Typography>
        <Grid container spacing={4}>
          {activePlugins.map((plugin, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Card sx={{ borderRadius: 2, boxShadow: 3, background: 'linear-gradient(145deg, #d1d1d1, #f9f9f9, #b5b5b5)' }}>
                <CardContent>
                  <Typography variant="h6">{plugin.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Version: {plugin.version}
                  </Typography>
                </CardContent>
                <Divider />
                <CardActions sx={{ justifyContent: 'space-between' }}>
                  <Button size="small" color="primary">
                    View Details
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeactivatePlugin(plugin)} // Remove the plugin from active list
                  >
                    Deactivate
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Dialog to select a plugin */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Select a Plugin to Start</DialogTitle>
        <DialogContent>
          <List>
            {availablePlugins.map((plugin, index) => (
              <ListItem button key={index} onClick={() => handleSelectPlugin(plugin)}>
                <ListItemText primary={`${plugin.name} - Version ${plugin.version}`} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddPluginPage;
