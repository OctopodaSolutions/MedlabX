import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemButton,
  Paper,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { store } from "../../store/fallbackStore";
import { setBoxPlugins, setPluginNames } from "../../store/dashboardSlice";
import CachedIcon from "@mui/icons-material/Cached";
import ClearIcon from '@mui/icons-material/Clear';
import ScienceIcon from "@mui/icons-material/Science";
import AnalyticsIcon from "@mui/icons-material/Analytics";

const GridComponent = () => {
  const dispatch = useDispatch();

  const plugins = useSelector((state) => state.plugin.plugins);
  const boxPlugins = useSelector((state) => state.dashboard.boxPlugins);
  const pluginNames = useSelector((state) => state.dashboard.pluginNames);

  const [open, setOpen] = useState(false);
  const [selectedBox, setSelectedBox] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [hoveredBox, setHoveredBox] = useState(null);

  // Helper function to load a plugin component
  const loadPluginComponent = (component, store) => {
    try {
      const pluginRoot = document.getElementById(
        `pluginComponent-container-${component.boxId}`,
      );
      if (pluginRoot) {
        window.pluginComponents[component.pluginType](
          pluginRoot,
          { pluginId: component.instanceId },
          store,
        );
      } else {
        console.log(`Plugin container not found for boxId: ${component.boxId}`);
      }
    } catch (err) {
      console.log("Error loading plugin component:", err);
    }
  };

  // Load plugin components on mount and refresh
  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log("Components available", plugins);
      boxPlugins.forEach(
        (component) => component && loadPluginComponent(component, store),
      );
    }, 500);

    return () => clearTimeout(timeout);
  }, [refreshTrigger]);

  // Add newly selected plugin component
  useEffect(() => {
    if (!selectedBox) return;

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const loadComponentsWithDelay = async () => {
      await delay(500);
      console.log("Components available", plugins);
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
    updatedPluginNames[selectedBox] = plugin.instanceId;
    dispatch(setPluginNames(updatedPluginNames));

    setOpen(false);
  };

  // Handle clearing the selected box's plugin
  const handleClearBox = () => {
    const updatedPlugins = [...boxPlugins];
    updatedPlugins[selectedBox] = null;
    dispatch(setBoxPlugins(updatedPlugins));

    const updatedPluginNames = [...pluginNames];
    updatedPluginNames[selectedBox] = "";
    dispatch(setPluginNames(updatedPluginNames));

    setOpen(false);
  };

  // Refresh functionality
  const handleRefreshClick = () => {
    setRefreshTrigger(!refreshTrigger);
    console.log("Refreshing plugins", refreshTrigger);
  };

  console.log("Box plugins state:", boxPlugins);

  return (
    <>
      {/* Header Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
          borderBottom: "1px solid #404040",
          padding: "24px 32px",
          marginBottom: "0",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Box
              sx={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #4a5568 0%, #718096 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
              }}
            >
              <AnalyticsIcon sx={{ fontSize: 28, color: "#ffffff" }} />
            </Box>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: "#f7fafc",
                  fontFamily: '"Inter", "Roboto", sans-serif',
                  letterSpacing: "-0.02em",
                  mb: 1,
                }}
              >
                Dashboard
              </Typography>
            </Box>
          </Box>

          <Card
            elevation={0}
            sx={{
              background: "rgba(45, 45, 45, 0.8)",
              border: "1px solid #404040",
              borderRadius: "12px",
              padding: "12px 20px",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "#a0aec0",
                fontWeight: 600,
                fontSize: "0.875rem",
              }}
            >
              {boxPlugins.filter((plugin) => plugin !== null).length} / 6
              Modules Active
            </Typography>
          </Card>
        </Box>
      </Box>

      {/* Main Grid Container */}
      <Box
        sx={{
          flexGrow: 1,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
          gap: "32px",
          padding: "32px",
          background: "#1a1a1a",
          minHeight: "calc(100vh - 140px)",
          position: "relative",
        }}
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <Card
            key={index}
            elevation={0}
            onMouseEnter={() => setHoveredBox(index)}
            onMouseLeave={() => setHoveredBox(null)}
            sx={{
              height: "480px",
              background: boxPlugins[index]
                ? "linear-gradient(135deg, #2d2d2d 0%, #363636 100%)"
                : "linear-gradient(135deg, #2d2d2d 0%, #333333 100%)",
              border: `1px solid ${hoveredBox === index ? "#718096" : boxPlugins[index] ? "#404040" : "#333333"}`,
              borderRadius: "16px",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              transform:
                hoveredBox === index ? "translateY(-4px)" : "translateY(0)",
              boxShadow:
                hoveredBox === index
                  ? "0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2)"
                  : boxPlugins[index]
                    ? "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.15)"
                    : "0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 2px 0 rgba(0, 0, 0, 0.1)",
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
            }}
            onClick={() => handleBoxClick(index)}
          >
            {boxPlugins[index] ? (
              <>
                {/* Plugin Header */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "20px 24px",
                    background:
                      "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
                    borderBottom: "1px solid #404040",
                    cursor: "default",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: "#f7fafc",
                      fontSize: "1.125rem",
                      fontFamily: '"Inter", "Roboto", sans-serif',
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <ScienceIcon sx={{ fontSize: 22, color: "#718096" }} />
                    {pluginNames[index]}
                  </Typography>

                  <Box sx={{ display:'flex', gap:1}}>

                    <Box
                      onClick={handleRefreshClick}
                      sx={{
                        cursor: "pointer",
                        padding: "8px",
                        borderRadius: "8px",
                        background: "rgba(113, 128, 150, 0.15)",
                        border: "1px solid rgba(113, 128, 150, 0.3)",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          background: "rgba(113, 128, 150, 0.25)",
                          transform: "rotate(180deg)",
                        },
                      }}
                    >
                      <CachedIcon sx={{ fontSize: 20, color: "#718096" }} />
                    </Box>

                    <Box
                      onClick={() => handleBoxClick(index)}
                      sx={{
                        cursor: "pointer",
                        padding: "8px",
                        borderRadius: "8px",
                        background: "rgba(113, 128, 150, 0.15)",
                        border: "1px solid rgba(113, 128, 150, 0.3)",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          background: "rgba(113, 128, 150, 0.25)",
                          transform: "rotate(180deg)",
                        },
                      }}
                    >
                      <ClearIcon sx={{ fontSize: 20, color: "#718096" }} />
                    </Box>
                  </Box>

                </Box>

                {/* Plugin Content Container */}
                <Box
                  id={`pluginComponent-container-${index}`}
                  sx={{
                    width: "100%",
                    height: "calc(100% - 81px)",
                    backgroundColor: "#2d2d2d",
                    padding: "24px",
                    boxSizing: "border-box",
                    overflow: "hidden",
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
              </>
            ) : (
              <CardContent
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  padding: "48px 24px",
                }}
              >
                <Box
                  sx={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "16px",
                    background:
                      "linear-gradient(135deg, rgba(113, 128, 150, 0.1) 0%, rgba(160, 174, 192, 0.1) 100%)",
                    border: "2px dashed #4a5568",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "24px",
                    transition: "all 0.3s ease",
                  }}
                >
                  <AddCircleOutlineIcon
                    sx={{ fontSize: 36, color: "#a0aec0" }}
                  />
                </Box>

                <Typography
                  variant="h6"
                  sx={{
                    color: "#f7fafc",
                    fontWeight: 600,
                    marginBottom: "8px",
                    fontFamily: '"Inter", "Roboto", sans-serif',
                  }}
                >
                  Module Slot {index + 1}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "#a0aec0",
                    fontSize: "0.875rem",
                    lineHeight: 1.5,
                    maxWidth: "280px",
                  }}
                >
                  Click to configure and add a analysis module to
                  this workspace
                </Typography>

                <Box
                  sx={{
                    width: "100%",
                    height: "2px",
                    background:
                      "linear-gradient(90deg, transparent 0%, #404040 50%, transparent 100%)",
                    marginTop: "24px",
                  }}
                />
              </CardContent>
            )}
          </Card>
        ))}
      </Box>

      {/* Plugin Selection Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            background: "#2d2d2d",
            border: "1px solid #404040",
            minWidth: "480px",
            maxWidth: "600px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: "1.5rem",
            fontWeight: 700,
            textAlign: "center",
            color: "#f7fafc",
            fontFamily: '"Inter", "Roboto", sans-serif',
            padding: "24px 24px 16px",
            borderBottom: "1px solid #404040",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
          }}
        >
          <ScienceIcon sx={{ fontSize: 28, color: "#718096" }} />
          Configure Module
        </DialogTitle>
        <DialogContent sx={{ padding: "24px" }}>
          {!boxPlugins[selectedBox] ? (
            <List sx={{ padding: 0 }}>
              {plugins.length > 0 &&
                [...plugins]
                  .sort((a, b) => a.instanceId.localeCompare(b.instanceId))
                  .map((plugin, idx) => (
                    <ListItem
                      key={idx}
                      disablePadding
                      sx={{ marginBottom: "8px" }}
                    >
                      <ListItemButton
                        onClick={() => handlePluginSelect(plugin)}
                        sx={{
                          borderRadius: "12px",
                          border: "1px solid #404040",
                          padding: "16px 20px",
                          background:
                            "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            background:
                              "linear-gradient(135deg, #333333 0%, #404040 100%)",
                            borderColor: "#718096",
                            transform: "translateY(-2px)",
                            boxShadow: "0 4px 12px rgba(113, 128, 150, 0.3)",
                          },
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 600,
                            color: "#f7fafc",
                            fontSize: "1rem",
                            fontFamily: '"Inter", "Roboto", sans-serif',
                          }}
                        >
                          {plugin.instanceId}
                        </Typography>
                      </ListItemButton>
                    </ListItem>
                  ))}
            </List>
          ) : (
            <Box sx={{ textAlign: "center", padding: "24px 0" }}>
              <Typography
                variant="body1"
                sx={{
                  color: "#a0aec0",
                  marginBottom: "24px",
                  fontSize: "1rem",
                }}
              >
                This module slot is currently configured. Would you like to
                clear it?
              </Typography>
              <Button
                onClick={handleClearBox}
                variant="outlined"
                sx={{
                  borderRadius: "8px",
                  borderColor: "#dc2626",
                  color: "#dc2626",
                  fontWeight: 600,
                  padding: "12px 24px",
                  textTransform: "none",
                  "&:hover": {
                    background: "#dc2626",
                    color: "#ffffff",
                    borderColor: "#dc2626",
                  },
                }}
              >
                Clear Module Configuration
              </Button>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GridComponent;
