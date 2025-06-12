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
  const [hoveredBox, setHoveredBox] = useState(null);

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
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "24px",
          padding: "32px",
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          minHeight: '100vh',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.05) 0%, transparent 50%)',
            pointerEvents: 'none',
          }
        }}
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <Box
            key={index}
            onMouseEnter={() => setHoveredBox(index)}
            onMouseLeave={() => setHoveredBox(null)}
            sx={{
              height: '450px',
              background: boxPlugins[index] 
                ? 'rgba(255, 255, 255, 0.25)' 
                : 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${hoveredBox === index ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.2)'}`,
              boxShadow: hoveredBox === index 
                ? '0 20px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)' 
                : '0 8px 32px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: hoveredBox === index ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                transition: 'left 0.5s',
              },
              '&:hover::before': {
                left: '100%',
              },
            }}
            onClick={() => handleBoxClick(index)}
          >
            {boxPlugins[index] ? (
              <Paper
              elevation={0}
              style={{
                width: '100%',
                height: '100%',
                padding: '0',
                borderRadius: '20px',
                overflow: 'hidden',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem 1.5rem',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                  cursor: 'default',
                  backdropFilter: 'blur(10px)',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <h2 style={{ 
                  margin: 0, 
                  fontSize: '1.2rem', 
                  fontWeight: 700, 
                  color: '#2d3748',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  {pluginNames[index]}
                </h2>
            
                <CachedIcon
                  onClick={handleRefreshClick}
                  style={{
                    cursor: 'pointer',
                    color: '#667eea',
                    fontSize: '1.5rem',
                    transition: 'all 0.3s ease',
                    padding: '8px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.2)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'rotate(180deg) scale(1.1)';
                    e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'rotate(0deg) scale(1)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  }}
                />
              </div>
            
              {/* Plugin Component Container */}
              <div
                id={`pluginComponent-container-${index}`}
                style={{
                  width: '100%',
                  height: 'calc(100% - 72px)', // account for header height
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  padding: '1.5rem',
                  boxSizing: 'border-box',
                }}
              ></div>
            </Paper>
            
            ) : (
              <>
                <IconButton
                  sx={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 100%)',
                    color: '#fff',
                    border: '2px dashed rgba(255, 255, 255, 0.4)',
                    borderRadius: '50%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.2) 100%)',
                      transform: 'scale(1.1)',
                      borderColor: 'rgba(255, 255, 255, 0.6)',
                    },
                    marginBottom: '20px',
                  }}
                >
                  <AddCircleOutlineIcon sx={{ fontSize: 48, color: 'rgba(255, 255, 255, 0.8)' }} />
                </IconButton>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontWeight: 600,
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    marginBottom: '8px',
                  }}
                >
                  Plugin Box {index + 1}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.9rem',
                    textAlign: 'center',
                    maxWidth: '200px',
                  }}
                >
                  Click to add a plugin to this container
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
      <Dialog 
        open={open} 
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: '20px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            minWidth: '400px',
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontSize: '1.5rem',
            fontWeight: 700,
            textAlign: 'center',
            pb: 2,
          }}
        >
          Select a Plugin
        </DialogTitle>
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
