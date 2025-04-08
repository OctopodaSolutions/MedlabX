import React, { useState, useEffect } from 'react';
// import Paper from '@mui/material/Paper';
import { changeUserMembership, getAllUsers, deleteUser, userPasswordChange, performUserSignUp } from '../../functions/User Access Functions/user_functions';
import Fab from '@mui/material/Fab';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';
import { Box, styled } from '@mui/system';
import {
  Button, Dialog, DialogActions, DialogContent,
  DialogTitle, FormControl, Grid, IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput, Paper, Select, TextField, Tooltip,
  Typography,TableFooter,TableRow, TableCell
} from '@mui/material';
import MUIDataTable from 'mui-datatables';
import { GridToolbar } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { ErrorMessage, SuccessMessage } from '../UI Components/AlertMessage';
import { useSelector } from 'react-redux';

/**
 * A custom styled MUI DataTable component.
 * 
 * This component applies specific padding and font size styles to the table cells.
 * 
 * @component
 * @example
 * return (
 *   <CustomMUIDataTable data={data} columns={columns} />
 * )
 */
const CustomMUIDataTable = styled(MUIDataTable)({
  /**
   * Styles applied to the root element of each table cell.
   * 
   * @type {Object}
   * @property {number} padding - Padding of 7 pixels.
   * @property {string} fontSize - Font size of 1.2rem.
   */
  '& .MuiTableCell-root': {
    padding: 7,
    fontSize: '1.2rem'
  },
});

const CustomFooter = ({ openDialog }) => (
  <TableFooter>
    <TableRow>
      <TableCell colSpan={100} align="right">
        <Tooltip title="Add New">
          <Button onClick={openDialog} color="primary">
            Add User
          </Button>
        </Tooltip>
      </TableCell>
    </TableRow>
  </TableFooter>
);

/**
 * Component for managing and displaying user details.
 * 
 * @component
 * @returns {JSX.Element} UsersDetails component.
 */
export default function UsersDetails() {
  const [rows, setRows] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [addUserOpen, SetAdduserOpen] = useState(false);
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [user, setUser] = useState("");
  const [userForPasswordChange, setUserForPasswordChange] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const currentUser = useSelector((state) => (state.user));

  // for adding new user
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");
  const [access_level, setAccessLevel] = useState("");

  // handle new user add
  const handleAddUser = (event) => {
    event.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    console.log("Submit SignIn Form");
    console.log(firstName, access_level);
    if (!firstName) {
      ErrorMessage('First Name cannot be empty');
      return;
    } else if (!emailRegex.test(email)) {
      ErrorMessage('Please enter a valid email address');
      return;
    } else if (!lastName) {
      ErrorMessage('Last Name cannot be empty');
      return;
    } else if (!email) {
      ErrorMessage('Email not provided');
      return;
    } else if (!password) {
      ErrorMessage('Password not Provided');
      return;
    } else if (password.length <= 6) {
      ErrorMessage('Password length is less than 6 characters!');
      return;
    } else if (!confirm_password) {
      ErrorMessage('Confirm your password again');
      return;
    } else if (confirm_password.length <= 6) {
      ErrorMessage('Confirm password length is less than 6 characters!');
      return;
    } else if (confirm_password !== password) {
      ErrorMessage('Confirm password should match with password')
    } else if (!access_level) {
      ErrorMessage('Please select access level')
      return;
    }

    if (confirm_password === password) {
      console.log("Passwords Match");
      performUserSignUp(firstName + " " + lastName, password, 0, access_level, '', email).then((res) => {
        if (res.success) {
          let userType = ''
          if (access_level == 1) {
            userType = 'Support';
          } else if (access_level == 2) {
            userType = 'User';
          } else {
            userType = 'Engineer';
          }
          SuccessMessage(`Accounted created for ${userType} successfully`);
          console.log(res);
          resetFields();
        } else {
          ErrorMessage(`Error in adding User ${res.message}`);
          console.log(res);
        }
      }).catch((err) => {
        console.log(err);
        ErrorMessage(`Error in adding User ${err}`);
      });
    }
  }

  //reset fields for new user adding
  const resetFields = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setAccessLevel("");
  }

  /**
   * Toggle the visibility of the password.
   */
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  /**
   * Prevent default behavior for the mouse down event on password visibility icon.
   * 
   * @param {React.MouseEvent} event - The mouse event.
   */
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /**
   * Toggle the visibility of the confirm password.
   */
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

  /**
   * Prevent default behavior for the mouse down event on confirm password visibility icon.
   * 
   * @param {React.MouseEvent} event - The mouse event.
   */
  const handleMouseDownConfirmPassword = (event) => {
    event.preventDefault();
  };

  /**
   * Create user row data for the table.
   * 
   * @param {number} id - User ID.
   * @param {string} name - User name.
   * @param {string} UID - User UID.
   * @param {number} access_level - Access level of the user.
   * @param {string} designation - User designation.
   * @param {number} membership - Membership status.
   * @param {string} email - User email.
   * @param {string} last_login - Last login time.
   * @returns {Object} User row data.
   */
  const createUserRows = (id, name, UID, access_level, designation, membership, email, last_login) => {
    let d = "";
    if (access_level === 1) d = "User";
    else if (access_level === 2) d = "Administrator";
    else if (access_level == 3) d = "Engineer";
    else d = "Unknown";
    return {
      id, name, UID, access_level, d, membership, email, last_login
    }
  }

  const columns = [
    {
      label: 'UID',
      name: 'UID',
      options: {
        filter: true,
        sort: true,
        display: false
      }
    },
    {
      label: 'S No.',
      name: 'id',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      label: 'Name',
      name: 'name',
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      label: 'Email',
      name: 'email',
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      label: 'User ID',
      name: 'email',
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      label: 'Designation',
      name: 'd',
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      label: 'Membership',
      name: 'membership',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          if (value === 1) {
            return (
              <Typography>Added</Typography>
            );
          }
          else {
            return (
              <Typography>Not Added</Typography>
            );
          }
        },
      },
    },
    {
      label: 'Update Membership',
      name: 'membership',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          if (value === 1) {
            return (
              <Tooltip title="Revoke Membership" >
                <IconButton onClick={() => changeMembership(tableMeta, 0)} size="large" disabled={currentUser.UID === tableMeta.rowData[0] || currentUser.access_level == 1}>
                  <ClearIcon />
                </IconButton>
              </Tooltip>
            );
          }
          else {
            return (
              <Tooltip title="Add Member">
                <IconButton onClick={() => changeMembership(tableMeta, 1)} size="large" disabled={currentUser.UID === tableMeta.rowData[0] || currentUser.access_level == 1}>
                  <DoneIcon />
                </IconButton>
              </Tooltip>
            );
          }
        },
      },
    },
    {
      label: 'Actions',
      name: 'edit',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div >
              <Tooltip title="Change Password">
                <Fab aria-label="edit" disabled={currentUser.access_level == 1} onClick={() => editAction(tableMeta)}>
                  <EditIcon />
                </Fab>
              </Tooltip>
            </div>
          )
        },
      },
    }
  ];

  /**
   * Change the membership status of a user.
   * 
   * @param {Object} tableMeta - Metadata of the table row.
   * @param {number} value - The new membership value.
   */
  const changeMembership = (tableMeta, value) => {
    changeUserMembership({ UID: tableMeta.rowData[0], membership: value, action: 'changeMembership' }).then((res) => {
      getUserDetails();
    }).catch((err) => {
      console.log(err);
    })
  }

  /**
   * Handle the action of editing a user.
   * 
   * @param {Object} tableMeta - Metadata of the table row.
   */
  const editAction = (tableMeta) => {
    setUserForPasswordChange(tableMeta.rowData[0]);
    setUser(tableMeta.rowData[2]);
    setOpenEdit(true);
  }

  /**
   * Close the edit dialog.
   */
  const handleCloseEdit = () => {
    setOpenEdit(false);
  }

  /**
   * Reset the dialog state and close it.
   */
  const resetAndCloseDialog = () => {
    setOpenEdit(false);
    setUser("");
    setUserForPasswordChange("");
    setPass("");
    setConfirmPass("");
    setShowConfirmPassword(false);
    setShowPassword(false);
  }

  const options = {
    filterType: 'checkbox',
    expandableRows: false,
    expandableRowsHeader: false,
    expandableRowsOnClick: false,
    selectableRows: 'single',
    selectableRowsOnClick: true,
    onRowsDelete: (deleteObj) => {
      // Check if currentUser's access level is 1
      if (currentUser.access_level === 1) {
        // If access level is 1, disable delete
        return false; // Prevent deletion
      } else {
        // Otherwise, proceed with the delete
        executeDelete(rows[deleteObj.data[0].dataIndex].UID);
      }
    },
    customFooter: () => <CustomFooter openDialog={handleDialogOpen} />,
  };
  const handleDialogOpen = () => currentUser.access_level == 1?null: SetAdduserOpen(true);
  /**
   * Execute the delete action for a user.
   * 
   * @param {string} uid - The UID of the user to delete.
   */
  const executeDelete = (uid) => {
    deleteUser(uid).then(() => {
      SuccessMessage("User Deleted Successfully");
    }).catch(() => {
      ErrorMessage("Unable to Delete User");
    }).finally(() => {
      getUserDetails();
    });
  }

  /**
   * Fetch user details and set the state.
   */
  const getUserDetails = () => {
    getAllUsers()
      .then((res) => {
        let temp = [];
        res.data.forEach((t) => {
          temp.push(createUserRows(temp.length + 1, t.name, t.UID, t.access_level, t.d, t.membership, t.email, t.last_login));
        });
        setRows(temp);
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    getUserDetails();
  }, []);

  /**
   * Handle the save action for editing a user.
   */
  const handleSaveEdit = () => {
    if (pass === confirmPass) {
      if (pass.length < 6) {
        ErrorMessage("Password Too Short");
      }
      else {
        userPasswordChange(userForPasswordChange, pass).then((res) => {
          if (res.success) {
            SuccessMessage("Changing Password Complete");
            resetAndCloseDialog();
          }
          else {
            ErrorMessage('Error in Setting Password');
          }
        })
          .catch((err) => {
            ErrorMessage(err);
          });
      }
    }
    else {
      ErrorMessage("Passwords Mismatch");
    }
  }

  return (
    <div style={{
      backgroundImage: 'linear-gradient(to right, rgb(39, 39, 39),rgb(0, 0, 0))',
      // backgroundColor: '#d5e5e5',
      color: 'var(--body_color)',
      overflowY: 'auto',
      backdropfilter: 'blur(8.6px)',
      WebkitBackdropFilter: 'blur(8.6px)', height: '94vh'
    }}>
      <Box sx={{ padding: 5 }}>
        <Paper>
          <CustomMUIDataTable
            columns={columns}
            data={rows}
            title='Users'
            options={options}
            components={{
              Toolbar: GridToolbar,
            }}
          />



        </Paper>
      </Box>
      <Paper>

      </Paper>
      <Dialog
        open={openEdit}
        onClose={handleCloseEdit}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        PaperProps={{
          sx: {
            // backgroundColor: 'rgba(255, 255, 255, 0.7)', // Medium transparent white background
            backdropFilter: 'blur(10px)', // Adds a blur effect to the background
            boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)', // Box shadow for elevation
            borderRadius: '12px', // Rounded corners
          },
        }}
      >
        <DialogTitle
          className='bordered-text'
        >
            Change Password
        </DialogTitle>
        <DialogContent
          sx={{
            marginTop: 2,
            color: '#555', // Slightly grey text color for content
            padding: '20px', // Increased padding
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          <Box>
            <TextField
              autoFocus
              margin="dense"
              id="uname"
              label="Username"
              variant="standard"
              disabled
              value={user}
              InputProps={{
                readOnly: true,
                disableUnderline: true, // This removes the underline/border
                sx: { input: { fontSize: '1.2rem', color: 'var(--body_color1)' } }, // Set input text size
              }}
              InputLabelProps={{
                sx: { fontSize: '1.2rem' } // Set label text size
              }}
              sx={{
                '& .MuiInputLabel-root': {
                  color: 'black',
                  fontSize: '1.55vh',
                },
                '& .MuiOutlinedInput-root': {
                  '& input': {
                    color: 'black',
                    fontSize: '1.55vh',
                  },
                },
              }}
            />
          </Box>
          <Box >
            <FormControl variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password" sx={{ fontSize: '1.2rem' }}>Password</InputLabel>
              <OutlinedInput
                id="pass"
                label="Password"
                onChange={(e) => setPass(e.target.value)}
                type={showPassword ? 'text' : 'password'}
                sx={{ fontSize: '1.5rem' }} // Set text size
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Box>
          <Box >
            <FormControl variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password" sx={{ fontSize: '1.2rem' }}>Confirm Password</InputLabel>
              <OutlinedInput
                id="confirm-pass"
                label="Confirm Password"
                onChange={(e) => setConfirmPass(e.target.value)}
                type={showConfirmPassword ? 'text' : 'password'}
                sx={{ fontSize: '1.5rem' }} // Set text size
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowConfirmPassword}
                      onMouseDown={handleMouseDownConfirmPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            display: 'flex', gap: '10px'
          }}
        >
          <Button
            onClick={handleCloseEdit}
            sx={{
              // backgroundColor: '#e0e0e0', // Light grey for cancel button
              color: '#333', // Dark text color
              border: '1px solid #ccc',
              // fontSize: '1rem', // Increased font size
              // padding: '10px 20px', // Increased padding
              '&:hover': {
                backgroundColor: '#d0d0d0', // Slightly darker grey on hover
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveEdit}
            variant='outlined'
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={addUserOpen}
        onClose={() => SetAdduserOpen(false)}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        PaperProps={{
          sx: {
            // backgroundColor: 'rgba(255, 255, 255, 0.7)', // Medium transparent white background
            backdropFilter: 'blur(10px)', // Adds a blur effect to the background
            boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)', // Box shadow for elevation
            borderRadius: '12px', // Rounded corners
          },
        }}
      >
        <DialogTitle
          className='bordered-text'
        >
          Add New User
        </DialogTitle>
        <DialogContent
          sx={{
            marginTop: 2,
            color: '#555', // Slightly grey text color for content
            padding: '20px', // Increased padding
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          <Box component="form" noValidate sx={{ mt: 1, justifyContent: 'space-evenly', display: '-ms-flexbox', marginLeft: 'auto', width: 1 }}>
            <Box sx={{ alignItems: 'center', textAlign: 'center', width: 'inherit', marginBottom: 1, marginTop: 1 }}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                onChange={event => setFirstName(event.target.value)}
                autoFocus
                sx={{
                  '& .MuiInputLabel-root': {
                    color: 'black',
                    fontSize: '1.55vh',
                  },
                  '& .MuiOutlinedInput-root': {
                    '& input': {
                      color: 'black',
                      fontSize: '1.55vh',
                    },
                  },
                }}
              />
            </Box>

            <Box sx={{ alignItems: 'center', textAlign: 'center', width: 'inherit', marginBottom: 1, marginTop: 1 }}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                onChange={event => setLastName(event.target.value)}
                autoComplete="lname"
                sx={{
                  '& .MuiInputLabel-root': {
                    color: 'black',
                    fontSize: '1.55vh',
                  },
                  '& .MuiOutlinedInput-root': {
                    '& input': {
                      color: 'black',
                      fontSize: '1.55vh',
                    },
                  },
                }}
              />
            </Box>

            <Box sx={{ alignItems: 'center', textAlign: 'center', width: 'inherit', marginBottom: 1, marginTop: 1 }}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                onChange={event => setEmail(event.target.value)}
                autoComplete="email"
                sx={{
                  '& .MuiInputLabel-root': {
                    color: 'black',
                    fontSize: '1.55vh',
                  },
                  '& .MuiOutlinedInput-root': {
                    '& input': {
                      color: 'black',
                      fontSize: '1.55vh',
                    },
                  },
                }}
              />
            </Box>

            <Box sx={{ alignItems: 'center', textAlign: 'center', width: 'inherit', marginBottom: 1, marginTop: 1 }}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                onChange={event => setPassword(event.target.value)}
                autoComplete="current-password"
                sx={{
                  '& .MuiInputLabel-root': {
                    color: 'black',
                    fontSize: '1.55vh',
                  },
                  '& .MuiOutlinedInput-root': {
                    '& input': {
                      color: 'black',
                      fontSize: '1.55vh',
                    },
                  },
                }}
              />
            </Box>

            <Box sx={{ alignItems: 'center', textAlign: 'center', width: 'inherit', marginBottom: 1, marginTop: 1 }}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="confirm_password"
                label="Confirm Password"
                type="password"
                id="confirm_password"
                onChange={event => setConfirmPassword(event.target.value)}
                autoComplete="current-password"
                sx={{
                  '& .MuiInputLabel-root': {
                    color: 'black',
                    fontSize: '1.55vh',
                  },
                  '& .MuiOutlinedInput-root': {
                    '& input': {
                      color: 'black',
                      fontSize: '1.55vh',
                    },
                  },
                }}
              />
            </Box>
            <Box sx={{ width: 'inherit', marginBottom: 1, marginTop: 1 }}>
              <FormControl sx={{
                m: 1, width: 300, '& label': { color: 'white' },
                '& input': { color: 'white' },
              }}>
                <InputLabel id="demo-multiple-name-label" sx={{ fontSize: '1.55vh' }}>Access Level</InputLabel>
                <Select
                  value={access_level}
                  onChange={event => setAccessLevel(event.target.value)}
                  input={
                    <OutlinedInput
                      label="Access Level"

                      classes={{
                        root: 'outlined-input',
                      }}
                      sx={{
                        '& .MuiInputLabel-root': {
                          color: 'black', fontSize: '1.55vh',
                        },
                        '& .MuiOutlinedInput-root': {
                          '& input': {
                            color: 'black', fontSize: '1.55vh',
                          },
                        },
                      }}
                    />
                  }
                  MenuProps={{
                    classes: {
                      paper: 'dark-menu',
                    },
                  }}
                  sx={{
                    '& .MuiInputLabel-root': {
                      color: 'black', fontSize: '1.55vh',
                    },
                    '& .MuiOutlinedInput-root': {
                      '& input': {
                        color: 'black', fontSize: '1.55vh',
                      },
                    },
                  }}
                >
                  <MenuItem value={1} sx={{ fontSize: '1.55vh' }}>User</MenuItem>
                  <MenuItem value={2} sx={{ fontSize: '1.55vh' }}>Administrator</MenuItem>
                  <MenuItem value={3} sx={{ fontSize: '1.55vh' }}>Engineer</MenuItem>
                </Select>
              </FormControl>
            </Box>

          </Box>
        </DialogContent>
        <DialogActions
        >
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button
              onClick={() => SetAdduserOpen(false)}
              sx={{
                // backgroundColor: '#e0e0e0', // Light grey for cancel button
                color: '#333', // Dark text color
                border: '1px solid #ccc',
                // fontSize: '1rem', // Increased font size
                // padding: '10px 20px', // Increased padding
                '&:hover': {
                  backgroundColor: '#d0d0d0', // Slightly darker grey on hover
                },
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="outlined"
              onClick={handleAddUser}
            >
              Submit
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </div >
  );
}