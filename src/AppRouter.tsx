import React, { useEffect } from 'react';
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom';
import Layout from './skeleton/Layout';
import CustomTab from './custom/CustomTab';
import SignIn, { ForgotPassword, SignUp } from './skeleton/components/User Components/SignIn';
import UploadFile from './skeleton/components/PluginComponents/UploadFile';
import { useLocation } from 'react-router';
import { toast, ToastContainer } from 'react-toastify';
import { AccountMenu } from './skeleton/components/Landing Page Skeleton/MainLayout'
import { ProtectedRoute } from './skeleton/functions/User Access Functions/protectedRoute';
import { ThemeProvider } from './skeleton/utils/ThemeContext'
import { useDispatch, useSelector } from 'react-redux';
import { getAbout, getLicense } from './skeleton/functions/API Calls/database_calls';
import { ErrorMessage } from './skeleton/components/UI Components/AlertMessage';
import { getConnectedArduinos } from './skeleton/functions/Arduino Functions/getLinesFromArduino';
import { setAbout } from './skeleton/store/aboutSlice';
import { addNotification } from './skeleton/store/notificationSlice';
import { addMqtt } from './skeleton/store/mqttConnectionSlice';
import { ConnectionDetails } from './skeleton/functions/Program Functions/connection_functions';
import { setComms } from './skeleton/store/connectionSlice';
import UsersDetails from './skeleton/components/User Components/UsersDetails';
import SettingsMenu from './skeleton/components/Settings/SettingsMenu';
import About from './skeleton/components/User Components/About';


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

declare global {
  interface Window {
    __APP_CONFIG__?: { isPluginMode: boolean };
  }
}

/**
 * Create a router element that chooses the router type and routes
 * based on whether we are in plugin mode or standalone mode.
 */
export function AppRouter() {

  const isPluginMode = window.__APP_CONFIG__?.isPluginMode === true;
  const dispatch = useDispatch();
  const isSignIn = useSelector((state: any) => state.auth.isLoggedIn);
  const connectedSystem = useSelector((state: any) => state.connection_settings);

  // In plugin mode, use MemoryRouter to avoid interfering with the parent app's routing.
  // In standalone mode, use BrowserRouter for normal navigation.
  const RouterComponent = isPluginMode ? MemoryRouter : BrowserRouter;

  useEffect(() => {
    if (!isSignIn) {
      ConnectionDetails().then((res: any) => {
        console.log("Successfully Fetched Connection Settings", res);
        // (Object.entries)
        if (res.HTTP_SERVER_ADDR != '') {
          dispatch(setComms(res));
        }
      }).catch((err: any) => {
        ErrorMessage(`Error in connecting ${err}`);
      }).finally(() => {
        console.log("Setting Constants for App - Log Level & Telemetry Delay", connectedSystem);
      });
    }
  }, [isSignIn]);


  useEffect(() => {
    if (isSignIn && !connectedSystem.DEMO_MODE) {
      getConnectedArduinos().then((res) => {
        dispatch(addMqtt(res.data));
      }).catch((err) => {
        ErrorMessage(`Unable to connect to Hardware`);
      });
    }
  }, [isSignIn]);

  useEffect(() => {
    if (isSignIn) {
      getLicense().then((res) => {
        console.log(res.message)
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

  return (
    <ThemeProvider >
      <RouterComponent>
        <div>
          {/* <CurrentPath/> */}
          <Routes>
            {/* Common skeleton route */}
            <Route path="/" element={<SignIn />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path='/resetPassword' element={<ForgotPassword />} />
            <Route path='/dashboard' element={
              <ProtectedRoute>
                {/* <UploadFile /> */}
                <Layout children={<AccountMenu />} />
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
        </div>

      </RouterComponent>
    </ThemeProvider>
  );
}