import React from 'react';
import CustomTab from '../custom/CustomTab';
// import { AppBar } from '@mui/material';
import ResponsiveAppBar from '../skeleton/components/Navigation/AppBar';

// Shared layout component
const Layout = ({ children }) => {
    console.log("RENDERING Layout");
    return (
        <div>
            <ResponsiveAppBar/>
            {/* <DashboardMenu/> */}
            <main>{children}</main>
        </div>
    );
};

export default Layout;