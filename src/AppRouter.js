import React, { useEffect, useState } from 'react';
import { BrowserRouter, MemoryRouter, HashRouter as RouterComponent, Routes, Route } from 'react-router-dom';
import Layout from './skeleton/Layout';
import SignIn, { ForgotPassword, SignUp } from './skeleton/components/User Components/SignIn';
import { useLocation } from 'react-router';
import { toast, ToastContainer } from 'react-toastify';
import { Dashboard } from './skeleton/components/Landing Page Skeleton/MainLayout'
import { ProtectedRoute } from './skeleton/functions/User Access Functions/protectedRoute';
import { ThemeProvider } from './skeleton/utils/ThemeContext'
import { useDispatch, useSelector } from 'react-redux';
import { getAbout, getLicense, startPlugin } from './skeleton/functions/API Calls/database_calls';
import { ErrorMessage } from './skeleton/components/UI Components/AlertMessage';
import { getConnectedArduinos } from './skeleton/functions/Arduino Functions/getLinesFromArduino';
import { setAbout, setLicense } from './skeleton/store/aboutSlice';
import { addNotification } from './skeleton/store/notificationSlice';
import { addMqtt } from './skeleton/store/mqttConnectionSlice';
import { ConnectionDetails } from './skeleton/functions/Program Functions/connection_functions';
import { setComms } from './skeleton/store/connectionSlice';
import UsersDetails from './skeleton/components/User Components/UsersDetails';
import SettingsMenu from './skeleton/components/Settings/SettingsMenu';
import About from './skeleton/components/User Components/About';
import CssBaseline from '@mui/material/CssBaseline';
import { setGroup, setPlugins } from './skeleton/store/pluginSlice';
import { Server_Addr } from './skeleton/utils/medlab_constants';
import License from './skeleton/components/license/license';


const CurrentPath = () => {
  const location = useLocation();  // Hook to get the current location
  // return <p>Current Path: {location.pathname}</p>;  // Display the pathname
  toast.error(location.pathname, {
    position: "bottom-left",
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  })
  return (
    <></>
  )
};

// declare global {
//   interface Window {
//     __APP_CONFIG__?: { isPluginMode: boolean };
//   }
// }

/**
 * Create a router element that chooses the router type and routes
 * based on whether we are in plugin mode or standalone mode.
 */
export default function AppRouter() {

  // const isPluginMode = window.__APP_CONFIG__?.isPluginMode === true;
  const dispatch = useDispatch();
  const isSignIn = useSelector((state) => state.auth.isLoggedIn);
  const connectedSystem = useSelector((state) => state.connection_settings);
  const group = useSelector((state) => state.plugin.group);
  const plugins = useSelector((state) => state.plugin.plugins);

  // In plugin mode, use MemoryRouter to avoid interfering with the parent app's routing.
  // In standalone mode, use BrowserRouter for normal navigation.
  // const RouterComponent = isPluginMode ? MemoryRouter : (process.env.NODE_ENV === 'production' ? HashRouter : BrowserRouter);

  // For fetching connection Details
  useEffect(() => {
    if (!isSignIn) {
      ConnectionDetails().then((res) => {
        console.log("Successfully Fetched Connection Settings", res);
        // (Object.entries)
        if (res.HTTP_SERVER_ADDR != '') {
          dispatch(setComms(res));
        }
      }).catch((err) => {
        ErrorMessage(`Error in connecting ${err}`);
      }).finally(() => {
        console.log("Setting Constants for App - Log Level & Telemetry Delay", connectedSystem);
      });
    }
  }, [isSignIn]);

  // For fetching connected mqtt topics
  useEffect(() => {
    if (isSignIn && !connectedSystem.DEMO_MODE) {
      getConnectedArduinos().then((res) => {
        dispatch(addMqtt(res.data));
      }).catch((err) => {
        ErrorMessage(`Unable to connect to Hardware`);
      });
    }
  }, [isSignIn]);

  // For fetching License and About details
  useEffect(() => {
    if (isSignIn) {
      getLicense().then((res) => {
        console.log(res.message)
        if(res.val){
          dispatch(setLicense({license:true}));
        }
        if (res.display) {
          dispatch(addNotification({ message: res.message }))
        }
      }).catch((err) => {
        // ErrorMessage(``);
        console.log(err)
        dispatch(addNotification({ message: 'Error in fetching the licnese details' }))
      });
      getAbout().then((res) => {
        console.log('About', res);
        dispatch(setAbout(res))
      }).catch((error) => {
        console.log('About', error)
      })
    }
  }, [isSignIn]);

  // For Running Plugins in Backend
  useEffect(() => {
      if (group.length == 0 && plugins.length == 0) {
        startPlugin().then((res) => {
          console.log(res);
          dispatch(setGroup(res.group));
        }).catch((err) => {
          console.log("Plugin Run failed", err);
        })
      }
  }, [])

  // Function to load Script
  function loadScript(src, instanceId, pluginType) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
  
      script.onload = () => resolve({ instanceId, pluginType });
      script.onerror = () => reject(new Error(`Failed to load plugin: ${src}`));
  
      document.body.appendChild(script);
    });
  }

  // Function to load loadScript function
  async function loadMultiplePlugins() {
    try {
      // Load all plugins dynamically
      const loadedInstances = await Promise.all(
        group.map((item) =>
          loadScript(`${Server_Addr}${item.react}`, item.config.route, item.config.pluginType)
        )
      );
      dispatch(setPlugins(loadedInstances));

    } catch (error) {
      console.error("Error loading plugins:", error);
    }
  }

  // For Running plugin Script in Fronted
  useEffect(() => {
    if (group && group.length > 0 && plugins.length == 0) {
      loadMultiplePlugins();
    }
  }, [group]);

  // For Re-rendering plugin Script in Frontend if script lost while refreshing
  useEffect(()=>{
    if ( plugins.length > 0 ) {
        loadMultiplePlugins();
    }
  },[])

  return (
    <div className='RoutingWrapper'>
      <ThemeProvider>
        <CssBaseline />
        {/* {group.map((item:any,index:any)=>(<div style={{display:'none'}} id={`plugin-container-${index}`}></div>))} */}
        <RouterComponent>
          {/* <CurrentPath/> */}
          <Routes>
            {/* Common skeleton route */}
            <Route path="/" element={<SignIn />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path='/resetPassword' element={<ForgotPassword />} />
            <Route path='/dashboard' element={
              <ProtectedRoute>
                <Layout children={<Dashboard />} />
              </ProtectedRoute>
            } />
            <Route path='/admin' element={
              <ProtectedRoute>
                <Layout children={<UsersDetails />} />
              </ProtectedRoute>} />

            <Route path='/settings' element={
              <ProtectedRoute>
                <Layout children={<SettingsMenu />} />
              </ProtectedRoute>} />

            <Route path='/about' element={
              <ProtectedRoute>
                <Layout children={<About />} />
              </ProtectedRoute>
            } />

            <Route path='/license' element={
              <ProtectedRoute>
                <Layout children={<License />} />
              </ProtectedRoute>
            } />

          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />

        </RouterComponent>
      </ThemeProvider>
    </div>
  );
}