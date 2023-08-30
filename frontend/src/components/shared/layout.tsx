import { Container } from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode; // Explicitly type the children prop
}

const Layout: React.FC<LayoutProps> = ({children}) => {
  return (
    <>
      <Navbar bg="primary" variant="dark">
        <Navbar.Brand>Navbar</Navbar.Brand>
      </Navbar>
      <Container>{children}</Container>
    </>
  );
};

export default Layout;
