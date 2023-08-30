import React from 'react';
import './App.css';
import AllWallets from './pages/allWallets';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/shared/layout';
import SendTransaction from './pages/sendTransaction';
import ViewTransaction from './pages/viewTransaction';
import AccountInfo from './pages/accountInfo';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element=<AllWallets/>></Route>
        <Route path="/send-transaction" element=<SendTransaction/>></Route>
        <Route path="/view-transaction" element=<ViewTransaction/>></Route>
        <Route path="/account-info" element=<AccountInfo/>></Route>
      </Routes>
    </Layout>
  );
}

export default App;
