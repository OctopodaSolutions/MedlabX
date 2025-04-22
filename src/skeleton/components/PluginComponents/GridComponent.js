import React, { useState, useEffect, useRef } from "react";
import { Box, IconButton, Typography, Dialog, DialogTitle, DialogContent, List, ListItem, ListItemButton, Paper, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { store } from "../../store/fallbackStore";
import { setBoxPlugins, setPluginNames } from "../../store/dashboardSlice";
import CachedIcon from '@mui/icons-material/Cached';

const GridComponent = () => {

  const dispatch = useDispatch();

  const plugins = useSelector((state) => state.plugin.plugins);
  const boxPlugins = useSelector((state) => state.dashboard.boxPlugins);
  const pluginNames = useSelector((state) => state.dashboard.pluginNames); // Store plugin names



  // State to track selected box and dialog open/close
  const [open, setOpen] = useState(false);
  const [selectedBox, setSelectedBox] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  // Helper function to load a plugin component
  const loadPluginComponent = (component, store) => {
    try {
      const pluginRoot = document.getElementById(`pluginComponent-container-${component.boxId}`);
      if (pluginRoot) {
        window.pluginComponents[component.pluginType](pluginRoot, { pluginId: component.instanceId }, store);
      } else {
        console.log(`Plugin container not found for boxId: ${component.boxId}`);
      }
    } catch (err) {
      console.log('Error loading plugin component:', err);
    }
  };

  // Onload, load the selected plugin components
  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log('Components available', plugins);

      boxPlugins.forEach((component) => component && loadPluginComponent(component, store));
    }, 500); // Delay execution by 1000ms (1 second)

    // Clean up timeout if the component is unmounted
    return () => clearTimeout(timeout);
  }, [refreshTrigger]);

  // Add newly selected plugin component
  useEffect(() => {
    if (!selectedBox) return;

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const loadComponentsWithDelay = async () => {
      await delay(500); // Wait for 1 second
      console.log('Components available', plugins);

      boxPlugins.forEach((component) => loadPluginComponent(component, store));
    };

    loadComponentsWithDelay();
  }, [boxPlugins, refreshTrigger]);


  // Open dialog when a box is clicked
  const handleBoxClick = (index) => {
    console.log(`Box ${index} clicked`);
    setSelectedBox(index);
    setOpen(true);
  };

  // Select a plugin and update the corresponding box
  const handlePluginSelect = (plugin) => {
    const updatedPlugins = [...boxPlugins];
    updatedPlugins[selectedBox] = { ...plugin, boxId: selectedBox };
    dispatch(setBoxPlugins(updatedPlugins));

    const updatedPluginNames = [...pluginNames];
    updatedPluginNames[selectedBox] = plugin.instanceId; // Save the plugin name or instanceId
    dispatch(setPluginNames(updatedPluginNames));

    setOpen(false);
  };

  // Handle clearing the selected box's plugin
  const handleClearBox = () => {
    const updatedPlugins = [...boxPlugins];
    updatedPlugins[selectedBox] = null; // Set the selected box's plugin to null
    dispatch(setBoxPlugins(updatedPlugins));

    const updatedPluginNames = [...pluginNames];
    updatedPluginNames[selectedBox] = ""; // Clear the plugin name
    dispatch(setPluginNames(updatedPluginNames));

    setOpen(false); // Close the dialog
  };

  // Refresh
  const handleRefreshClick = () => {
    setRefreshTrigger(!refreshTrigger);
    console.log('""""""""""""""""""""""""""""""', refreshTrigger);

  };

  console.log('..............box plugin', boxPlugins);



  return (
    <>
      <Box
        sx={{
          flexGrow: 1,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
          gap: "20px",
          padding: "20px",
        }}
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <Box
            key={index}
            sx={{
              height: '450px',
              background: 'linear-gradient(145deg, #d1d1d1, #f9f9f9, #b5b5b5)', // Metallic gradient
              boxShadow: '4px 4px 10px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '4px 8px 16px rgba(0, 0, 0, 0.2)',
              },
            }}
            onClick={() => handleBoxClick(index)}
          >
            {boxPlugins[index] ? (
              <Paper
              elevation={3}
              style={{
                width: '100%',
                height: '100%',
                padding: '0',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem 1rem',
                  background: 'linear-gradient(to right, #eceff1, #f5f5f5)',
                  borderBottom: '1px solid #ddd',
                  cursor: 'default',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: '#333' }}>
                  {pluginNames[index]}
                </h2>
            
                <CachedIcon
                  onClick={handleRefreshClick}
                  style={{
                    cursor: 'pointer',
                    color: '#607d8b',
                    transition: 'transform 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'rotate(90deg)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'rotate(0deg)')}
                />
              </div>
            
              {/* Plugin Component Container */}
              <div
                id={`pluginComponent-container-${index}`}
                style={{
                  width: '100%',
                  height: 'calc(100% - 56px)', // account for header height
                  backgroundColor: '#fff',
                  padding: '1rem',
                  boxSizing: 'border-box',
                }}
              ></div>
            </Paper>
            
            ) : (
              <>
                <IconButton
                  sx={{
                    backgroundColor: 'linear-gradient(145deg, #c0c0c0, #e0e0e0)',
                    color: '#fff',
                    '&:hover': {
                      background: 'linear-gradient(145deg, #a0a0a0, #c0c0c0)',
                    },
                    marginBottom: '10px',
                  }}
                >
                  <AddCircleOutlineIcon sx={{ fontSize: 40 }} />
                </IconButton>
                <Typography variant="h6" sx={{ color: '#4a4a4a' }}>
                  Box {index + 1}
                </Typography>
              </>
            )}
          </Box>
        ))}
      </Box>
      <div id="mca-chart">
        {/* Other JSX */}
      </div>

      

      {/* Dialog for selecting a plugin */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Select a Plugin</DialogTitle>
        <DialogContent>
          {/* Show plugin list only if no plugin is selected */}
          {!boxPlugins[selectedBox] ? (
            <List>
              {plugins.length > 0 && [...plugins] // Create a shallow copy of the plugins array
                .sort((a, b) => a.instanceId.localeCompare(b.instanceId)) // Sorting by instanceId
                .map((plugin, idx) => (
                  <ListItem key={idx} disablePadding>
                    <ListItemButton onClick={() => handlePluginSelect(plugin)}>
                      {plugin.instanceId}
                    </ListItemButton>
                  </ListItem>
                ))}
            </List>
          ) : (
            // Show the "Clear" button if a plugin is active in the selected box
            <Button
              onClick={handleClearBox}
              variant="outlined"
              color="error"
              sx={{ marginTop: 2 }}
            >
              Clear
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GridComponent;
