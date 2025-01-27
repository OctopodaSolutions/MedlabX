import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import { Paper, Box, Button, Typography} from '@mui/material';
import { TextField } from '@mui/material';
import Stack from '@mui/material/Stack';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { ConnectionDetails, UploadConnectionSettings } from '../../functions/Program Functions/connection_functions';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import UploadIcon from '@mui/icons-material/Upload';
import { Connection_Settings } from '../../utils/medlab_constants';
import { ErrorMessage, SuccessMessage } from '../UI Components/AlertMessage';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import { useTheme } from '../../utils/ThemeContext';
import AntSwitch from '@mui/material/Switch';
import { update_template } from '../../functions/API Calls/database_calls';
import { InputAdornment } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { useEffect, useState } from 'react';
import React from 'react';
import axios from 'axios';

/**
 * A styled component for displaying items with theme-based styles.
 * @param {object} theme - The theme object containing palette and typography information.
 */
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

/**
 * The CommunicationSettings component handles the display and modification of various communication settings.
 * It uses Redux for state management and Material-UI for styling.
 * @component
 */
export default function CommunicationSettings() {
  const connection = useSelector((state) => (state.connection_settings));
  const themeState = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState(false);
  const [newConnectionObj, setNewConnObj] = useState(Connection_Settings);
  const [httpAddr, setHttpAddr] = useState("");
  const [httpPort, setHttpPort] = useState("");
  const [mqttAddr, setMqttAddr] = useState("");
  const [mqttClientName, setMqttClientName] = useState("");
  const [mqttPort, setMqttPort] = useState("");
  const [wsAddr, setWsAddr] = useState("");
  const [wsPort, setWsPort] = useState("");
  const [numMsgs, setNumMsgs] = useState("");
  const [telemetryDelay, setTelemetryDelay] = useState("3000");
  const [numMCA, setNumMCA] = useState(0);
  const [numAGM, setNumAGM] = useState(0);
  const [isDemo, setIsDemo] = useState(false);
  const [isMCA, setIsMCA] = useState(false);
  const [numMqtt, setNumMqtt] = useState(0);
  const [numLines, setNumLines] = useState(0);
  const [debugLevel, setDebugLevel] = useState('info');
  const { theme, toggleTheme } = useTheme();
  const [file, setFile] = useState(null);
  const [templateFilePath, setTemplateFilePath] = useState("");

  /**
   * Handles the change event of the file input.
   * @param {object} e - The event object from the file input.
   */
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setTemplateFilePath(e.target.files[0].name);
      console.log("file set")
    }
  };

  /**
   * Handles the file upload process.
   */
  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    update_template(formData)
    .then((data) => {
        console.log('File upload result:', data);
        SuccessMessage('Template Changed');
    })
    .catch((error) => {
        console.error('Upload failed:', error.message);
    });
  };

  /**
   * Handles the toggle of the Demo Mode switch.
   * @param {object} event - The event object from the switch.
   */
  const demoSwitchClicked = (event) => {
    console.log('demoSwitchClicked', event.target.checked, connection.DEMO_MODE);
    setIsDemo(!isDemo);
  };

  /**
   * Handles the toggle of the MCA Mode switch.
   * @param {object} event - The event object from the switch.
   */
  const mcaSwitchClicked = (event) => {
    console.log("MCA Switch Clicked", event.target.checked, connection.MCA_MODE);
    setIsMCA(!isMCA);
  };

  /**
   * Saves the current settings.
   */
  const saveSettings = () => {
    console.log("Save Settings", newConnectionObj);
    newConnectionObj.HTTP_SERVER_ADDR = httpAddr;
    newConnectionObj.HTTP_SERVER_PORT = httpPort;
    newConnectionObj.WEBSOCKET_SERVER_ADDR = wsAddr;
    newConnectionObj.WEBSOCKET_SERVER_PORT = wsPort;
    newConnectionObj.MQTT_SERVER_ADDR = mqttAddr;
    newConnectionObj.MQTT_SERVER_PORT = mqttPort;
    newConnectionObj.MQTT_CLIENT_NAME = mqttClientName;
    newConnectionObj.NUM_MSGS = numMsgs;
    newConnectionObj.TELE_DELAY = telemetryDelay;
    newConnectionObj.NUM_MCA = numMCA;
    newConnectionObj.NUM_AGM = numAGM;
    newConnectionObj.DEMO_MODE = isDemo;
    newConnectionObj.MCA_MODE = isMCA;
    newConnectionObj.NUM_MQTT = numMqtt;
    newConnectionObj.NUM_LINES = numLines;
    newConnectionObj.REPORT_TEMPLATE = templateFilePath;
    // dispatch(mqttSettingsWhole(newConnectionObj));
    setEditMode(false);
  };

  /**
   * Enables edit mode for the settings.
   */
  const editSettings = () => {
    console.log("Edit settings");
    setEditMode(true);
  };

  /**
   * Reloads the settings from the server.
   */
  const reloadSettings = () => {
    setEditMode(false);
    ConnectionDetails().then((res) => {
      console.log("Get Connection Details", res);
      // dispatch(mqttSettingsWhole(res));
    }).catch((err) => {
      console.log("error Get Connection Details", err);
    });
  };

  /**
   * Uploads the current settings to the server.
   */
  const uploadSettings = () => {
    UploadConnectionSettings(connection).then((res) => {
      SuccessMessage(res);
    }).catch((err) => {
      ErrorMessage(err);
    });
  };

  useEffect(() => {
    console.log("Change detected in Connection");
    setHttpAddr(connection.HTTP_SERVER_ADDR);
    setHttpPort(connection.HTTP_SERVER_PORT);
    setMqttAddr(connection.MQTT_SERVER_ADDR);
    setMqttPort(connection.MQTT_SERVER_PORT);
    setWsAddr(connection.WEBSOCKET_SERVER_ADDR);
    setWsPort(connection.WEBSOCKET_SERVER_PORT);
    setNumMsgs(connection.NUM_MSGS);
    setTelemetryDelay(connection.TELE_DELAY);
    setNumMCA(connection.NUM_MCA);
    setNumAGM(connection.NUM_AGM);
    setIsDemo(connection.DEMO_MODE);
    setIsMCA(connection.MCA_MODE);
    setNumMqtt(connection.NUM_MQTT);
    setNumLines(connection.NUM_LINES);
    setTemplateFilePath(connection.REPORT_TEMPLATE);
  }, [connection]);

  useEffect(() => {
    reloadSettings();
  }, []);

  /**
   * Extracts the short path of the file.
   * @param {string} templateFilePath - The full path of the file.
   * @returns {string} The short path of the file.
   */
  const getFileShortPath = (templateFilePath) => {
    let len = String(templateFilePath).split('\\').length;
    return String(templateFilePath).split('\\')[len - 1];
  };

  return (
    <Paper elevation={5} sx={{ backgroundColor: 'var(--body_background1)', color: 'var(--body_color1)', height: '84vh', overflowY: 'auto' }}>
      <Box sx={{ margin: 'auto', marginRight: '20%', marginLeft: '20%' }}>
        <Divider sx={{ marginBottom: '1vh', padding: '2rem 0rem' }}>
          <Chip label="Network Settings" size="small" sx={{ backgroundColor: 'var(--body_background4)', color: 'var(--body_color)', fontSize: '1.25vh', padding: '1.2vh 1vh' }} />
        </Divider>
        <Grid container spacing={2} >
          <Grid xs={4} >
            <Item sx={{ backgroundColor: 'var(--body_background1)', color: 'var(--body_color)' }}>
            <TextField
                disabled={!editMode}
                required
                id="outlined-required"
                label="HTTP Server Addr"
                className="custom-textfield"
                sx={{
                  "& .MuiInputBase-input.Mui-disabled": {
                    WebkitTextFillColor: "var(--body_color)",
                  },
                }}
                value={httpAddr}
                onChange={(event) => setHttpAddr(event.target.value)}
                variant="outlined"
              />
            </Item>
          </Grid>
          <Grid xs={4}>
            <Item sx={{ backgroundColor: 'var(--body_background1)', color: 'var(--body_color)' }} >
              <TextField
                disabled={!editMode}
                required
                id="outlined-required"
                label="HTPT Server PORT"
                className="custom-textfield"
                sx={{
                  "& .MuiInputBase-input.Mui-disabled": {
                    WebkitTextFillColor: "var(--body_color)",
                  },
                }}
                value={httpPort}
                onChange={(event) => setHttpPort(event.target.value)}

              />
            </Item>
          </Grid>
          <Grid xs={4}>
            <Item sx={{ backgroundColor: 'var(--body_background1)', color: 'var(--body_color)' }}>
              <TextField
                disabled={!editMode}
                required
                id="outlined-required"
                label="Web Socket Server Addr"
                className="custom-textfield"
                sx={{
                  "& .MuiInputBase-input.Mui-disabled": {
                    WebkitTextFillColor: "var(--body_color)",
                  },
                }}
                value={wsAddr}
                onChange={(event) => setWsAddr(event.target.value)}
              />
            </Item>
          </Grid>
          <Grid xs={4}>
            <Item sx={{ backgroundColor: 'var(--body_background1)', color: 'var(--body_color)' }}>
              <TextField
                disabled={!editMode}
                required
                id="outlined-required"
                label="Web Socket Server Port"
                className="custom-textfield"
                sx={{
                  "& .MuiInputBase-input.Mui-disabled": {
                    WebkitTextFillColor: "var(--body_color)",
                  },
                }}
                value={wsPort}
                onChange={(event) => setWsPort(event.target.value)}
              />
            </Item>
          </Grid>
          <Grid xs={4}>
            <Item sx={{ backgroundColor: 'var(--body_background1)', color: 'var(--body_color)' }}>
              <TextField
                disabled={!editMode}
                required
                id="outlined-required"
                label="Number of LINES"
                className="custom-textfield"
                sx={{
                  "& .MuiInputBase-input.Mui-disabled": {
                    WebkitTextFillColor: "var(--body_color)",
                  },
                }}
                value={numLines}
                onChange={(event) => setNumLines(event.target.value)}
              />
            </Item>
          </Grid>
        </Grid>
        <Grid  sx={{mt:'2rem'}} container spacing={2}>
          <Grid xs={4}>
            <Item sx={{ backgroundColor: 'var(--body_background1)', color: 'var(--body_color)' }}>
              <TextField
                disabled={!editMode}
                required
                id="outlined-required"
                label="Number of MCAs"
                className="custom-textfield"
                sx={{
                  "& .MuiInputBase-input.Mui-disabled": {
                    WebkitTextFillColor: "var(--body_color)",
                  },
                }}
                value={numMCA}
                onChange={(event) => setNumMCA(event.target.value)}
              />
            </Item>
          </Grid>
          <Grid xs={4}>
            <Item sx={{ backgroundColor: 'var(--body_background1)', color: 'var(--body_color)',fontSize:'1.25vh' }}>
              MCA Mode -
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography>Off</Typography>
                <AntSwitch disabled={!editMode}
                  checked={isMCA}
                  inputProps={{ 'aria-label': 'ant design' }}
                  onClick={mcaSwitchClicked} />
                <Typography>On</Typography>
              </Stack>
            </Item>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ margin: 'auto', marginRight: '20%', marginLeft: '20%', }}>
        <Divider sx={{ marginBottom: '4%', marginTop: '4%' }}>
          <Chip label="MQTT Settings" size="small" sx={{ backgroundColor: 'var(--body_background4)', color: 'var(--body_color)',fontSize:'1.25vh', padding:'1.2vh 1vh' }} />
        </Divider>
        <Grid container spacing={2}>
          <Grid xs={4}>
            <Item sx={{ backgroundColor: 'var(--body_background1)', color: 'var(--body_color)' }}>
              <TextField
                disabled={!editMode}
                required
                id="outlined-required"
                label="MQTT Server Addr"
                className="custom-textfield"
                sx={{
                  "& .MuiInputBase-input.Mui-disabled": {
                    WebkitTextFillColor: "var(--body_color)",
                  },
                }}
                value={mqttAddr}
                onChange={(event) => setMqttAddr(event.target.value)}
              />
            </Item>
          </Grid>
          <Grid xs={4}>
            <Item sx={{ backgroundColor: 'var(--body_background1)', color: 'var(--body_color)' }}>
              <TextField
                disabled={!editMode}
                required
                id="outlined-required"
                label="MQTT Server Port"
                className="custom-textfield"
                sx={{
                  "& .MuiInputBase-input.Mui-disabled": {
                    WebkitTextFillColor: "var(--body_color)",
                  },
                }}
                value={mqttPort}
                onChange={(event) => setMqttPort(event.target.value)}

              />
            </Item>
          </Grid>
          <Grid xs={4}>
            <Item sx={{ backgroundColor: 'var(--body_background1)', color: 'var(--body_color)' }}>
              <TextField
                disabled={!editMode}
                required
                id="outlined-required"
                label="Max Messages"
                className="custom-textfield"
                sx={{
                  "& .MuiInputBase-input.Mui-disabled": {
                    WebkitTextFillColor: "var(--body_color)",
                  },
                }}
                value={numMsgs}
                onChange={(event) => setNumMsgs(event.target.value)}
              />
            </Item>
          </Grid>
          <Grid xs={4}>
            <Item sx={{ backgroundColor: 'var(--body_background1)', color: 'var(--body_color)' }}>
              <TextField
                disabled={!editMode}
                required
                id="outlined-required"
                label="Telemetry Delay"
                className="custom-textfield"
                sx={{
                  "& .MuiInputBase-input.Mui-disabled": {
                    WebkitTextFillColor: "var(--body_color)",
                  },
                }}
                value={telemetryDelay}
                onChange={(event) => setTelemetryDelay(event.target.value)}

              />
            </Item>
          </Grid>
          <Grid xs={4}>
            <Item sx={{ backgroundColor: 'var(--body_background1)', color: 'var(--body_color)' }}>
              <TextField
                disabled={!editMode}
                required
                id="outlined-required"
                label="Number of MQTTs"
                className="custom-textfield"
                sx={{
                  "& .MuiInputBase-input.Mui-disabled": {
                    WebkitTextFillColor: "var(--body_color)",
                  },
                }}
                value={numMqtt}
                onChange={(event) => setNumMqtt(event.target.value)}
              />
            </Item>
          </Grid>
          <Grid xs={4}>
            <Item sx={{ backgroundColor: 'var(--body_background1)', color: 'var(--body_color)',fontSize:'1.25vh' }}>
              Demo Mode -
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography>Off</Typography>
                <AntSwitch disabled={!editMode}
                  checked={isDemo}
                  inputProps={{ 'aria-label': 'ant design' }}
                  onClick={demoSwitchClicked} />
                <Typography>On</Typography>
              </Stack>
            </Item>
          </Grid>
        </Grid>
      </Box>
      {/* <Box sx={{ margin: 'auto', marginRight: '20%', marginLeft: '20%' }}>
        <Divider sx={{ marginBottom: '4%', marginTop: '4%' }}>
          <Chip label="Network Settings" size="small" sx={{ backgroundColor: 'var(--body_background4)', color: 'var(--body_color)',fontSize:'1.25vh', padding:'1.2vh 1vh' }}/>
        </Divider>
        <Grid container spacing={2}>
          <Grid xs={4}>
            <Item sx={{ backgroundColor: 'var(--body_background1)', color: 'var(--body_color)' }}>
              <TextField
                disabled={!editMode}
                required
                id="outlined-required"
                label="Number of MCAs"
                className="custom-textfield"
                sx={{
                  "& .MuiInputBase-input.Mui-disabled": {
                    WebkitTextFillColor: "var(--body_color)",
                  },
                }}
                value={numMCA}
                onChange={(event) => setNumMCA(event.target.value)}
              />
            </Item>
          </Grid>
          <Grid xs={4}>
            <Item sx={{ backgroundColor: 'var(--body_background1)', color: 'var(--body_color)',fontSize:'1.25vh' }}>
              MCA Mode -
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography>Off</Typography>
                <AntSwitch disabled={!editMode}
                  checked={isMCA}
                  inputProps={{ 'aria-label': 'ant design' }}
                  onClick={mcaSwitchClicked} />
                <Typography>On</Typography>
              </Stack>
            </Item>
          </Grid>
        </Grid>
      </Box> */}
      <Box sx={{ margin: 'auto', marginRight: '20%', marginLeft: '20%' }}>
        <Divider sx={{ marginBottom: '4%', marginTop: '4%', }}>
          <Chip label="
           Settings" size="small" sx={{ backgroundColor: 'var(--body_background4)', color: 'var(--body_color)',fontSize:'1.25vh', padding:'1.2vh 1vh' }}/>
        </Divider>
        <Grid container spacing={2}>
          <Grid xs={4}>
            <Item sx={{ backgroundColor: 'var(--body_background1)', color: 'var(--body_color)' }}>
              <TextField
                disabled={!editMode}
                required
                id="outlined-required"
                label="Number of LINES"
                className="custom-textfield"
                sx={{
                  "& .MuiInputBase-input.Mui-disabled": {
                    WebkitTextFillColor: "var(--body_color)",
                  },
                }}
                value={numLines}
                onChange={(event) => setNumLines(event.target.value)}
              />
            </Item>
          </Grid>
          <Grid xs={4}>
            <Item sx={{ backgroundColor: 'var(--body_background1)', color: 'var(--body_color)',fontSize:'1.25vh' }}>
              <TextField
                      variant="outlined"
                      label="Report Template"
                      value={getFileShortPath(templateFilePath)}
                      disabled={!editMode}
                      InputProps={{
                        readOnly: true,
                        endAdornment: (
                          <InputAdornment position="end">
                            <input
                              accept="/" 
                              style={{ display: 'none' }}
                              id="raised-button-file"
                              multiple
                              type="file"
                              onChange={handleFileChange}
                            />
                            <label htmlFor="raised-button-file">
                              <IconButton
                                color="primary"
                                aria-label="upload picture"
                                component="span"
                                disabled={!editMode}
                              >
                                <AttachFileIcon disabled={!editMode}  />
                              </IconButton>
                            </label>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <IconButton
                      variant="contained"
                      color="primary"
                      onClick={handleUpload}
                      style={{ marginTop: '10px' }}
                      disabled={!editMode}
                    >
                      <FileUploadIcon />
                    </IconButton>

            </Item>
          </Grid>

          <Grid xs={4}>
            <Item sx={{ backgroundColor: 'var(--body_background1)', color: 'var(--body_color)',fontSize:'1.25vh' }}>
              Dark Mode -
              <Stack direction="row" spacing={1} alignItems="center" >
                <Typography>Off</Typography>
                <AntSwitch onChange={toggleTheme} disabled={!editMode} checked={theme === 'dark'} />
                <Typography>On</Typography>
              </Stack>
            </Item>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem 0rem', marginTop:'2%'}}>
        <Stack spacing={4} direction="row">
          
          <Button disabled={editMode} sx={{ display: editMode, border: '1px solid lightgrey' ,backgroundColor: 'var(--body_background1)', color: 'var(--body_color)',fontSize:'1.25vh'}} onClick={editSettings} endIcon={<EditIcon  />} variant="text">Edit</Button>
          <Button disabled={!editMode} sx={{ display: !editMode, border: '1px solid #ccc',backgroundColor: 'var(--body_background1)', color: 'var(--body_color)',fontSize:'1.25vh' }} onClick={saveSettings} endIcon={<SaveIcon />} variant="text">Save</Button>
          <Button sx={{ border: '1px solid #ccc' ,backgroundColor: 'var(--body_background1)', color: 'var(--body_color)',fontSize:'1.25vh'}} onClick={reloadSettings} endIcon={<CancelIcon />} variant="text">Cancel</Button>
          <Button disabled={editMode} sx={{ display: editMode, border: '1px solid #ccc',backgroundColor: 'var(--body_background1)', color: 'var(--body_color)',fontSize:'1.25vh' }} onClick={uploadSettings} endIcon={<UploadIcon />} variant="text">Upload</Button>
        </Stack>
      </Box>
    </Paper>
  );
}