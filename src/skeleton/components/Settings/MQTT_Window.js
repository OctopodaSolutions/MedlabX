import { useState, useRef, useEffect } from 'react';
import { Box, Button, IconButton, InputAdornment} from '@mui/material';
import {TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useSelector } from 'react-redux';
import { addMessageFromSoftware, resetMessages } from '../../store/messageSlice';
import { useDispatch } from 'react-redux';
import './MQTT_Window.css';
import { disconnectConnectionWithBroker, getConnectedArduinos, sendSingleCommandToArduino } from '../../functions/Arduino Functions/getLinesFromArduino';
import { ErrorMessage, SuccessMessage } from '../UI Components/AlertMessage';
import { ConnectionDetails, PrgObjToArduino } from '../../utils/medlab_constants';
import React from 'react';
import { addMqtt, resetMQTT } from '../../store/mqttConnectionSlice';


/**
 * MQTT_Window component allows users to interact with MQTT messages and manage connections.
 * It includes a section for selecting MQTT connections, sending messages, and displaying received messages.
 *
 * @returns {JSX.Element} The rendered MQTT_Window component.
 */
export default function MQTT_Window() {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [firstBoxContent, setFirstBoxContent] = useState([]);
    const [selectedSysID, setSelectedSysId] = useState(null);
    const [message, setMessage] = useState('');
    const messageContainerRef = useRef(null);
    const [showPopup, setShowPopup] = useState(false);
    const messages = useSelector((state) => state.mqttMessages);
    const mqtts = useSelector((state) => state.mqttConnections);
    const [selectedMqttH, setSelectedMqttH] = useState("");
    const [selectedMqttS, setSelectedMqttS] = useState("");
    const maxMqttMsgs = useSelector((state) => state.connection_settings.NUM_MSGS);

    const dispatch = useDispatch();

    useEffect(() => {
        if (messageContainerRef.current) {
            // Scroll to bottom of message container
            // messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        // Update selected MQTT S based on selected MQTT H
        console.log("SelectedMQTT S", selectedMqttH, selectedMqttS);
        setSelectedMqttS(`ss${selectedMqttH.substring(2)}`);
    }, [selectedMqttH]);

    /**
     * Opens the connection dialog.
     */
    const handleConnectionClick = () => {
        setShowPopup(true);
    };

    /**
     * Opens the dialog for adding a new name.
     */
    const handleDialogOpen = () => {
        setOpen(true);
    };

    /**
     * Closes the dialog for adding a new name.
     */
    const handleDialogClose = () => {
        setOpen(false);
    };

    /**
     * Confirms the addition of a new name and updates the state.
     */
    const handleConfirm = () => {
        if (name) {
            setFirstBoxContent([...firstBoxContent, name]);
        }
        setName('');
        handleDialogClose();
    };

    /**
     * Opens the dialog for creating a new subscription.
     */
    const handleNewSubscriptionClick = () => {
        handleDialogOpen();
    };

    /**
     * Closes the popup.
     */
    const handleCancel = () => {
        setShowPopup(false);
    };

    /**
     * Sends a message to the selected MQTT connection and dispatches it to the Redux store.
     * 
     * @param {string} message - The message to be sent.
     */
    const handleSendMessage = () => {
        if (message) {
            dispatch(addMessageFromSoftware({ type: 'telemetry', sys_id: selectedMqttS, msg: message, timestamp: Date.now() }, maxMqttMsgs));
            sendSingleCommandToArduino(message, { name: selectedMqttH, returnFeed: selectedMqttS });
            setMessage('');
            setTimeout(() => {
                if (messageContainerRef.current) {
                    // Scroll to bottom of message container
                    // messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
                }
            }, 0);
        }
    };

    /**
     * Handles the key press event for the message input field.
     * Sends the message when the Enter key is pressed.
     * 
     * @param {React.KeyboardEvent<HTMLDivElement>} e - The keyboard event object.
     */
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSendMessage();
        }
    };

    /**
     * Determines the CSS class for the message item based on its sysID.
     * 
     * @param {string} sysID - The system ID of the message.
     * @returns {string} The CSS class for the message item.
     */
    function getSysIdColorClass(sysID) {
        const index = Number(sysID.charAt(2));
        if (sysID.startsWith('hs')) {
            return `message-item-hs${index % 7}`;
        } else if (sysID.startsWith('ss')) {
            return `message-item-ss${index % 7}`;
        } else {
            return '';
        }
    }

    /**
     * Sets the selected MQTT system ID when a button is clicked.
     * 
     * @param {string} sysId - The system ID to select.
     */
    const handleSysIdClick = (sysId) => {
        console.log("Clicked", sysId);
        setSelectedMqttH(sysId);
    };

    /**
     * Refreshes the MQTT connection by disconnecting and reconnecting to the broker.
     */
    const refreshBatch = () => {
        try {
            let feedArr = [];
            let tempObj = ConnectionDetails;
            tempObj.cmd = "Disconnect";
            disconnectConnectionWithBroker(tempObj).then((res) => {
                dispatch(resetMQTT());
                dispatch(resetMessages());
                getConnectedArduinos().then((res) => {
                    dispatch(addMqtt(res.data));
                }).catch((err) => {
                    ErrorMessage(`Unable to connect to Hardware ${err}`);
                });
                SuccessMessage("Disconnected Hardware on MQTT");
            }).catch((err) => {
                console.log(`Unable to disconnect Hardware ${err}`);
                ErrorMessage(`Unable to disconnect Hardware`);
            });
        } catch (error) {
            console.error('error in disconnecting', error);
        }
    };

    return (
        <div style={{ display: 'flex', padding: '14px 10px', height: '80vh' }}>
            <Box
                boxShadow={5}
                borderRadius={3}
                p={2}
                style={{ height: '100%', flex: .2, marginRight: '10px', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--body_background1)', color: 'var(--body_color)' }}
            >
                {mqtts && (mqtts.length > 0) && mqtts.map((sysId) => (
                    <button key={sysId[0]}
                        className={`left-sysid-selection-button ${selectedSysID === sysId[0] ? 'selected' : ''}`}
                        onClick={() => handleSysIdClick(sysId[0])}
                    >
                        {sysId[0]}
                    </button>
                ))}
                <Box className='subscription-down' sx={{ backgroundColor: "var(--body_background1)" }}>
                    <Button className='Disconnect-Button' onClick={refreshBatch}>Reconnect</Button>
                </Box>
            </Box>
            <Box
                boxShadow={5}
                borderRadius={3}
                p={2}
                style={{
                    height: '100%',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    backgroundColor: 'var(--body_background1)'
                }}
            >
                <div ref={messageContainerRef} className="message-container">
                    {messages && messages
                        .filter((action) => (selectedSysID ? action.sys_id === selectedSysID || action.sys_id === 'ss1' : true))
                        .map((action, index) => {
                            const className = `${getSysIdColorClass(action.sys_id)} message-item`;
                            const flexStartStyle = action.sys_id.startsWith('hs') ? { alignSelf: 'flex-start' } : {};
                            return (
                                <div key={index} className={className} style={flexStartStyle}>
                                    <div className="message-badge">{action.sys_id}</div>
                                    <div className="message-content">
                                        <div className="message-text">{action.msg}</div>
                                        <div className="message-timestamp">
                                            {action.timestamp ? new Date(action.timestamp).toLocaleString() : 'No timestamp available'}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </div>
                <TextField
                    label="Type your message"
                    variant="outlined"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    style={{ marginBottom: '10px' }}
                    InputProps={{
                        style: { height: '80px', fontSize: '23px', backgroundColor: "var(--body_background1)", boxShadow: '2px 2px 14px rgba(0, 0, 0, 0.3)' },
                        startAdornment: (
                            <InputAdornment position="start">
                                <div className="ss1-text">{selectedMqttS}</div>
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    color="primary"
                                    aria-label="send"
                                    onClick={handleSendMessage}
                                >
                                    <SendIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>
        </div>
    );
}