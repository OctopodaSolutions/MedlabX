import { useState, useRef, useEffect } from 'react';
import { Box, Button, IconButton, InputAdornment } from '@mui/material';
import { TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useSelector } from 'react-redux';
import { addSerialConnection, addSerialFromHardware, addSerialFromSoftware, resetSerialConnections } from '../../../redux_stores/actions';
import { useDispatch } from 'react-redux';
import './MQTT_Window.css';
import { convertByteStringToInt, convertByteToInt, endSerialConnections, getAvailableSerials, initSerial, sendSerialCommand } from '../../functions/Arduino Functions/serial_functions';
import { ErrorMessage, SuccessMessage } from '../UI Components/AlertMessage';
import React from 'react';


/**
 * Serial_Window component allows users to interact with serial communication.
 * It includes options for connecting to serial ports, sending messages, and displaying received messages.
 *
 * @returns {JSX.Element} The rendered Serial_Window component.
 */
export default function Serial_Window() {

    const [selectedSysID, setSelectedSysId] = useState(null);
    const [message, setMessage] = useState('');
    const messageContainerRef = useRef(null);
    const messages = useSelector((state) => state.serialMessages);
    const serial_connections = useSelector((state) => state.serialConnections);
    const [selectedSerial, setSelectedSerial] = useState("");
    const dispatch = useDispatch();

    /**
     * Handles connection to available serial ports and initializes the selected serial port.
     */
    const handleConnect = () => {
        console.log("Inside handleConnect");
        getAvailableSerials().then((res) => {
            const itemsToAdd = Array.isArray(res.data) ? res.data : [res.data];
            dispatch(addSerialConnection(itemsToAdd));
            console.log("Res from SerialConn", itemsToAdd);
            itemsToAdd.map((conn) => {
                console.log(conn, conn.vendorId, "being mapped");
                if (conn.vendorId === '1A86') {
                    initSerial(conn.path, 500000).then(() => {
                        SuccessMessage("Serial Connection Established");
                    }).catch((err) => {
                        ErrorMessage(`Serial Connection Failed ${err}`);
                    });
                } else {
                    console.log("MISSING INIT SERIAL");
                }
            });
        }).catch((err) => {
            console.log("Error from SerialConn", err);
        });
    };

    /**
     * Sends a message via the selected serial connection and dispatches it to the Redux store.
     */
    const handleSendMessage = () => {
        if (message) {
            dispatch(addSerialFromSoftware({ type: 'telemetry', sys_id: 'hs1', msg: message, timestamp: Date.now() }));
            dispatch(addSerialFromSoftware({ type: 'telemetry', sys_id: 'hs1', msg: convertByteToInt(message), timestamp: Date.now() }));
            sendSerialCommand(selectedSerial, message).then((res) => {
                console.log("Result from COM", res);
                dispatch(addSerialFromHardware({ type: 'telemetry', sys_id: selectedSerial, msg: res.data, timestamp: Date.now() }));
            }).catch((err) => {
                console.log("Error from COM", err);
            });
            setMessage('');
            setTimeout(() => {
                if (messageContainerRef.current) {
                    // Scroll to bottom of message container
                    // messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
                }
            }, 0);
        }
    };

    useEffect(() => {
        if (messageContainerRef.current) {
            // Scroll to bottom of message container
            // messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    }, [messages]);

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
        const index = parseInt(sysID.replace(/[^0-9]/g, ""), 10);
        if (sysID.startsWith('hs')) {
            return `message-item-hs${index % 7}`;
        } else if (sysID.startsWith('ss')) {
            return `message-item-ss${index % 7}`;
        } else {
            return '';
        }
    }

    /**
     * Sets the selected serial port when a button is clicked.
     *
     * @param {string} sysId - The system ID to select.
     */
    const handleSysIdClick = (sysId) => {
        setSelectedSerial(sysId);
    };

    /**
     * Disconnects from the selected serial port and resets serial connections.
     */
    const handleDisconnectClick = () => {
        try {
            dispatch(resetSerialConnections());
            endSerialConnections(selectedSerial).then((res) => {
                console.log("After Reset ", res);
                SuccessMessage(`Successfully Closed Serial ${res}`);
            }).catch((err) => {
                console.log(err);
                ErrorMessage(`Error with Closing Serial ${err}`);
            });
        } catch (error) {
            console.error('Error in disconnecting', error);
        }
    };

    return (
        <div style={{ display: 'flex', padding: '14px 10px', height: '88vh' }}>
            <Box
                boxShadow={5}
                borderRadius={3}
                p={2}
                style={{ height: '100%', flex: .2, marginRight: '10px', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--body_background3)' }}
            >
                {(serial_connections.length > 0) && serial_connections.map((serial) => (
                    <button key={serial.path}
                        className={`left-sysid-selection-button ${selectedSerial === serial.path ? 'selected' : ''}`}
                        onClick={() => handleSysIdClick(serial.path)}
                    >
                        {serial.path}
                    </button>
                ))}
                <Box className='subscription-down'>
                    <Button className='Connect-Button' onClick={handleConnect}>Connect</Button>
                    <Button className='Disconnect-Button' onClick={handleDisconnectClick}>Reset</Button>
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
                    backgroundColor: 'var(--body_background3)'
                }}
            >
                <div ref={messageContainerRef} className="message-container">
                    {messages
                        .filter((action) => (selectedSysID ? action.sys_id === selectedSysID || action.sys_id === 'ss1' : true))
                        .map((action, index) => {
                            const className = `${getSysIdColorClass(action.sys_id)} message-item`;
                            const flexStartStyle = action.sys_id.startsWith('hs') ? { alignSelf: 'flex-start' } : {};

                            return (
                                <div key={index} className={className} style={flexStartStyle}>
                                    <div className="message-badge">{selectedSerial}</div>
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
                                <div className="ss1-text">{selectedSerial}</div>
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