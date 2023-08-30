import React from 'react';
import { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SendTransaction = () => {
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [transaction, setTransaction] = useState([{
    account: '',
    balances: [{
      currency: '',
      value: '',
    }]
  }]);
  const [formData, setFormData] = useState({
    transaction_type: '',
    source: '',
    destination: '',
    amount: '',
  });
  const navigate = useNavigate();

  const fetchTransaction = () => {
    setIsButtonVisible(false);
    const requestData = {
      transaction_type: formData.transaction_type,
      source: formData.source,
      destination: formData.destination,
      amount: formData.amount,
    };
    axios.post('http://localhost:3000/v1/tx/send', requestData).then((response) => {
      setIsButtonVisible(true);
      setTransaction(response.data)
    }).catch((error) => {
      console.error('Error sending transaction:', error);
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
          <Col>
            <label htmlFor="transactionType" >Transaction type ('Payment')&nbsp;&nbsp;</label>
            <input type="text" id="transactionType" value={formData.transaction_type} size={10}
                   onChange={(e) => setFormData({ ...formData, transaction_type: e.target.value })}/>
          </Col>
          <Col>
            <label htmlFor="source">Source address&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
            <input type="text" id="source" value={formData.source} size={40}
                   onChange={(e) => setFormData({ ...formData, source: e.target.value })}/>
          </Col>
          <Col className="col-md-4 offset-md-4">
            <label htmlFor="destination">Destination address&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
            <input type="text" id="destination" value={formData.destination} size={40}
                   onChange={(e) => setFormData({ ...formData, destination: e.target.value })}/>
          </Col>
          <Col className="col-md-4 offset-md-4">
            <label htmlFor="amount">Amount&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
            <input type="text" id="amount" value={formData.amount} size={20}
                   onChange={(e) => setFormData({ ...formData, amount: e.target.value })}/>
          </Col>
          <Col className="col-md-4 offset-md-4">
            <Button variant="primary" type="button" disabled={!isButtonVisible} onClick={() => fetchTransaction()}>
              Send
            </Button>
          </Col>
        </Row>
        <br></br>
        <Table striped bordered hover>
          <thead>
          <tr>
            <th>Account</th>
            <th>Currency</th>
            <th>Balance</th>
          </tr>
          </thead>
          <tbody>
          {transaction.map((entry, index) => (
            <React.Fragment key={index}>
              <tr>
                <td rowSpan={entry.balances.length}>{entry.account}</td>
                <td>{entry.balances[0].currency}</td>
                <td>{entry.balances[0].value}</td>
              </tr>
              {entry.balances.slice(1).map((balance, subIndex) => (
                <tr key={subIndex}>
                  <td>{balance.currency}</td>
                  <td>{balance.value}</td>
                </tr>
              ))}
            </React.Fragment>
          ))}
          </tbody>
        </Table>
      </Container>
    </>
  );
};

export default SendTransaction;