import React from 'react';
import { useEffect, useState } from 'react';
import { Container, Table, Row, Col, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AllWallets = () => {
  const [wallets, setWallets] = useState([{
        public_key: '',
        address: '',
        seed: '',
      }]);
  const [showModal, setShowModal] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const navigate = useNavigate();
  const closeModal = () => {
    setShowModal(false);
    fetchData()
  };

  const fetchData = () => {
    axios.get('http://localhost:3000/v1/wallet').then((response) => {
      setWallets(response.data);
    });
  };

  const fetchNewWallet = () => {
    setIsButtonVisible(false);
    axios.get('http://localhost:3000/v1/wallet/new').then(() => {
      setIsButtonVisible(true);
      setShowModal(true);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Container className="mt-2 custom-container">
          <Row>
            <Col className="col-md-4 offset-md-4">
              <Button variant="primary" type="button" onClick={() => navigate('/send-transaction')}>
                Navigate to Send transaction
              </Button>
              <Button variant="primary" type="button" onClick={() => navigate('/view-transaction')}>
                Navigate to View transaction
              </Button>
              <Button variant="primary" type="button" onClick={() => navigate('/account-info')}>
                Navigate to Account info
              </Button>
            </Col>
          </Row>
          <hr></hr>
          <Row>
            <Col className="col-md-4 offset-md-4">
              <Button variant="primary" type="button" onClick={() => fetchData()}>
                Refresh
              </Button>
              <Button variant="primary" type="button" disabled={!isButtonVisible} onClick={() => fetchNewWallet()}>
                Create new TEST wallet
              </Button>
            </Col>
          </Row>
          <br></br>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Public key</th>
                <th>Address</th>
                <th>Seed</th>
              </tr>
            </thead>
            <tbody>
            {wallets.map((wallet) => (
                <tr>
                  <td>{wallet.public_key}</td>
                  <td>{wallet.address}</td>
                  <td>{wallet.seed}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
        <Modal show={showModal} onHide={closeModal} centered className="custom-modal" style={{ zIndex: 9999 }}>
          <Modal.Header closeButton>
            <Modal.Title>Test WALLET created!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            New test wallet was successfully created.<br></br>Data will be refreshed on close!
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
      );
    };

export default AllWallets;