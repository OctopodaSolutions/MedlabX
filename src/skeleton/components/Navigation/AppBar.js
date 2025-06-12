
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import RefreshIcon from '@mui/icons-material/Refresh';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { sendAction, check_if_updated_downloaded, installUpdate, checkIfUpdateAvailable, checkIfUpdateDownloaded, quitandInstallFromLocal } from '../../functions/API Calls/database_calls';
import { useEffect, useState } from 'react';
import React from 'react';
import ConnectionStack from './ConnectionState';
import BrowserUpdatedIcon from '@mui/icons-material/BrowserUpdated';
import { logout } from '../../functions/User Access Functions/logout_service';
import { eventBus } from '../../functions/User Access Functions/event_bus';
import RealTimeSwitch from './RealTimeSwitch';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { SuccessMessage } from '../UI Components/AlertMessage';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
import InfoIcon from '@mui/icons-material/Info';
import ListItemText from '@mui/material/ListItemText';
import CloseIcon from '@mui/icons-material/Close';
import KeyIcon from '@mui/icons-material/Key';
import { removeNotification, removeAllNotification, addNotification } from '../../store/notificationSlice';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import ScienceIcon from '@mui/icons-material/Science';

function ResponsiveAppBar() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [logoutAlertCalled, setLogoutAlertCalled] = useState(false);
  const [avatarName, setAvatarName] = useState('Medical Professional');
  const [showIcon, setShowIcon] = useState(true);
  const dispatch = useDispatch();
  const accessLevel = useSelector((state) => state.user.access_level);

  const isDemoMode = useSelector((state) => state.connection_settings.DEMO_MODE);
  const [open, setOpen] = useState(false);
  const [memoryUsage, setMemoryUsage] = useState("0");
  const [updateCheckDialog, setUpdateCheckDialog] = useState(false);
  const [updateDownloaded, setUpdateDownloaded] = useState(false);
  const notifications = useSelector((state) => state.notifications.notifications)
  const [anchorElNotification, setanchorElNotification] = useState(null);

  const handleLogout = () => {
    logout(user, dispatch);
    eventBus.emit('navigate', '/signin');
  };

  const handleLicenseClick = () => {
    handleCloseUserMenu();
    navigate('/license');
  }

  useEffect(() => {
    setAvatarName(user.name || 'Medical Professional');
  }, [user]);

  const handleLogoutDialogClose = () => {
    setLogoutAlertCalled(false);
    handleCloseUserMenu();
  };

  const openSetting = () => {
    handleCloseUserMenu();
    navigate('/settings');
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  function hanldeLogout() {
    setLogoutAlertCalled(true);
  }

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const openAdmin = () => {
    handleCloseUserMenu();
    navigate('/admin');
  };

  const openAbout = () => {
    handleCloseUserMenu();
    navigate('/about')
  }

  const navigateHome = () => {
    navigate('/dashboard');
  };

  const handleRefresh = () => {
    sendAction('Reset')
      .then((res) => {
        console.log("After sending action ", res);
      })
      .catch((err) => {
        console.log("After sending error", err);
      });
  };

  const handleClose = () => {
    sendAction('Close')
      .then((res) => {
        console.log("After sending action ", res);
      })
      .catch((err) => {
        console.log("After sending error", err);
      });
  };

  const showNotifications = (event) => {
    setanchorElNotification(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setanchorElNotification(null);
  };

  const handleRemoveNotification = (id) => {
    dispatch(removeNotification(id))
  }

  const handleUpdateClick = () => {
    checkIfUpdateDownloaded().then((res) => {
      if (res.success && res.data.updateDownloaded) {
        console.log('Update available:', res.data);
        setUpdateCheckDialog(true)
      } else if (!res.data.updateStream) {
        console.log('No update available');
        setUpdateCheckDialog(true)
        checkIfUpdateAvailable().then((res) => {
          console.log('checking started and if found will be downloaded')
          setUpdateDownloaded(false);
        })
      }
    }).catch((error) => {
      console.log('Error checking update:', error);
    });
  };

  const handleInstallNow = () => {
    quitandInstallFromLocal().then((res) => {
      if (res.success) {
        console.log('quit and called', res)
      }
    })
    setUpdateCheckDialog(false)
  }

  const handleInstallLater = () => {
    console.log('download later clicked')
    setUpdateCheckDialog(false);
  }

  useEffect(() => {
    checkIfUpdateDownloaded().then((res) => {
      if (res.success && res.data.updateDownloaded) {
        setUpdateDownloaded(true);
        SuccessMessage("Update Available");
        console.log('Update downloaded status:', res.data.updateDownloaded);
      } else {
        setUpdateDownloaded(false);
      }
    }).catch((error) => {
      console.error('Error checking if update downloaded:', error);
    });
  }, []);

  useEffect(() => {
    setMemoryUsage("0");

    const intervalId = setInterval(() => {
      if (window.performance && window.performance.memory) {
        setMemoryUsage(
          String(window.performance.memory.usedJSHeapSize / 1024 / 1024).substring(0, 5)
        );
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <div>
        <Toolbar 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
            height: '6vh',
            borderBottom: '1px solid #2d2d2d',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          }} 
          style={{ minHeight: 0 }}
        >
          <Box sx={{ width: '33%', display: 'flex', alignItems: 'center' }}>
            <ConnectionStack />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ScienceIcon sx={{ fontSize: 32, color: '#3b82f6' }} />
            <Typography
              variant="h4"
              noWrap
              component="a"
              onClick={navigateHome}
              sx={{
                fontFamily: '"Inter", "Roboto", sans-serif',
                letterSpacing: '.15rem',
                color: '#e2e8f0',
                textDecoration: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '1.5rem',
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: '#3b82f6',
                  transform: 'scale(1.02)',
                },
              }}
            >
              MEDLABX
              {isDemoMode && (
                <Typography 
                  component="span" 
                  sx={{ 
                    fontSize: '0.75rem', 
                    color: '#f59e0b',
                    fontWeight: 600,
                    marginLeft: '8px',
                    background: 'rgba(245, 158, 11, 0.1)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                  }}
                >
                  DEMO
                </Typography>
              )}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '20px', width: '33%' }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '16px', 
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MonitorHeartIcon sx={{ fontSize: 18, color: '#10b981' }} />
                <Typography sx={{ 
                  fontSize: '0.875rem', 
                  color: '#e2e8f0',
                  fontWeight: 600,
                  fontFamily: '"Inter", "Roboto", sans-serif',
                }}>
                  {memoryUsage} MB
                </Typography>
              </Box>
              <RealTimeSwitch />
            </Box>

            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              <IconButton
                aria-label="show notifications"
                onClick={showNotifications}
                sx={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  '&:hover': {
                    background: 'rgba(59, 130, 246, 0.2)',
                  },
                }}
              >
                <Badge
                  badgeContent={notifications ? notifications.length : 0}
                  color="error"
                  sx={{
                    '& .MuiBadge-badge': {
                      background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                    },
                  }}
                >
                  <NotificationsIcon sx={{ fontSize: 22, color: '#e2e8f0' }} />
                </Badge>
              </IconButton>

              <Menu
                anchorEl={anchorElNotification}
                open={Boolean(anchorElNotification)}
                onClose={handleNotificationsClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
                PaperProps={{
                  sx: {
                    maxHeight: '400px',
                    width: '320px',
                    marginTop: '8px',
                    borderRadius: '12px',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <MenuItem
                      key={notification.id}
                      onClick={(e) => e.stopPropagation()}
                      sx={{
                        display: 'flex',
                        gap: '12px',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        padding: '12px 16px',
                        borderBottom: '1px solid #f1f5f9',
                        '&:last-child': {
                          borderBottom: 0,
                        },
                        '&:hover': {
                          backgroundColor: '#f8fafc',
                        },
                      }}
                    >
                      <ListItemText
                        primary={notification.message}
                        primaryTypographyProps={{
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          color: '#374151',
                          fontFamily: '"Inter", "Roboto", sans-serif',
                        }}
                        sx={{
                          flex: 1,
                          whiteSpace: 'normal',
                          wordBreak: 'break-word',
                        }}
                      />
                      <IconButton
                        onClick={() => handleRemoveNotification(notification.id)}
                        sx={{
                          padding: '4px',
                          color: '#6b7280',
                          '&:hover': {
                            color: '#dc2626',
                            background: 'rgba(220, 38, 38, 0.1)',
                          },
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem
                    onClick={handleNotificationsClose}
                    sx={{
                      padding: '20px',
                      justifyContent: 'center',
                      color: '#6b7280',
                    }}
                  >
                    <Typography sx={{ fontFamily: '"Inter", "Roboto", sans-serif' }}>
                      No notifications
                    </Typography>
                  </MenuItem>
                )}

                {notifications.length > 0 && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 16px',
                      borderTop: '1px solid #f1f5f9',
                      background: '#f8fafc',
                    }}
                  >
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: '600', 
                        color: '#374151',
                        fontFamily: '"Inter", "Roboto", sans-serif',
                      }}
                    >
                      Clear All
                    </Typography>
                    <Button
                      onClick={() => dispatch(removeAllNotification())}
                      sx={{
                        fontSize: '0.75rem',
                        textTransform: 'none',
                        background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                        color: '#fff',
                        fontWeight: 600,
                        borderRadius: '6px',
                        padding: '4px 12px',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)',
                        },
                      }}
                    >
                      Clear
                    </Button>
                  </Box>
                )}
              </Menu>
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '4px',
              }}
            >
              {showIcon && (
                <Tooltip title="User Menu">
                  <IconButton 
                    onClick={handleOpenUserMenu} 
                    sx={{ 
                      padding: '4px',
                      '&:hover': {
                        background: 'rgba(59, 130, 246, 0.2)',
                      },
                    }}
                  >
                    <Avatar 
                      alt={avatarName} 
                      sx={{ 
                        width: 32, 
                        height: 32,
                        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                      }} 
                    />
                  </IconButton>
                </Tooltip>
              )}
              <Menu
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                getContentAnchorEl={null}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                PaperProps={{
                  sx: {
                    marginTop: '48px',
                    borderRadius: '12px',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    minWidth: '220px',
                  },
                }}
              >
                <MenuItem sx={{ minWidth: '220px', padding: '12px 16px' }}>
                  <PermIdentityIcon sx={{ color: '#3b82f6', marginRight: '12px', fontSize: 20 }} />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#374151',
                      fontFamily: '"Inter", "Roboto", sans-serif',
                    }}
                  >
                    {avatarName}
                  </Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={openAdmin} disabled={user.access_level < 2}>
                  <PermIdentityIcon sx={{ marginRight: '12px', fontSize: 20, color: '#6b7280' }} />
                  <Typography variant="body2" sx={{ fontSize: '0.875rem', fontFamily: '"Inter", "Roboto", sans-serif' }}>Users</Typography>
                </MenuItem>
                <MenuItem onClick={openSetting} disabled={user.access_level < 3}>
                  <SettingsIcon sx={{ marginRight: '12px', fontSize: 20, color: '#6b7280' }} />
                  <Typography variant="body2" sx={{ fontSize: '0.875rem', fontFamily: '"Inter", "Roboto", sans-serif' }}>Settings</Typography>
                </MenuItem>
                <MenuItem onClick={hanldeLogout}>
                  <LogoutIcon sx={{ marginRight: '12px', fontSize: 20, color: '#6b7280' }} />
                  <Typography variant="body2" sx={{ fontSize: '0.875rem', fontFamily: '"Inter", "Roboto", sans-serif' }}>Logout</Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleUpdateClick} disabled={user.access_level < 3}>
                  <Box display="flex" alignItems="center">
                    <BrowserUpdatedIcon sx={{ marginRight: '12px', fontSize: 20, color: '#6b7280' }} />
                    <Typography variant="body2" sx={{ fontSize: '0.875rem', fontFamily: '"Inter", "Roboto", sans-serif' }}>
                      Update
                    </Typography>
                    {updateDownloaded && <HelpOutlineIcon sx={{ marginLeft: 1, fontSize: 16, color: '#10b981' }} />}
                  </Box>
                </MenuItem>
                <MenuItem onClick={handleLicenseClick} disabled={user.access_level < 3}>
                  <KeyIcon sx={{ marginRight: '12px', fontSize: 20, color: '#6b7280' }} />
                  <Typography variant="body2" sx={{ fontSize: '0.875rem', fontFamily: '"Inter", "Roboto", sans-serif' }}>License</Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleRefresh}>
                  <RefreshIcon sx={{ marginRight: '12px', fontSize: 20, color: '#6b7280' }} />
                  <Typography variant="body2" sx={{ fontSize: '0.875rem', fontFamily: '"Inter", "Roboto", sans-serif' }}>Restart</Typography>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <ExitToAppIcon sx={{ marginRight: '12px', fontSize: 20, color: '#6b7280' }} />
                  <Typography variant="body2" sx={{ fontSize: '0.875rem', fontFamily: '"Inter", "Roboto", sans-serif' }}>Exit</Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={openAbout}>
                  <InfoIcon sx={{ marginRight: '12px', fontSize: 20, color: '#6b7280' }} />
                  <Typography variant="body2" sx={{ fontSize: '0.875rem', fontFamily: '"Inter", "Roboto", sans-serif' }}>About</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        </Toolbar>

        <Dialog 
          open={logoutAlertCalled} 
          onClose={handleLogoutDialogClose}
          PaperProps={{
            sx: {
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
            }
          }}
        >
          <DialogTitle sx={{ fontFamily: '"Inter", "Roboto", sans-serif', fontWeight: 600 }}>
            Confirm Logout
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ fontFamily: '"Inter", "Roboto", sans-serif' }}>
              Are you sure you want to logout from the medical laboratory system?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={handleLogoutDialogClose} 
              sx={{ 
                textTransform: 'none',
                fontFamily: '"Inter", "Roboto", sans-serif',
                fontWeight: 600,
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleLogout} 
              sx={{ 
                textTransform: 'none',
                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                color: '#fff',
                fontFamily: '"Inter", "Roboto", sans-serif',
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)',
                },
              }}
              autoFocus
            >
              Logout
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      {updateDownloaded && (
        <Dialog open={updateCheckDialog} onClose={() => setUpdateCheckDialog(false)}>
          <DialogTitle sx={{ fontFamily: '"Inter", "Roboto", sans-serif', fontWeight: 600 }}>
            System Update Available
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ fontFamily: '"Inter", "Roboto", sans-serif' }}>
              A system update is available. Would you like to quit and install now?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button 
              variant='outlined' 
              onClick={() => handleInstallNow()}
              sx={{ 
                textTransform: 'none',
                fontFamily: '"Inter", "Roboto", sans-serif',
                fontWeight: 600,
              }}
            >
              Install Now
            </Button>
            <Button 
              variant='outlined' 
              onClick={() => handleInstallLater()}
              sx={{ 
                textTransform: 'none',
                fontFamily: '"Inter", "Roboto", sans-serif',
                fontWeight: 600,
              }}
            >
              Later
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {!updateDownloaded && (
        <Dialog open={updateCheckDialog} onClose={() => setUpdateCheckDialog(false)}>
          <DialogTitle sx={{ fontFamily: '"Inter", "Roboto", sans-serif', fontWeight: 600 }}>
            System Update Status
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ fontFamily: '"Inter", "Roboto", sans-serif' }}>
              No system updates are available at this time. Your laboratory software is up to date.
            </Typography>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default ResponsiveAppBar;
