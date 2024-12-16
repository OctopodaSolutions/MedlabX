// NavigationHandler.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventBus } from './event_bus';

/**
 * Component that listens for 'navigate' events on the event bus and handles navigation 
 * to the specified path using the `navigate` function from `react-router-dom`.
 * 
 * This component sets up an effect that subscribes to 'navigate' events when mounted 
 * and unsubscribes when unmounted. When a 'navigate' event is received, it navigates 
 * to the specified path using the `navigate` function.
 * 
 * @returns {null} This component does not render anything.
 */
function NavigationHandler() {
  const navigate = useNavigate();
  
  useEffect(() => {
    /**
     * Handles navigation by calling `navigate` with the provided path.
     * 
     * @param {string} path - The path to navigate to.
     */
    const handleNavigation = (path) => {
      navigate(path, { replace: true });
    };

    console.log("NAVIGATE CALLED");
    eventBus.on('navigate', handleNavigation);
    
    return () => {
      eventBus.off('navigate', handleNavigation);
    };
  }, [navigate]);
  
  return null; 
}

export default NavigationHandler;
