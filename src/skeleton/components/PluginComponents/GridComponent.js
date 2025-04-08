import React, { useState, useEffect, useRef } from "react";
import { Box, IconButton, Typography, Dialog, DialogTitle, DialogContent, List, ListItem, ListItemButton, Paper, Button } from "@mui/material";
import { useSelector } from "react-redux";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { CanvasJSChart } from 'canvasjs-react-charts';
import { height } from "@mui/system";
import Speedometer from 'react-d3-speedometer';

const GridComponent = ({ keyId }) => {
  const plugins = useSelector((state) => state.plugin.plugins);
  const [add, setAdd] = useState(1);
  useEffect(() => {
    console.log('components available', plugins);

    try {
      const pluginRoot = document.getElementById('mca-chart');
      window.pluginComponents.xspecPlugin(pluginRoot, { pluginId: 'xspec1', store, keyId }); // Use keyId here
    } catch (err) {
      console.log('component not found', err);
    }
  }, [plugins, add, keyId]);

  // State to track selected box and dialog open/close
  const [open, setOpen] = useState(false);
  const [selectedBox, setSelectedBox] = useState(null);
  const [boxPlugins, setBoxPlugins] = useState(Array(6).fill(null));
  const [pluginNames, setPluginNames] = useState(Array(6).fill("")); // Store plugin names

  useEffect(() => {
    const loadPlugin = async () => {
      if (window.MyPlugin) {
        setMyComponent(() => window.MyPlugin.McaPage);
      }
    };

    loadPlugin();
  }, []);

  // Open dialog when a box is clicked
  const handleBoxClick = (index) => {
    console.log(`Box ${index} clicked`);
    setSelectedBox(index);
    setOpen(true);
  };

  // Select a plugin and update the corresponding box
  const handlePluginSelect = (plugin) => {
    const updatedPlugins = [...boxPlugins];
    updatedPlugins[selectedBox] = plugin;
    setBoxPlugins(updatedPlugins);

    const updatedPluginNames = [...pluginNames];
    updatedPluginNames[selectedBox] = plugin.instanceId; // Save the plugin name or instanceId
    setPluginNames(updatedPluginNames);

    setOpen(false);
  };

  // Handle clearing the selected box's plugin
  const handleClearBox = () => {
    const updatedPlugins = [...boxPlugins];
    updatedPlugins[selectedBox] = null; // Set the selected box's plugin to null
    setBoxPlugins(updatedPlugins);

    const updatedPluginNames = [...pluginNames];
    updatedPluginNames[selectedBox] = ""; // Clear the plugin name
    setPluginNames(updatedPluginNames);

    setOpen(false); // Close the dialog
  };

  console.log('..............box plugin', boxPlugins);

  const [boxSizes, setBoxSizes] = useState(
    Array(6).fill({ width: 500, height: 400 }) // Default size for each box
  );


  const [options, setOptions] = useState({});
  const chartRef = useRef();

  const currentValue = "Gamma"; // Replace this with the actual dynamic value or state

  // Function to generate random data between 0 and 0.2 with one decimal place
  const generateRandomData = () => {
    const dataPoints = [];
    const now = new Date();
    for (let i = 0; i < 10; i++) { // Example: generate 10 random data points
      // Generate random value between 0 and 0.2, and round to one decimal place
      const randomValue = (Math.random() * 0.2).toFixed(1); // Generate number between 0 and 0.2 with 1 decimal place
      dataPoints.push({
        x: new Date(now.getTime() + i * 1000), // Increment by 1 second
        y: parseFloat(randomValue), // Parse the string to a float after rounding
      });
    }
    return dataPoints;
  };


  // Update chart data with random values
  const updateChartData = () => {
    setOptions({
      zoomEnabled: true,
      zoomType: "x",
      // height: window.innerHeight * 0.82, // Adjust height as a percentage of the window height (82%)
      // width: window.innerWidth * 0.44, // Adjust width as a percentage of the window width (44%)
      axisX: {
        title: 'Time',
        intervalType: "second",
        valueFormatString: "HH:mm:ss",
        labelAngle: -20,
        titleFontWeight: "bold",
        lineColor: "black",
        lineThickness: 2,
        titleFontSize: 18,
        labelFontSize: 14,
        gridThickness: 1,
        gridColor: "lightgray",
        gridDashType: "dot",
      },
      axisY: {
        title: `counts (${currentValue})`,
        lineColor: "black",
        lineThickness: 2,
        titleFontWeight: "bold",
        titleFontSize: 18,
        labelFontSize: 16,
        maximum: 1,
        minimum: -1,
        gridThickness: 1,
        gridColor: "lightgray",
        gridDashType: "dot",
      },
      data: [{
        type: "line",
        xValueType: "dateTime",
        dataPoints: generateRandomData(), // Use random data points here
        markerType: 'none',
        lineThickness: 2,
        color: "#0047AB", // Line color for data points
      }],
      theme: 'light1',
    });
  };

  // Run once on component mount to initialize the chart data
  useEffect(() => {
    updateChartData();
  }, []);


  /////speedometer
  const [value, setValue] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    // Generate a random value between 0 and 100 for the "area gamma monitor"
    const randomValue = Math.floor(Math.random() * 101);
    setValue(randomValue);
  }, []);

  // const handleBoxClick = (id) => {
  //   console.log(`Box clicked: ${id}`);
  // };

  // Get the box dimensions to set speedometer size accordingly
  const boxWidth = containerRef.current ? containerRef.current.offsetWidth : 0;
  const boxHeight = 450; // Fixed height for the box, you can also calculate dynamically if needed

  const speedometerWidth = boxWidth * 0.8; // Speedometer should take 80% of the box width
  const speedometerHeight = boxHeight * 0.6; // Speedometer height is set to 60% of the box height


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
              <Paper style={{ width: '100%', height: '100%', padding: '4px' }}>
                <div
                  id={`chart-${index}`}
                  style={{ width: '100%', height: '80%', backgroundColor: 'white' }}
                >
                  {boxPlugins[index].pluginType === "xspecPlugin" && (
                    <>
                      <h4>{pluginNames[index]}</h4>
                    </>
                  )}
                  {boxPlugins[index].pluginType === "xagmPlugin" && (
                    <>
                      <h4>{pluginNames[index]}</h4>
                    </>
                  )}
                </div>
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
              {plugins.length > 1 && [...plugins] // Create a shallow copy of the plugins array
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
