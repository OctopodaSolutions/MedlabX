import { Box } from '@mui/system';
import { Typography } from '@mui/material';
import React from 'react';

function PluginContainer({ plugin }) {
    return (
        <Box sx={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px' }}>
            <Typography variant="h4">{plugin.name}</Typography>
            <Typography variant="body1" sx={{ marginBottom: '10px' }}>
                <strong>Version:</strong> {plugin.version}
            </Typography>
            <Typography variant="body2" sx={{ marginBottom: '10px' }}>
                <strong>Description:</strong> {plugin.description}
            </Typography>
            <Typography variant="body2" sx={{ marginBottom: '10px' }}>
                <strong>Author:</strong> {plugin.author}
            </Typography>
            <Typography variant="body2" sx={{ marginBottom: '10px' }}>
                <strong>Installation:</strong> {plugin.installation}
            </Typography>
            <Typography variant="body2" sx={{ marginBottom: '10px' }}>
                <strong>Dependencies:</strong> {plugin.dependencies.join(', ')}
            </Typography>
            <Typography variant="body2" sx={{ marginBottom: '10px' }}>
                <strong>Last Updated:</strong> {plugin.lastUpdated}
            </Typography>
            <Typography variant="body2">
                <strong>Compatible With:</strong> {plugin.compatibleWith.join(', ')}
            </Typography>
        </Box>
    );
}


export default PluginContainer;
