// GridComponent.js
import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const GridComponent = () => {
    return (
        <Box
            sx={{
                flexGrow: 1,
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px',
                padding: '20px',
            }}
        >
            {Array.from({ length: 6 }).map((_, index) => (
                <Box
                key={index}
                sx={{
                  height: '300px',
                  background: 'linear-gradient(145deg, #d1d1d1, #f9f9f9, #b5b5b5)', // Metallic gradient
                  boxShadow: '4px 4px 10px rgba(0, 0, 0, 0.1)',
                  padding: '30px',
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
              >
                <IconButton
                  sx={{
                    backgroundColor: 'linear-gradient(145deg, #c0c0c0, #e0e0e0)', // Metallic button gradient
                    color: '#fff',
                    '&:hover': {
                      background: 'linear-gradient(145deg, #a0a0a0, #c0c0c0)', // Darker metallic hover effect
                    },
                    marginBottom: '10px',
                    padding: '12px',
                  }}
                >
                  <AddCircleOutlineIcon sx={{ fontSize: 40 }} />
                </IconButton>
                <Typography 
                  variant="h6"
                  sx={{ 
                    color: '#4a4a4a', // Slightly darker gray for text to match metallic theme 
                  }}
                >
                  Box {index + 1}
                </Typography>
              </Box>
              
            ))}
        </Box>
    );
};

export default GridComponent;
