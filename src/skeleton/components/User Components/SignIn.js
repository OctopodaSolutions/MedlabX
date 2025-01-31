import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import sample from '../../assets/noki_logo_reveal.mp4';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { FormControl, InputLabel, Select, MenuItem, OutlinedInput } from '@mui/material';
import Button from '@mui/material/Button';
// import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Container from '@mui/material/Container';
import { performSignIn, performUserSignUp, userPasswordChange } from '../../functions/User Access Functions/user_functions';
// import { toast } from 'react-toastify';
import './SignIn.css';
// import jwtDecode from 'jwt-decode';
import { useDispatch } from 'react-redux'; // Import useDispatch to dispatch actions
import { setToken, setUser } from '../../store/userSlice';
// import { }
import { ErrorMessage, SuccessMessage } from '../UI Components/AlertMessage';
import { useSelector } from 'react-redux';


/**
 * Renders a copyright notice with the current year.
 *
 * @param {Object} props - The props to be passed to the Typography component.
 * @param {string} props.className - Optional class name to apply custom styling.
 * @param {Object} props.style - Optional inline styles to apply to the Typography component.
 * @returns {React.Element} The rendered copyright notice component.
 *
 * @example
 * <Copyright style={{ marginTop: '20px' }} />
 */
function Copyright(props) {
  return (
    <Typography variant="body2" color="lightgrey" align="center" {...props}>
      {'Copyright © '}
      <Link style={{ color: 'yellow' }} href="https://nokitechnologies.com/">
        Noki Technologies Pvt Ltd.
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// function CloseCopyright(props) {
//   return (
//     <Typography variant="body2" color="white" align="center" {...props}>
//       {Close}
//     </Typography>
//   );
// }


/**
 * SignIn Component
 * 
 * This component renders a sign-in form and handles user authentication.
 * 
 * - It uses React hooks for navigation and dispatching Redux actions.
 * - It checks the `DEMO_MODE` from the Redux store.
 * - It handles form submission and performs user sign-in.
 * - It sets an authentication token as a cookie and updates the Redux store with user data upon successful login.
 * - It displays a video background and includes styling for various elements.
 * 
 * @component
 * @example
 * return (
 *   <SignIn />
 * )
 */

export default function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const demoMode = useSelector((state) => state.connection_settings?.DEMO_MODE || false);


  /**
   * Handles form submission for user sign-in.
   * 
   * @param {Event} event - The form submission event.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    const password = data.get('password');
    if (!email) {
      ErrorMessage("Email cannot be empty.");
      return;
    } else if (!password) {
      ErrorMessage("Password cannot be empty.");
      return;
    }

    try {
      const res = await performSignIn(email, password);
      console.log("Result from Login", res);
      document.cookie = `AuthToken=${res.data.token};max-age=3600;path=/;secure`;
      dispatch(setToken(res.data.token));
      dispatch(setUser(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      console.error("Error from Login", err);
      const errorMessage = err.response?.data?.message || err.message;
      console.log('errorMessage', errorMessage)
    }

  };

  return (
    <div className="container">
      <div id="video-container">
        <video id="video" autoPlay loop muted>
          <source src={sample} type="video/mp4" />
        </video>
      </div>
      <Container component="main" maxWidth="xs" className="formSignIn">
        {/* <CssBaseline /> */}
        <Box sx={{
          marginTop: 5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginLeft: 'auto',
          marginRight: 0,
          width: 1
        }}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, justifyContent: 'space-evenly', display: '-ms-flexbox', width: 1 }}>
            <Box sx={{ alignItems: 'center', textAlign: 'center', width: 1, marginBottom: 1, marginTop: 1 }}>
              <TextField
                required
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                variant="outlined"
                fullWidth
                sx={{
                  width: '100%',
                  '& .MuiInputLabel-root': {
                    color: 'white !important',
                    fontSize: '1.55vh'
                  },
                  '& .MuiOutlinedInput-root': {
                    '& input': {
                      color: 'white !important',
                      fontSize: '1.55vh'
                    }
                  }
                }}
              />
            </Box>
            <Box sx={{ alignItems: 'center', textAlign: 'center', width: 'inherit', marginBottom: 1, marginTop: 1 }}>
              <TextField
                required
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                fullWidth
                sx={{
                  width: '100%',
                  '& .MuiInputLabel-root': {
                    color: 'white !important',
                    fontSize: '1.55vh'
                  },
                  '& .MuiOutlinedInput-root': {
                    '& input': {
                      color: 'white !important',
                      fontSize: '1.55vh'
                    }
                  }
                }}
              />
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, fontSize: '1.55vh' }}
            >
              Sign In {demoMode && 'Demo'}
            </Button>
            <Box sx={{ width: 'inherit', marginBottom: 1, marginTop: 1 }}>
              <Grid container>
                <Grid item xs sx={{ fontSize: '1.55vh' }}>
                  <Link to="/resetPassword" variant="body2" style={{ color: 'white' }}>
                    {"Reset Password?"}
                  </Link>
                </Grid>
                <Grid item sx={{ fontSize: '1.55vh' }}>
                  <Link to="/signup" variant="body2" style={{ color: 'white' }}>
                    {"Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright sx={{ mt: 8, mb: 4, fontSize: '1.55vh' }} />
          {/* <CloseCopyright sx={{ mt: 8, mb: 4 }} /> */}
        </Box>
      </Container>
    </div>
  );
}

/**
 * SignUp Component
 * 
 * This component renders a sign-up form for new users.
 * 
 * - It maintains state for form fields using React hooks.
 * - It handles form submission and performs user sign-up.
 * - It checks password confirmation before submitting the form.
 * - It displays a video background and includes styling for various elements.
 * 
 * @component
 * @example
 * return (
 *   <SignUp />
 * )
 */
export function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");
  const [access_level, setAccessLevel] = useState("");

  const navigate = useNavigate();

  /**
   * Handles form submission for user sign-up.
   * 
   * @param {Event} event - The form submission event.
   */
  const handleSubmit = (event) => {
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

  /**
   * Resets the form fields to their initial state.
   */
  const resetFields = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setAccessLevel("");
    navigate('/signin');
  }

  return (
    <div className="container">
      <div id="video-container">
        <video id="video" autoPlay loop muted>
          <source src={sample} type="video/mp4" />
        </video>
      </div>
      <Container component="main" maxWidth="xs" className="formSignUp">
        <Box
          sx={{
            marginTop: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginLeft: 'auto',
            marginRight: 0
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, justifyContent: 'space-evenly', display: '-ms-flexbox', marginLeft: 'auto', width: 1 }}>
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
                    color: 'white !important',
                    fontSize: '1.55vh',
                  },
                  '& .MuiOutlinedInput-root': {
                    '& input': {
                      color: 'white !important',
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
                    color: 'white !important',
                    fontSize: '1.55vh',
                  },
                  '& .MuiOutlinedInput-root': {
                    '& input': {
                      color: 'white !important',
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
                    color: 'white !important',
                    fontSize: '1.55vh',
                  },
                  '& .MuiOutlinedInput-root': {
                    '& input': {
                      color: 'white !important',
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
                    color: 'white !important',
                    fontSize: '1.55vh',
                  },
                  '& .MuiOutlinedInput-root': {
                    '& input': {
                      color: 'white !important',
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
                    color: 'white !important',
                    fontSize: '1.55vh',
                  },
                  '& .MuiOutlinedInput-root': {
                    '& input': {
                      color: 'white !important',
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
                          color: 'white !important', fontSize: '1.55vh',
                        },
                        '& .MuiOutlinedInput-root': {
                          '& input': {
                            color: 'white !important', fontSize: '1.55vh',
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
                      color: 'white !important', fontSize: '1.55vh',
                    },
                    '& .MuiOutlinedInput-root': {
                      '& input': {
                        color: 'white !important', fontSize: '1.55vh',
                      },
                    },
                  }}
                >
                  <MenuItem value={1} sx={{ fontSize: '1.55vh' }}>Support</MenuItem>
                  <MenuItem value={2} sx={{ fontSize: '1.55vh' }}>User</MenuItem>
                  <MenuItem value={3} sx={{ fontSize: '1.55vh' }}>Engineer</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, fontSize: '1.55vh' }}
            >
              Submit
            </Button>
            <Grid container>
              <Grid item xs sx={{ fontSize: '1.55vh' }}>
                <Link to="/signin" variant="body2" style={{ color: 'white' }}>
                  {"Sign In"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4, fontSize: '1.55vh' }} />
      </Container>
    </div>
  );
}

/**
 * ForgotPassword Component
 * 
 * This component renders a form for resetting a user's password.
 * 
 * - It maintains state for form fields using React hooks.
 * - It handles form submission and performs password reset.
 * - It checks password confirmation before submitting the form.
 * - It displays a video background and includes styling for various elements.
 * 
 * @component
 * @example
 * return (
 *   <ForgotPassword />
 * )
 */
export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  /**
   * Handles form submission for password reset.
   * 
   * @param {Event} event - The form submission event.
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!email) {
      ErrorMessage('Email cannot be empty');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      ErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!password) {
      ErrorMessage('Password cannot be empty');
      return;
    }
    if (password.length <= 6) {
      ErrorMessage('Password length should more than 6 characters')
      return;
    }
    if (!confirm_password) {
      ErrorMessage('Confirm password cannot be empty');
      return;
    }


    if (password !== confirm_password) {
      ErrorMessage('Passwords does not match');
      return;
    }
    userPasswordChange(email, password)
      .then((res) => {
        navigate('/signin');
        console.log("Password changed", res);
        SuccessMessage('Password changed Successfully');
      })
      .catch((err) => {
        console.log("Error", err);
        ErrorMessage('Error changing password.');
      });
  };


  return (
    <div className="container">
      <div id="video-container">
        <video id="video" autoPlay loop muted>
          <source src={sample} type="video/mp4" />
        </video>
      </div>
      <Container component="main" maxWidth="xs" className="formSignIn">
        <Box
          sx={{
            marginTop: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginLeft: 'auto',
            marginRight: 0,
            width: 1
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Reset Password
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, justifyContent: 'space-evenly', display: '-ms-flexbox', marginLeft: 'auto', width: 1 }}>
            <Box sx={{ alignItems: 'center', textAlign: 'center', width: 'inherit', marginBottom: 1, marginTop: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                sx={{
                  '& .MuiInputLabel-root': {
                    color: 'white !important', fontSize: '1.55vh',
                  },
                  '& .MuiOutlinedInput-root': {
                    '& input': {
                      color: 'white !important', fontSize: '1.55vh',
                    },
                  },
                }}
                autoFocus
                onChange={(event) => setEmail(event.target.value)}
              />
            </Box>
            <Box sx={{ alignItems: 'center', textAlign: 'center', width: 'inherit', marginBottom: 1, marginTop: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                sx={{
                  '& .MuiInputLabel-root': {
                    color: 'white !important', fontSize: '1.55vh',
                  },
                  '& .MuiOutlinedInput-root': {
                    '& input': {
                      color: 'white !important', fontSize: '1.55vh',
                    },
                  },
                }}
                onChange={(event) => setPassword(event.target.value)}
              />
            </Box>
            <Box sx={{ alignItems: 'center', textAlign: 'center', width: 'inherit', marginBottom: 1, marginTop: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirm_password"
                label="Confirm Password"
                type="password"
                id="confirm_password"
                autoComplete="current-password"
                sx={{
                  '& .MuiInputLabel-root': {
                    color: 'white !important', fontSize: '1.55vh',
                  },
                  '& .MuiOutlinedInput-root': {
                    '& input': {
                      color: 'white !important', fontSize: '1.55vh',
                    },
                  },
                }}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, fontSize: '1.55vh' }}
            >
              Submit
            </Button>
          </Box>
          <Grid container>
            <Grid item xs sx={{ fontSize: '1.55vh' }}>
              <Link to="/signin" variant="body2" style={{ color: 'white' }}>
                {"Sign In"}
              </Link>
            </Grid>
            <Grid item sx={{ fontSize: '1.55vh' }}>
              <Link to="/signup" variant="body2" style={{ color: 'white' }}>
                {"Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4, fontSize: '1.55vh' }} />
      </Container>
    </div>
  )
}


