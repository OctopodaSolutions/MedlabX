import React from 'react';

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