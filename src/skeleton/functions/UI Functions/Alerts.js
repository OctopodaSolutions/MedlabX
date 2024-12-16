import * as React from 'react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

import React from 'react';
import { Stack, Alert } from '@mui/material';

/**
 * Displays an alert based on the provided action and message.
 * 
 * @param {Object} obj - The object containing alert details.
 * @param {string} obj.action - The type of alert to display ('error', 'warning', 'success', or 'info').
 * @param {string} obj.msg - The message to be displayed in the alert.
 * @returns {JSX.Element} The JSX for the alert component.
 */
export default function Alerts(obj) {
    console.log("Alert Called with obj", obj, obj.action);

    if (obj.action === 'error') {
        console.log("Alert Called Error");
        return (
            <React.Fragment>
                <Stack sx={{ width: '100%' }} spacing={2}>
                    <Alert severity="error">{obj.msg}</Alert>
                </Stack>
            </React.Fragment>
        );
    }
    else if (obj.action === 'warning') {
        console.log("Alert Called warning");
        return (
            <Stack sx={{ width: '100%' }} spacing={2}>
                <Alert severity="warning">{obj.msg}</Alert>
            </Stack>
        );
    }
    else if (obj.action === 'success') {
        console.log("Alert Called success");
        return (
            <Stack sx={{ width: '100%' }} spacing={2}>
                <Alert severity="success">{obj.msg}</Alert>
            </Stack>
        );
    }
    else if (obj.action === 'info') {
        console.log("Alert Called info");
        return (
            <Stack sx={{ width: '100%' }} spacing={2}>
                <Alert severity="info">{obj.msg}</Alert>
            </Stack>
        );
    }
    else {
        console.log("no Alert Selected");
    }
    return (
        <Stack sx={{ width: '100%' }} spacing={2}>
            <Alert severity="info">"Hello World"</Alert>
        </Stack>
    );
}
