
import ReactDOM from 'react-dom';
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import './MainLayout.css';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Tooltip, Chip, Typography } from '@mui/material';
import WysiwygSharpIcon from '@mui/icons-material/WysiwygSharp';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GridComponent from '../PluginComponents/GridComponent'
import PluginRenderer from '../PluginComponents/PluginContainer'
import ChevronLeftSharpIcon from '@mui/icons-material/ChevronLeftSharp';
import ChevronRightSharpIcon from '@mui/icons-material/ChevronRightSharp';
import UploadFile from '../PluginComponents/UploadFile';
import ScienceIcon from '@mui/icons-material/Science';
import AnalyticsIcon from '@mui/icons-material/Analytics';

export function Dashboard() {

  const dispatch = useDispatch()

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const group = useSelector((state) => state.plugin.group);
  const plugins = useSelector((state) => state.plugin.plugins);
  console.log('................plugins.........', plugins);

  const activePlugin = plugins.find(plugin => plugin.instanceId === activeComponent);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      <Box
        sx={{ display: 'flex', height: '94vh', backgroundColor: '#1a1a1a' }}
      >
        {/* Professional Sidebar */}
        <Box
          sx={{
            width: isSidebarOpen ? '320px' : '80px',
            background: 'linear-gradient(180deg, #0f0f0f 0%, #1a1a1a 50%, #2d2d2d 100%)',
            color: '#fff',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            boxShadow: '4px 0 24px rgba(0, 0, 0, 0.12)',
            borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Toggle Button */}
          <Box
            onClick={toggleSidebar}
            sx={{
              position: 'absolute',
              padding: '12px',
              top: '20px',
              right: '-40px',
              background: 'linear-gradient(135deg, #4a5568 0%, #718096 100%)',
              color: '#fff',
              borderRadius: '0 12px 12px 0',
              zIndex: 1000,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 12px 28px rgba(59, 130, 246, 0.4)',
              },
            }}
          >
            {isSidebarOpen ? (
              <ChevronLeftSharpIcon sx={{ fontSize: 24 }} />
            ) : (
              <ChevronRightSharpIcon sx={{ fontSize: 24 }} />
            )}
          </Box>

          {/* Collapsed Sidebar Icons */}
          {!isSidebarOpen && (
            <Box sx={{ padding: '80px 0 20px 0' }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: '32px',
                  cursor: 'pointer',
                  position: 'relative',
                }}
                onClick={() => setActiveComponent('dashboard')}
              >
                <Tooltip title="Laboratory Dashboard" placement="right">
                  <Box
                    sx={{
                      padding: '16px',
                      borderRadius: '12px',
                      background: activeComponent === 'dashboard' 
                        ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(29, 78, 216, 0.3) 100%)' 
                        : 'transparent',
                      border: activeComponent === 'dashboard' ? '2px solid #3b82f6' : '2px solid transparent',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    <AnalyticsIcon sx={{ fontSize: 28, color: activeComponent === 'dashboard' ? '#3b82f6' : '#cbd5e1' }} />
                  </Box>
                </Tooltip>
              </Box>

              {plugins.length > 0 && [...plugins]
                .sort((a, b) => a.instanceId.localeCompare(b.instanceId))
                .map((plugin, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      marginBottom: '16px',
                      cursor: 'pointer',
                    }}
                    onClick={() => setActiveComponent(plugin.instanceId)}
                  >
                    <Tooltip title={plugin.instanceId} placement="right">
                      <Box
                        sx={{
                          padding: '12px',
                          borderRadius: '8px',
                          background: activeComponent === plugin.instanceId 
                            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(5, 150, 105, 0.3) 100%)' 
                            : 'transparent',
                          border: activeComponent === plugin.instanceId ? '2px solid #10b981' : '2px solid transparent',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: 'rgba(255, 255, 255, 0.1)',
                          },
                        }}
                      >
                        <ScienceIcon sx={{ fontSize: 24, color: activeComponent === plugin.instanceId ? '#10b981' : '#94a3b8' }} />
                      </Box>
                    </Tooltip>
                  </Box>
                ))}
            </Box>
          )}

          {/* Expanded Sidebar Content */}
          {isSidebarOpen && (
            <Box
              sx={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                marginTop: '24px',
                position: 'relative',
                padding: '0 20px',
              }}
            >
              {/* Sidebar Header */}
              <Box sx={{ padding: '20px 0 32px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: '#e2e8f0',
                    fontWeight: 700,
                    fontSize: '1.125rem',
                    fontFamily: '"Inter", "Roboto", sans-serif',
                    textAlign: 'center',
                    letterSpacing: '0.025em',
                  }}
                >
                  MEDLAB MODULES
                </Typography>
              </Box>

              {/* Navigation Section */}
              <Box sx={{ padding: '24px 0', flex: 1 }}>
                {/* Dashboard Item */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    padding: '16px 20px',
                    marginBottom: '12px',
                    fontSize: '1rem',
                    fontFamily: '"Inter", "Roboto", sans-serif',
                    fontWeight: 600,
                    color: activeComponent === 'dashboard' ? '#ffffff' : '#cbd5e1',
                    background: activeComponent === 'dashboard' 
                      ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(29, 78, 216, 0.2) 100%)' 
                      : 'transparent',
                    borderRadius: '12px',
                    borderLeft: activeComponent === 'dashboard' ? '4px solid #3b82f6' : '4px solid transparent',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                      background: activeComponent === 'dashboard' 
                        ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(29, 78, 216, 0.3) 100%)'
                        : 'rgba(255, 255, 255, 0.08)',
                      transform: 'translateX(4px)',
                    },
                  }}
                  onClick={() => setActiveComponent('dashboard')}
                >
                  <AnalyticsIcon sx={{ fontSize: 24, marginRight: '16px', color: '#3b82f6' }} />
                  <Typography sx={{ fontWeight: 600, fontSize: '1rem' }}>
                    Laboratory Dashboard
                  </Typography>
                </Box>

                {/* Plugin Items */}
                {plugins.length > 0 && [...plugins]
                  .sort((a, b) => a.instanceId.localeCompare(b.instanceId))
                  .map((plugin, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        padding: '14px 20px',
                        marginBottom: '8px',
                        fontSize: '0.95rem',
                        fontFamily: '"Inter", "Roboto", sans-serif',
                        fontWeight: 500,
                        color: activeComponent === plugin.instanceId ? '#ffffff' : '#cbd5e1',
                        background: activeComponent === plugin.instanceId 
                          ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.2) 100%)' 
                          : 'transparent',
                        borderRadius: '10px',
                        borderLeft: activeComponent === plugin.instanceId ? '4px solid #10b981' : '4px solid transparent',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        '&:hover': {
                          background: activeComponent === plugin.instanceId
                            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(5, 150, 105, 0.3) 100%)'
                            : 'rgba(255, 255, 255, 0.06)',
                          transform: 'translateX(4px)',
                          borderColor: 'rgba(255, 255, 255, 0.1)',
                        },
                      }}
                      onClick={() => setActiveComponent(plugin.instanceId)}
                    >
                      <ScienceIcon sx={{ fontSize: 20, marginRight: '14px', color: '#10b981' }} />
                      <Typography sx={{ fontWeight: 500, fontSize: '0.95rem' }}>
                        {plugin.instanceId}
                      </Typography>
                    </Box>
                  ))}
              </Box>

              {/* Footer Info */}
              <Box
                sx={{
                  padding: '20px 0',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  textAlign: 'center',
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: '#94a3b8',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                  }}
                >
                  Scientific Analysis Platform
                </Typography>
              </Box>
            </Box>
          )}
        </Box>

        {/* Main Content Area */}
        <Box 
          sx={{ 
            flex: 1, 
            height: '94vh', 
            overflowY: 'auto',
            position: 'relative',
            background: '#1a1a1a',
          }}
        >
          {activeComponent === 'dashboard' && <GridComponent />}
          {activeComponent === 'addPlugin' && <UploadFile />}
          
          {plugins.map((plugin, index) => (
            <div key={plugin.instanceId} id={`plugin-container-${index}`}
              style={{ display: activeComponent === plugin.instanceId ? 'block' : 'none' }}>
              Loading
            </div>
          ))}
          <PluginRenderer activeComponent={activeComponent} plugins={plugins} />
        </Box>

        {/* Active Plugin Indicator */}
        {activePlugin && (activePlugin.name || activePlugin.instanceId) !== 'Dashboard' && (
          <Chip
            label={`Active: ${activePlugin.name || activePlugin.instanceId}`}
            sx={{
              position: 'fixed',
              bottom: '20px',
              right: '24px',
              zIndex: 2000,
              px: 3,
              py: 1.5,
              fontSize: '0.875rem',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#fff',
              fontWeight: 600,
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
              textTransform: 'none',
              letterSpacing: '0.025em',
              fontFamily: '"Inter", "Roboto", sans-serif',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 30px rgba(16, 185, 129, 0.4)',
              },
            }}
          />
        )}
      </Box>
    </div>
  );
}
