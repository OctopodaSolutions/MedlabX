import React from 'react';
import CustomTab from '../custom/CustomTab';

// Shared layout component
const Layout = ({ children }) => {
    return (
        <div>
            <header>Skeleton Header</header>
            <main>{children}</main>
        </div>
    );
};

export default Layout;