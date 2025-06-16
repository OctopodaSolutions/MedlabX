import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import sample from "../../assets/noki_logo_reveal.mp4";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
} from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Container from "@mui/material/Container";
import {
  performSignIn,
  performUserSignUp,
  userPasswordChange,
} from "../../functions/User Access Functions/user_functions";
import "./SignIn.css";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "../../store/userSlice";
import { ErrorMessage, SuccessMessage } from "../UI Components/AlertMessage";
import { useSelector } from "react-redux";
import { CircularProgress, Fade, Slide, Zoom, IconButton } from "@mui/material";
import { Visibility, VisibilityOff, Email, Lock } from "@mui/icons-material";
import { styled, keyframes } from "@mui/material/styles";

// Animated components
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

const AnimatedAvatar = styled(Avatar)(({ theme }) => ({
  animation: `${float} 3s ease-in-out infinite`,
  background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
  boxShadow: "0 3px 15px 2px rgba(255, 105, 135, .3)",
}));

const AnimatedButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
  border: 0,
  borderRadius: 25,
  boxShadow: "0 3px 15px 2px rgba(255, 105, 135, .3)",
  color: "white",
  height: 48,
  padding: "0 30px",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    background: "linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)",
    transform: "translateY(-2px)",
    boxShadow: "0 6px 20px 4px rgba(255, 105, 135, .4)",
  },
  "&:active": {
    animation: `${pulse} 0.3s ease-in-out`,
  },
}));

const ShimmerButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
  backgroundSize: "200px 100%",
  animation: `${shimmer} 2s infinite`,
  border: 0,
  borderRadius: 25,
  height: 48,
  padding: "0 30px",
}));

const AnimatedTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 15,
    transition: "all 0.3s ease-in-out",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 20px rgba(255, 255, 255, 0.1)",
    },
    "&.Mui-focused": {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 20px rgba(255, 105, 135, 0.3)",
    },
  },
}));

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
const Copyright = React.forwardRef((props, ref) => {
  return (
    <Typography
      variant="body2"
      color="lightgrey"
      align="center"
      ref={ref}
      {...props}
    >
      {"Copyright © "}
      <Link style={{ color: "yellow" }} href="https://nokitechnologies.com/">
        Noki Technologies Pvt Ltd.
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
});

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
  const demoMode = useSelector(
    (state) => state.connection_settings?.DEMO_MODE || false,
  );

  // Interactive states
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Animate form on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setFormVisible(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  /**
   * Handles form submission for user sign-in.
   *
   * @param {Event} event - The form submission event.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");

    if (!email) {
      ErrorMessage("Email cannot be empty.");
      setLoading(false);
      return;
    } else if (!password) {
      ErrorMessage("Password cannot be empty.");
      setLoading(false);
      return;
    }

    try {
      const res = await performSignIn(email, password);
      console.log("Result from Login", res);
      document.cookie = `AuthToken=${res.data.token};max-age=3600;path=/;secure`;
      dispatch(setToken(res.data.token));
      dispatch(setUser(res.data.user));

      // Show success message before navigating
      SuccessMessage("Login successful! Redirecting...");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      console.error("Error from Login", err);
      ErrorMessage(err);
      setLoading(false);
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
        <Slide
          direction="left"
          in={formVisible}
          mountOnEnter
          unmountOnExit
          timeout={800}
        >
          <Box
            sx={{
              marginTop: 5,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginLeft: "auto",
              marginRight: 0,
              width: 1,
            }}
          >
            <Zoom in={formVisible} timeout={1000}>
              <AnimatedAvatar sx={{ m: 1, width: 56, height: 56 }}>
                <LockOutlinedIcon />
              </AnimatedAvatar>
            </Zoom>

            {formVisible && (
              <Fade in timeout={1200}>
                <Typography
                  component="h1"
                  variant="h5"
                  sx={{
                    background:
                      "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontWeight: "bold",
                    textAlign: "center",
                    mb: 2,
                  }}
                >
                  Welcome to MEDLABX
                </Typography>
              </Fade>
            )}

            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{
                mt: 1,
                justifyContent: "space-evenly",
                display: "-ms-flexbox",
                width: 1,
              }}
            >
              <Fade in={formVisible} timeout={1400}>
                <Box
                  sx={{
                    alignItems: "center",
                    textAlign: "center",
                    width: 1,
                    marginBottom: 2,
                    marginTop: 2,
                    position: "relative",
                  }}
                >
                  <AnimatedTextField
                    required
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    variant="outlined"
                    fullWidth
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    InputProps={{
                      startAdornment: (
                        <Email
                          sx={{
                            color: emailFocused
                              ? "#FE6B8B"
                              : "rgba(255,255,255,0.7)",
                            mr: 1,
                            transition: "color 0.3s ease",
                          }}
                        />
                      ),
                    }}
                    sx={{
                      width: "100%",
                      "& .MuiInputLabel-root": {
                        color: "white !important",
                        fontSize: "1.55vh",
                      },
                      "& .MuiOutlinedInput-root": {
                        "& input": {
                          color: "white !important",
                          fontSize: "1.55vh",
                        },
                        "& fieldset": {
                          borderColor: "rgba(255,255,255,0.3)",
                        },
                        "&:hover fieldset": {
                          borderColor: "rgba(255,255,255,0.7)",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#FE6B8B",
                        },
                      },
                    }}
                  />
                </Box>
              </Fade>

              <Fade in={formVisible} timeout={1600}>
                <Box
                  sx={{
                    alignItems: "center",
                    textAlign: "center",
                    width: "inherit",
                    marginBottom: 2,
                    marginTop: 2,
                    position: "relative",
                  }}
                >
                  <AnimatedTextField
                    required
                    name="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    autoComplete="current-password"
                    fullWidth
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    InputProps={{
                      startAdornment: (
                        <Lock
                          sx={{
                            color: passwordFocused
                              ? "#FE6B8B"
                              : "rgba(255,255,255,0.7)",
                            mr: 1,
                            transition: "color 0.3s ease",
                          }}
                        />
                      ),
                      endAdornment: (
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: "rgba(255,255,255,0.7)" }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      ),
                    }}
                    sx={{
                      width: "100%",
                      "& .MuiInputLabel-root": {
                        color: "white !important",
                        fontSize: "1.55vh",
                      },
                      "& .MuiOutlinedInput-root": {
                        "& input": {
                          color: "white !important",
                          fontSize: "1.55vh",
                        },
                        "& fieldset": {
                          borderColor: "rgba(255,255,255,0.3)",
                        },
                        "&:hover fieldset": {
                          borderColor: "rgba(255,255,255,0.7)",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#FE6B8B",
                        },
                      },
                    }}
                  />
                </Box>
              </Fade>

              <Fade in={formVisible} timeout={1800}>
                <Box sx={{ mt: 3, mb: 2 }}>
                  {loading ? (
                    <ShimmerButton fullWidth disabled>
                      <CircularProgress
                        size={20}
                        sx={{ color: "white", mr: 1 }}
                      />
                      Signing In...
                    </ShimmerButton>
                  ) : (
                    <AnimatedButton
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ fontSize: "1.55vh" }}
                    >
                      Sign In {demoMode && "(DEMO)"}
                    </AnimatedButton>
                  )}
                </Box>
              </Fade>

              <Fade in={formVisible} timeout={2000}>
                <Box sx={{ width: "inherit", marginBottom: 1, marginTop: 1 }}>
                  <Grid container spacing={2}>
                    <Grid item xs sx={{ fontSize: "1.55vh" }}>
                      <Link
                        to="/resetPassword"
                        style={{
                          color: "white",
                          textDecoration: "none",
                          transition: "all 0.3s ease",
                          borderBottom: "1px solid transparent",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.color = "#FE6B8B";
                          e.target.style.borderBottom = "1px solid #FE6B8B";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.color = "white";
                          e.target.style.borderBottom = "1px solid transparent";
                        }}
                      >
                        Reset Password?
                      </Link>
                    </Grid>
                    <Grid item sx={{ fontSize: "1.55vh" }}>
                      <Link
                        to="/signup"
                        style={{
                          color: "white",
                          textDecoration: "none",
                          transition: "all 0.3s ease",
                          borderBottom: "1px solid transparent",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.color = "#FF8E53";
                          e.target.style.borderBottom = "1px solid #FF8E53";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.color = "white";
                          e.target.style.borderBottom = "1px solid transparent";
                        }}
                      >
                        Sign Up
                      </Link>
                    </Grid>
                  </Grid>
                </Box>
              </Fade>
            </Box>

            <Fade in={formVisible} timeout={2200}>
              <Copyright sx={{ mt: 8, mb: 4, fontSize: "1.55vh" }} />
            </Fade>
          </Box>
        </Slide>
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

  // Interactive states
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const navigate = useNavigate();

  // Animate form on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setFormVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  /**
   * Handles form submission for user sign-up.
   *
   * @param {Event} event - The form submission event.
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    console.log("Submit SignUp Form");
    console.log(firstName, access_level);

    if (!firstName) {
      ErrorMessage("First Name cannot be empty");
      setLoading(false);
      return;
    } else if (!emailRegex.test(email)) {
      ErrorMessage("Please enter a valid email address");
      setLoading(false);
      return;
    } else if (!lastName) {
      ErrorMessage("Last Name cannot be empty");
      setLoading(false);
      return;
    } else if (!email) {
      ErrorMessage("Email not provided");
      setLoading(false);
      return;
    } else if (!password) {
      ErrorMessage("Password not Provided");
      setLoading(false);
      return;
    } else if (password.length <= 6) {
      ErrorMessage("Password length is less than 6 characters!");
      setLoading(false);
      return;
    } else if (!confirm_password) {
      ErrorMessage("Confirm your password again");
      setLoading(false);
      return;
    } else if (confirm_password.length <= 6) {
      ErrorMessage("Confirm password length is less than 6 characters!");
      setLoading(false);
      return;
    } else if (confirm_password !== password) {
      ErrorMessage("Confirm password should match with password");
      setLoading(false);
      return;
    } else if (!access_level) {
      ErrorMessage("Please select access level");
      setLoading(false);
      return;
    }

    if (confirm_password === password) {
      console.log("Passwords Match");
      performUserSignUp(
        firstName + " " + lastName,
        password,
        0,
        access_level,
        "",
        email,
      )
        .then((res) => {
          if (res.success) {
            let userType = "";
            if (access_level == 1) {
              userType = "User";
            } else if (access_level == 2) {
              userType = "Administrator";
            } else {
              userType = "Engineer";
            }
            SuccessMessage(
              `Account created for ${userType} successfully! Redirecting to sign in...`,
            );
            console.log(res);
            setTimeout(() => {
              resetFields();
            }, 1500);
          } else {
            ErrorMessage(`Error in adding User ${res.message}`);
            console.log(res);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
          ErrorMessage(`Error in adding User ${err}`);
          setLoading(false);
        });
    }
  };

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
    navigate("/signin");
  };

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
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginLeft: "auto",
            marginRight: 0,
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              mt: 1,
              justifyContent: "space-evenly",
              display: "-ms-flexbox",
              marginLeft: "auto",
              width: 1,
            }}
          >
            <Box
              sx={{
                alignItems: "center",
                textAlign: "center",
                width: "inherit",
                marginBottom: 1,
                marginTop: 1,
              }}
            >
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                onChange={(event) => setFirstName(event.target.value)}
                autoFocus
                sx={{
                  "& .MuiInputLabel-root": {
                    color: "white !important",
                    fontSize: "1.55vh",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& input": {
                      color: "white !important",
                      fontSize: "1.55vh",
                    },
                  },
                }}
              />
            </Box>

            <Box
              sx={{
                alignItems: "center",
                textAlign: "center",
                width: "inherit",
                marginBottom: 1,
                marginTop: 1,
              }}
            >
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                onChange={(event) => setLastName(event.target.value)}
                autoComplete="lname"
                sx={{
                  "& .MuiInputLabel-root": {
                    color: "white !important",
                    fontSize: "1.55vh",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& input": {
                      color: "white !important",
                      fontSize: "1.55vh",
                    },
                  },
                }}
              />
            </Box>

            <Box
              sx={{
                alignItems: "center",
                textAlign: "center",
                width: "inherit",
                marginBottom: 1,
                marginTop: 1,
              }}
            >
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                sx={{
                  "& .MuiInputLabel-root": {
                    color: "white !important",
                    fontSize: "1.55vh",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& input": {
                      color: "white !important",
                      fontSize: "1.55vh",
                    },
                  },
                }}
              />
            </Box>

            <Box
              sx={{
                alignItems: "center",
                textAlign: "center",
                width: "inherit",
                marginBottom: 1,
                marginTop: 1,
              }}
            >
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                sx={{
                  "& .MuiInputLabel-root": {
                    color: "white !important",
                    fontSize: "1.55vh",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& input": {
                      color: "white !important",
                      fontSize: "1.55vh",
                    },
                  },
                }}
              />
            </Box>

            <Box
              sx={{
                alignItems: "center",
                textAlign: "center",
                width: "inherit",
                marginBottom: 1,
                marginTop: 1,
              }}
            >
              <TextField
                variant="outlined"
                required
                fullWidth
                name="confirm_password"
                label="Confirm Password"
                type="password"
                id="confirm_password"
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="current-password"
                sx={{
                  "& .MuiInputLabel-root": {
                    color: "white !important",
                    fontSize: "1.55vh",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& input": {
                      color: "white !important",
                      fontSize: "1.55vh",
                    },
                  },
                }}
              />
            </Box>
            <Box sx={{ width: "inherit", marginBottom: 1, marginTop: 1 }}>
              <FormControl
                sx={{
                  m: 1,
                  width: 300,
                  "& label": { color: "white" },
                  "& input": { color: "white" },
                }}
              >
                <InputLabel
                  id="demo-multiple-name-label"
                  sx={{ fontSize: "1.55vh" }}
                >
                  Access Level
                </InputLabel>
                <Select
                  value={access_level}
                  onChange={(event) => setAccessLevel(event.target.value)}
                  input={
                    <OutlinedInput
                      label="Access Level"
                      classes={{
                        root: "outlined-input",
                      }}
                      sx={{
                        "& .MuiInputLabel-root": {
                          color: "white !important",
                          fontSize: "1.55vh",
                        },
                        "& .MuiOutlinedInput-root": {
                          "& input": {
                            color: "white !important",
                            fontSize: "1.55vh",
                          },
                        },
                      }}
                    />
                  }
                  MenuProps={{
                    classes: {
                      paper: "dark-menu",
                    },
                  }}
                  sx={{
                    "& .MuiInputLabel-root": {
                      color: "white !important",
                      fontSize: "1.55vh",
                    },
                    "& .MuiOutlinedInput-root": {
                      "& input": {
                        color: "white !important",
                        fontSize: "1.55vh",
                      },
                    },
                  }}
                >
                  <MenuItem value={1} sx={{ fontSize: "1.55vh" }}>
                    User
                  </MenuItem>
                  <MenuItem value={2} sx={{ fontSize: "1.55vh" }}>
                    Administrator
                  </MenuItem>
                  <MenuItem value={3} sx={{ fontSize: "1.55vh" }}>
                    Engineer
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, fontSize: "1.55vh" }}
            >
              Submit
            </Button>
            <Grid container>
              <Grid item xs sx={{ fontSize: "1.55vh" }}>
                <Link to="/signin" variant="body2" style={{ color: "white" }}>
                  {"Sign In"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4, fontSize: "1.55vh" }} />
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
      ErrorMessage("Email cannot be empty");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      ErrorMessage("Please enter a valid email address.");
      return;
    }
    if (!password) {
      ErrorMessage("Password cannot be empty");
      return;
    }
    if (password.length <= 6) {
      ErrorMessage("Password length should more than 6 characters");
      return;
    }
    if (!confirm_password) {
      ErrorMessage("Confirm password cannot be empty");
      return;
    }

    if (password !== confirm_password) {
      ErrorMessage("Passwords does not match");
      return;
    }
    userPasswordChange(email, password)
      .then((res) => {
        navigate("/signin");
        console.log("Password changed", res);
        SuccessMessage("Password changed Successfully");
      })
      .catch((err) => {
        console.log("Error", err);
        ErrorMessage("Error changing password.");
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
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginLeft: "auto",
            marginRight: 0,
            width: 1,
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Reset Password
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              mt: 1,
              justifyContent: "space-evenly",
              display: "-ms-flexbox",
              marginLeft: "auto",
              width: 1,
            }}
          >
            <Box
              sx={{
                alignItems: "center",
                textAlign: "center",
                width: "inherit",
                marginBottom: 1,
                marginTop: 1,
              }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                sx={{
                  "& .MuiInputLabel-root": {
                    color: "white !important",
                    fontSize: "1.55vh",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& input": {
                      color: "white !important",
                      fontSize: "1.55vh",
                    },
                  },
                }}
                autoFocus
                onChange={(event) => setEmail(event.target.value)}
              />
            </Box>
            <Box
              sx={{
                alignItems: "center",
                textAlign: "center",
                width: "inherit",
                marginBottom: 1,
                marginTop: 1,
              }}
            >
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
                  "& .MuiInputLabel-root": {
                    color: "white !important",
                    fontSize: "1.55vh",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& input": {
                      color: "white !important",
                      fontSize: "1.55vh",
                    },
                  },
                }}
                onChange={(event) => setPassword(event.target.value)}
              />
            </Box>
            <Box
              sx={{
                alignItems: "center",
                textAlign: "center",
                width: "inherit",
                marginBottom: 1,
                marginTop: 1,
              }}
            >
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
                  "& .MuiInputLabel-root": {
                    color: "white !important",
                    fontSize: "1.55vh",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& input": {
                      color: "white !important",
                      fontSize: "1.55vh",
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
              sx={{ mt: 3, mb: 2, fontSize: "1.55vh" }}
            >
              Submit
            </Button>
          </Box>
          <Grid container>
            <Grid item xs sx={{ fontSize: "1.55vh" }}>
              <Link to="/signin" variant="body2" style={{ color: "white" }}>
                {"Sign In"}
              </Link>
            </Grid>
            <Grid item sx={{ fontSize: "1.55vh" }}>
              <Link to="/signup" variant="body2" style={{ color: "white" }}>
                {"Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4, fontSize: "1.55vh" }} />
      </Container>
    </div>
  );
}
