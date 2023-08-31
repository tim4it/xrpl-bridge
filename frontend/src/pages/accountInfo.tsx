import React from 'react';
import { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AccountInfo = () => {
  const [accountInfo, setAccountInfo] = useState({
    result: {
      account_data: {
        Account: '',
        Balance: '',
        Flags: 0,
        LedgerEntryType: '',
        OwnerCount: 0,
        PreviousTxnID: '',
        PreviousTxnLgrSeq: 0,
        Sequence: 0,
        index: '',
      },
      ledger_hash: '',
      ledger_index: 0,
    }
  });
  const [formData, setFormData] = useState({
    account: '',
  });
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const navigate = useNavigate();


  const fetchAccountInfo = () => {
    setIsButtonVisible(false);
    const requestData = {
      account: formData.account,
    };
    axios.post('http://localhost:3000/v1/tx/account-info', requestData).then((response) => {
      setAccountInfo(response.data)
      setIsButtonVisible(true);
    }).catch((error) => {
      console.error('Error viewing account info:', error);
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
              <Button variant="primary" type="button" onClick={() => navigate('/view-transaction')}>
                Navigate to View transaction
              </Button>
            </Col>
          </Row>
          <hr></hr>
          <Row>
            <Col>
              <label htmlFor="transactionType">Address&nbsp;&nbsp;</label>
              <input type="text" id="transactionType" value={formData.account} size={40}
                     onChange={(e) => setFormData({ ...formData, account: e.target.value })}/>
            </Col>
            <Col className="col-md-4 offset-md-4">
              <Button variant="primary" type="button" disabled={!isButtonVisible} onClick={() => fetchAccountInfo()}>
                Account info
              </Button>
            </Col>
          </Row>
          <br></br>
          <Row>
            <Col>
              <label>Ledger index:&nbsp;&nbsp;</label>
              <label>{accountInfo.result.ledger_index}</label>
            </Col>
            <Col>
              <label>Ledger hash:&nbsp;&nbsp;</label>
              <label>{accountInfo.result.ledger_hash}</label>
            </Col>
            <Col>
              <label>Account:&nbsp;&nbsp;</label>
              <label>{accountInfo.result.account_data.Account}</label>
            </Col>
            <Col>
              <label>Balance:&nbsp;&nbsp;</label>
              <label>{accountInfo.result.account_data.Balance}</label>
            </Col>
            <Col>
              <label>Flags:&nbsp;&nbsp;</label>
              <label>{accountInfo.result.account_data.Flags}</label>
            </Col>
            <Col>
              <label>Ledger entry type:&nbsp;&nbsp;</label>
              <label>{accountInfo.result.account_data.LedgerEntryType}</label>
            </Col>
            <Col>
              <label>Owner count:&nbsp;&nbsp;</label>
              <label>{accountInfo.result.account_data.OwnerCount}</label>
            </Col>
            <Col>
              <label>Previous Txn ID:&nbsp;&nbsp;</label>
              <label>{accountInfo.result.account_data.PreviousTxnID}</label>
            </Col>
            <Col>
              <label>Previous Txn Lgr Seq:&nbsp;&nbsp;</label>
              <label>{accountInfo.result.account_data.PreviousTxnLgrSeq}</label>
            </Col>
            <Col>
              <label>Sequence:&nbsp;&nbsp;</label>
              <label>{accountInfo.result.account_data.Sequence}</label>
            </Col>
            <Col>
              <label>Index:&nbsp;&nbsp;</label>
              <label>{accountInfo.result.account_data.index}</label>
            </Col>
          </Row>

        </Container>
      </>
      );
    };

export default AccountInfo;