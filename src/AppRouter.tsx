import React from 'react';
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom';
import Layout from './skeleton/Layout';
import CustomTab from './custom/CustomTab';
import SignIn, { ForgotPassword, SignUp } from './skeleton/components/User Components/SignIn';
import UploadFile from './skeleton/components/User Components/UploadFile';


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

  // In plugin mode, use MemoryRouter to avoid interfering with the parent app's routing.
  // In standalone mode, use BrowserRouter for normal navigation.
  const RouterComponent = isPluginMode ? MemoryRouter : BrowserRouter;

  return (
    <RouterComponent>
      <Routes>
        {/* Common skeleton route */}
        <Route path="/" element={<SignIn/>} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path='/resetUser' element={<ForgotPassword />} />
        <Route path='/dashboard' element={<UploadFile/>} />

        
        {/* If needed, add plugin-specific routes only in plugin mode */}
        {isPluginMode && (
          <Route path="/plugin-feature" element={<CustomTab />} />
        )}
      </Routes>
    </RouterComponent>
  );
}