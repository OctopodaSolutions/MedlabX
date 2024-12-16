import React, { useState, useEffect } from 'react';
// import Paper from '@mui/material/Paper';
import { changeUserMembership, getAllUsers, deleteUser, userPasswordChange } from '../../functions/User Access Functions/user_functions';
import Fab from '@mui/material/Fab';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';
import { Box, styled } from '@mui/system';
import {
  Button, Dialog, DialogActions, DialogContent,
  DialogTitle, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Tooltip
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

/**
 * Component for managing and displaying user details.
 * 
 * @component
 * @returns {JSX.Element} UsersDetails component.
 */
export default function UsersDetails() {
  const [rows, setRows] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [user, setUser] = useState("");
  const [userForPasswordChange, setUserForPasswordChange] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const currentUser = useSelector((state) => (state.user));

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
    if (access_level === 0) d = "User";
    else if (access_level === 1) d = "Administrator";
    else if (access_level >= 2) d = "Engineer";
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
              <Tooltip title="Revoke Membership" >
                <IconButton onClick={() => changeMembership(tableMeta, 0)} size="large" disabled={currentUser.UID === tableMeta.rowData[0]}>
                  <ClearIcon />
                </IconButton>
              </Tooltip>
            );
          }
          else {
            return (
              <Tooltip title="Add Member">
                <IconButton onClick={() => changeMembership(tableMeta, 1)} size="large" disabled={currentUser.UID === tableMeta.rowData[0]}>
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
                <Fab aria-label="edit" onClick={() => editAction(tableMeta)}>
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
      executeDelete(rows[deleteObj.data[0].dataIndex].UID);
    },
  };

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
      if (pass.length < 4) {
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
    <div style={{ backgroundColor: 'var(--body_background3)', height: '94vh' }}>
      <Box sx={{ padding: 5, width: '100%' }}>
        <CustomMUIDataTable
          columns={columns}
          data={rows}
          title='Users'
          options={options}
          components={{
            Toolbar: GridToolbar,
          }}
        />
      </Box>

      <Dialog
        open={openEdit}
        onClose={handleCloseEdit}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(255, 255, 255, 0.7)', // Medium transparent white background
            backdropFilter: 'blur(10px)', // Adds a blur effect to the background
            boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)', // Box shadow for elevation
            borderRadius: '12px', // Rounded corners
          },
        }}
      >
        <DialogTitle
          id="dialog-title"
          sx={{
            textAlign: 'center',
            fontSize: '1.8rem', // Increased font size
            fontWeight: 'bold',
            backgroundColor: '#f0f0f0', // Light grey background
            color: '#333', // Darker text color
            borderBottom: '1px solid #ddd', // Divider line
            padding: '0%', // Increased padding
          }}
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
                '& .MuiInputBase-root': {
                  border: 'none', // Ensure no border
                  outline: 'none', // Ensure no outline
                },
                '& .Mui-disabled': {
                  color: 'var(--body_color1)' // Adjust disabled text color if needed
                }
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
                sx={{ fontSize: '2rem' }} // Set text size
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
                sx={{ fontSize: '2rem' }} // Set text size
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
            display: 'flex',
            justifyContent: 'space-evenly',
            padding: '12px 20px', // Increased padding
          }}
        >
          <Button
            onClick={handleCloseEdit}
            sx={{
              backgroundColor: '#e0e0e0', // Light grey for cancel button
              color: '#333', // Dark text color
              border: '1px solid #ccc',
              fontSize: '1rem', // Increased font size
              padding: '10px 20px', // Increased padding
              '&:hover': {
                backgroundColor: '#d0d0d0', // Slightly darker grey on hover
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveEdit}
            sx={{
              backgroundColor: '#1976d2', // Primary color for apply button
              color: '#fff', // White text color
              border: '1px solid #155a8a',
              fontSize: '1rem', // Increased font size
              padding: '10px 20px', // Increased padding
              marginLeft: '12px', // Space between buttons
              '&:hover': {
                backgroundColor: '#155a8a', // Darker shade of primary color on hover
              },
            }}
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </div >
  );
}