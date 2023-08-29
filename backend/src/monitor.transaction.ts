import { TransactionService } from './transaction/transaction.service';
import { Transaction } from './entity/transaction.entity';
import { WebSocket } from 'ws';

let socketData = null;

/**
 * Subscribe to all wallets addresses in the system
 * @param account all wallet accounts
 * @param transactionService transaction service
 */
export async function subscribeToAccount(
  account: string[],
  transactionService: TransactionService,
) {
  try {
    if (socketData != null) socketData.close();
    if (account.length == 0) return;
    const socket = new WebSocket('wss://s.altnet.rippletest.net:51233');
    socket.addEventListener('message', (event) => {
      const result = JSON.parse(event.data);
      if (
        result.hasOwnProperty('engine_result') &&
        result.hasOwnProperty('ledger_hash') &&
        result.hasOwnProperty('ledger_index')
      ) {
        writeTxToDB(result, transactionService);
      }
    });
    socketData = socket;
    socket.addEventListener('open', async () => {
      // This callback runs when the connection is open
      // const response = await api_request({ command: 'ping' });
      console.log(`Monitor addresses: ${account}`);
      const subscribeCommand = {
        command: 'subscribe',
        accounts: account,
      };
      await api_request(subscribeCommand, socket);
    });
  } catch (error) {
    console.log(`Error in wallet subscription: ${JSON.stringify(error.data)}`);
  }
}

async function writeTxToDB(tx: any, transactionService: TransactionService) {
  console.log(`Write data to db! ${JSON.stringify(tx)}`);
  const transaction = new Transaction();
  transaction.ledgerIndex = Number(tx.ledger_index);
  transaction.ledgerHash = tx.ledger_hash;
  transaction.account = tx.transaction.Account;
  transaction.destination = tx.transaction.Destination;
  transaction.amount = tx.transaction.Amount;
  transaction.fee = tx.transaction.Fee;
  transaction.txSignature = tx.transaction.TxnSignature;
  transaction.date = tx.transaction.date;
  await transactionService.create(transaction);
}

function api_request(options, socket: WebSocket) {
  if (socket.readyState === 0) {
    console.error('Socket is not connected yet');
    return;
  }
  new Promise((_, reject) => {
    try {
      socket.send(JSON.stringify(options));
    } catch (error) {
      reject(error);
    }
  });
}
