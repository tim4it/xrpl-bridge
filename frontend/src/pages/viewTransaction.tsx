import React from 'react';
import { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ViewTransaction = () => {
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [transaction, setTransaction] = useState([{
    ledger_index: '',
    ledger_hash: '',
    account: '',
    destination: '',
    amount: '',
    fee: '',
    tx_signature: '',
    date: '',
  }]);
  const [includeDetails, setIncludeDetails] = useState(true);
  const [formData, setFormData] = useState({
    address: '',
    isSource: includeDetails,
  });
  const navigate = useNavigate();

  const fetchTransaction = () => {
    setIsButtonVisible(false);
    axios.get('http://localhost:3000/v1/tx/all').then((response) => {
      setTransaction(response.data)
      setIsButtonVisible(true);
    }).catch((error) => {
      console.error('Error viewing transaction:', error);
      setIsButtonVisible(true);
    });
  };

  const filterTransaction = () => {
    setIsButtonVisible(false);
    const requestData = {
      address: formData.address,
      isSource: includeDetails,
    };
    axios.post('http://localhost:3000/v1/tx/all', requestData).then((response) => {
      setTransaction(response.data)
      setIsButtonVisible(true);
    }).catch((error) => {
      console.error('Error viewing filtering transaction:', error);
      setIsButtonVisible(true);
    });
  };

  useEffect(() => {
  }, []);

  return (
    <>
      <Container className="mt-2 custom-container">
        <Row>
          <Col className="col-md-4 offset-md-4">
            <Button variant="primary" type="button" onClick={() => navigate('/')}>
              Navigate to Wallets
            </Button>
            <Button variant="primary" type="button" onClick={() => navigate('/send-transaction')}>
              Navigate to Send transaction
            </Button>
            <Button variant="primary" type="button" onClick={() => navigate('/account-info')}>
              Navigate to Account info
            </Button>
          </Col>
        </Row>
        <hr></hr>
        <Row>
          <Col>
            <Button variant="primary" type="button" disabled={!isButtonVisible} onClick={() => fetchTransaction()}>
              View all transactions
            </Button>
          </Col>
          <br></br>
          <Col>
            <label htmlFor="address" >Account&nbsp;&nbsp;</label>
            <input type="text" id="address" value={formData.address} size={40}
                   onChange={(e) => setFormData({ ...formData, address: e.target.value })}/>
          </Col>
          <Col>
            <label htmlFor="source">Source address&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
            <input type="checkbox" id="source" checked={includeDetails}
                   onChange={(e) => setIncludeDetails(e.target.checked)}/>
          </Col>
          <Col className="col-md-4 offset-md-4">
            <Button variant="primary" type="button" disabled={!isButtonVisible} onClick={() => filterTransaction()}>
              Search
            </Button>
          </Col>
        </Row>
        <br></br>
        <Table striped bordered hover>
          <thead>
          <tr>
            <th>Ledger index</th>
            <th>Ledger hash</th>
            <th>Account</th>
            <th>Destination</th>
            <th>Amount</th>
            <th>Fee</th>
            <th>Tx signature</th>
            <th>Date</th>
          </tr>
          </thead>
          <tbody>
          {transaction.map((tx) => (
            <tr>
              <td>{tx.ledger_index}</td>
              <td>{tx.ledger_hash}</td>
              <td>{tx.account}</td>
              <td>{tx.destination}</td>
              <td>{tx.amount}</td>
              <td>{tx.fee}</td>
              <td>{tx.tx_signature}</td>
              <td>{tx.date}</td>
            </tr>
          ))}
          </tbody>
        </Table>
      </Container>
    </>
  );
};

export default ViewTransaction;