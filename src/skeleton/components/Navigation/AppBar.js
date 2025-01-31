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
// import NokiCSS from '../UI Components/NokiCSSClass/NokiCSS';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { SuccessMessage } from '../UI Components/AlertMessage';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
import InfoIcon from '@mui/icons-material/Info';
import ListItemText from '@mui/material/ListItemText';
import CloseIcon from '@mui/icons-material/Close';
import { removeNotification,removeAllNotification, addNotification  } from '../../store/notificationSlice';
/**
 * ResponsiveAppBar component
 * 
 * This component renders the app bar with user avatar, menu, and various action buttons.
 * It handles user interactions like logout, navigation, and update checks.
 */

function ResponsiveAppBar() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  // console.log("User from State",user);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [logoutAlertCalled, setLogoutAlertCalled] = useState(false);
  const [avatarName, setAvatarName] = useState('Noki Xtract10');
  const [showIcon, setShowIcon] = useState(true);
  const dispatch = useDispatch();
  const accessLevel = useSelector((state) => state.user.access_level);

  const isDemoMode = useSelector((state) => state.connection_settings.DEMO_MODE);
  // const [updateNotAvailable, setUpdateNotAvailable] = useState(false);
  // const downloadProgress = useSelector((state) => state.DownloadProgress);
  const [open, setOpen] = useState(false);
  const [memoryUsage, setMemoryUsage] = useState(0);
  const [nokiCSS, setNokiCSS] = useState(null);
  const [updateCheckDialog, setUpdateCheckDialog] = useState(false);
  const [updateDownloaded, setUpdateDownloaded] = useState(false);
  const  notifications= useSelector((state) => state.notifications.notifications)
  const [anchorElNotification, setanchorElNotification] = useState(null);


  // useEffect(() => {
  //   const initNokiCSS = async () => {
  //     const cssInstance = new NokiCSS();
  //     await cssInstance.initialize();
  //     setNokiCSS(cssInstance);
  //   };

  //   initNokiCSS();
  // }, []);

  /**
   * Handles the logout process and navigation to signin page.
   */
  const handleLogout = () => {
    logout(user, dispatch);
    eventBus.emit('navigate', '/signin');
  };

  /**
   * Sets the avatar name based on the user's name.
   */
  useEffect(() => {
    setAvatarName(user.name);
  }, [user]);

  /**
   * Closes the logout confirmation dialog.
   */
  const handleLogoutDialogClose = () => {
    setLogoutAlertCalled(false);
    handleCloseUserMenu();
  };

  /**
   * Navigates to the settings page.
   */
  const openSetting = () => {
    handleCloseUserMenu();
    navigate('/settings');
  };

  /**
   * Closes the user menu.
   */
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  /**
   * Opens the logout confirmation dialog.
   */
  function hanldeLogout() {
    setLogoutAlertCalled(true);
  }

  /**
   * Opens the user menu.
   * 
   * @param {Object} event - The event object.
   */
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  /**
   * Navigates to the admin page.
   */
  const openAdmin = () => {
    handleCloseUserMenu();
    navigate('/admin');
  };

  /**
 * Navigates to the about page.
 */
  const openAbout = () => {
    handleCloseUserMenu();
    navigate('/about')
  }

  /**
   * Navigates to the dashboard page.
   */
  const navigateHome = () => {
    navigate('/dashboard');
  };

  /**
   * Sends a reset action.
   */
  const handleRefresh = () => {
    sendAction('Reset')
      .then((res) => {
        console.log("After sending action ", res);
      })
      .catch((err) => {
        console.log("After sending error", err);
      });
  };

  /**
   * Sends a close action.
   */
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

  /**
  * Closes the Notification menu.
  */
    const handleNotificationsClose = () => {
      setanchorElNotification(null);
  
    };
    /**
     * 
     * Handles the notification to remove
     */
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




  /**
   * Monitors memory usage and updates the state every second.
   */
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (window.performance && window.performance.memory) {
        setMemoryUsage(String(window.performance.memory.usedJSHeapSize / 1024 / 1024).substring(0, 5));
      }
    }, 1000); // Updates every second

    return () => clearInterval(intervalId);
  }, []);



  return (
    <div>
      <div>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', backgroundColor: 'black', height: '6vh' }} style={{ minHeight: 0 }}>
          <Box sx={{width: '33%'}}>
            <ConnectionStack />
          </Box>

          <Typography
            variant="h4"
            noWrap
            component="a"
            onClick={navigateHome}
            sx={{
              fontFamily: 'monospace',
              letterSpacing: '.3rem',
              color: 'white',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            MEDLABX{isDemoMode && '(DEMO)'}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '2vw', width: '33%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '1vw', fontSize: '20px', color: 'var(--body_color3)' }}>
              {memoryUsage}
              <RealTimeSwitch />
            </Box>

            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              <IconButton
                aria-label="show notifications"
                style={{
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  padding: 0,
                }}
                onClick={showNotifications}
              >
                <Badge
                  badgeContent={notifications ? notifications.length : 0}
                  color="primary"
                  sx={{
                    "&.MuiBadge-root": {
                      backgroundColor: "black",
                      borderRadius: '50%',
                    },
                  }}
                >
                  <NotificationsIcon sx={{ fontSize: 30, color: 'white' }} />
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
                    width: '300px',
                    marginTop: '12px',
                    borderRadius: '10px',
                    padding: 0,
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
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
                        gap: '1rem',
                        // width: '310px', 
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        padding: '4px 10px ',
                        borderBottom: '1px solid #f0f0f0',
                        '&:last-child': {
                          borderBottom: 0,
                        },
                        '&:hover': {
                          backgroundColor: '#fafafa',
                        },
                      }}
                    >
                      <ListItemText
                        primary={notification.message}
                        primaryTypographyProps={{
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#333',
                        }}
                        sx={{
                          flex: 1,
                          whiteSpace: 'normal',
                          wordBreak: 'break-word',
                          marginBottom: '8px',
                        }}
                      />
                      <IconButton
                        onClick={() => handleRemoveNotification(notification.id)}
                        sx={{
                          padding: '4px',
                          color: '#999',
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
                      padding: '16px',
                      justifyContent: 'center',
                      color: '#999',

                    }}
                  >
                    No notifications
                  </MenuItem>
                )}

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '2px 8px',
                    borderTop: '1px solid #f0f0f0',
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: '500', color: '#666' }}>
                    Clear All
                  </Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => dispatch(removeAllNotification())}
                    sx={{
                      fontSize: '12px',
                      textTransform: 'none',
                      backgroundColor: '#fa7066',
                      '&:hover': {
                        backgroundColor: '#d32f2f',
                      },
                    }}
                  >
                    Clear
                  </Button>
                </Box>
              </Menu>
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                marginTop: '0px',
                paddingRight: '10px',
                backgroundColor: 'transparent',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
                width: 'fit-content',
                zIndex: 999,
              }}
            >
              {showIcon && (
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ padding: '0', backgroundColor: 'transparent' }}>
                    <Avatar alt={avatarName} sx={{ width: 35, height: 35 }} />
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
                    marginTop: '55px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)',
                    minWidth: '200px',
                  },
                }}
              >
                <MenuItem sx={{ minWidth: '200px' }}>
                  <PermIdentityIcon style={{ color: 'red', marginRight: '8px' }} />
                  <Typography variant="body2" sx={{ fontSize: '1.6vh' }}>{avatarName}</Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={openAdmin} disabled={!(user.access_level >= 1)}>
                  <PermIdentityIcon style={{ marginRight: '8px' }} />
                  <Typography variant="body2" sx={{ fontSize: '1.6vh' }}>Users</Typography>
                </MenuItem>
                <MenuItem onClick={openSetting} disabled={!(user.access_level >= 2)}>
                  <SettingsIcon style={{ marginRight: '8px' }} />
                  <Typography variant="body2" sx={{ fontSize: '1.6vh' }}>Settings</Typography>
                </MenuItem>
                <MenuItem onClick={hanldeLogout}>
                  <LogoutIcon style={{ marginRight: '8px' }} />
                  <Typography variant="body2" sx={{ fontSize: '1.6vh' }}>Logout</Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleUpdateClick}>
                  <Box display="flex" alignItems="center">
                    <BrowserUpdatedIcon style={{ marginRight: '8px' }} />
                    <Typography variant="body2" sx={{ fontSize: '1.6vh' }}>
                      Update
                    </Typography>
                    {updateDownloaded && <HelpOutlineIcon style={{ marginLeft: 1, verticalAlign: 'middle', color: 'green' }} />}
                  </Box>
                </MenuItem>
                <Divider />
                <MenuItem>
                  <RefreshIcon style={{ marginRight: '8px' }} />
                  <Typography variant="body2" sx={{ fontSize: '1.6vh' }} onClick={handleRefresh}>Restart</Typography>
                </MenuItem>
                <Divider />
                <MenuItem>
                  <ExitToAppIcon style={{ marginRight: '8px' }} />
                  <Typography variant="body2" sx={{ fontSize: '1.6vh' }} onClick={handleClose}>Exit</Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={openAbout}>
                  <InfoIcon style={{ marginRight: '8px' }} />
                  <Typography variant="body2" sx={{ fontSize: '1.6vh' }}>About</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        </Toolbar>

        <Dialog open={logoutAlertCalled} onClose={handleLogoutDialogClose}>
          <DialogTitle>Confirm Logout</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to logout?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleLogoutDialogClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleLogout} color="primary" autoFocus>
              Logout
            </Button>
          </DialogActions>
        </Dialog>
      </div>



      {updateDownloaded && (
        <Dialog open={updateCheckDialog} onClose={() => setUpdateCheckDialog(false)}>
          <DialogTitle>Update Info</DialogTitle>
          <DialogContent>
            <div>
              Update is available, Do you want to quit and install?
            </div>
          </DialogContent>
          <DialogActions>
            <button
              onClick={() => handleInstallNow()}
              style={{ ...nokiCSS.getButton('cancel', accessLevel, 3) }}>Yes</button>

            <button
              onClick={() => handleInstallLater()}
              style={{ ...nokiCSS.getButton('cancel', accessLevel, 3) }}>No</button>
          </DialogActions>
        </Dialog>
      )}


      {!updateDownloaded && (
        <Dialog open={updateCheckDialog} onClose={() => setUpdateCheckDialog(false)}>
          <DialogTitle>Update Info</DialogTitle>
          <DialogContent>
            <div>
              No updates are available at the moment!!
            </div>
          </DialogContent>
        </Dialog>
      )}


    </div>
  );
}

export default ResponsiveAppBar;