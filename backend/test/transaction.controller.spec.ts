import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from '../src/transaction/transaction.controller';
import { TransactionService } from '../src/transaction/transaction.service';
import { WalletService } from '../src/wallet/wallet.service';
import { WalletController } from '../src/wallet/wallet.controller';
import { TransactionFilterDto } from '../src/dto/transaction.filter.dto';

const transactionDto: TransactionFilterDto = {
  address: 'address',
  isSource: true,
};

describe('Transaction controller', () => {
  let transactionController: TransactionController;
  let transactionService: TransactionService;
  let walletService: WalletService;

  beforeEach(async () => {
    jest
      .spyOn(TransactionController.prototype, <any>'sendData')
      .mockImplementation(async () => {
        return { a: 'b' };
      });
    jest
      .spyOn(TransactionController.prototype, <any>'accountInfoData')
      .mockImplementation(async () => {
        return { a: 'b' };
      });
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController, WalletController],
      providers: [
        TransactionService,
        {
          provide: TransactionService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([
              {
                ledger_index: 'ledger_index',
                ledger_hash: 'ledger_hash',
              },
              {
                ledger_index: 'ledger_index',
                ledger_hash: 'ledger_hash',
              },
            ]),
            findByTransactionAddress: jest.fn().mockImplementation(() =>
              Promise.resolve([
                {
                  ledger_index: 'ledger_index',
                  ledger_hash: 'ledger_hash',
                },
              ]),
            ),
            remove: jest.fn(),
          },
        },
        WalletService,
        {
          provide: WalletService,
          useValue: {
            findByAddress: jest.fn().mockImplementation(() =>
              Promise.resolve({
                publicKey:
                  'ED0F4F0F0E8460A23914DCF98514404C6D95BEFE489D3CBCBF6E4F05D41B0240FC',
                address: 'rM2H7jAwwidKsoFdsjN3yVwFW5h2ZagG11',
                seed: 'sEdSyZLPp1JUDZCgkN6Cg9BsPDt84Fa',
              }),
            ),
          },
        },
      ],
    }).compile();

    transactionController = app.get<TransactionController>(
      TransactionController,
    );
    transactionService = app.get<TransactionService>(TransactionService);
    walletService = app.get<WalletService>(WalletService);
  });

  it('should be defined', () => {
    expect(transactionController).toBeDefined();
  });

  describe('findAll()', () => {
    it('should find all transactions ', () => {
      transactionController.getAllTransactions();
      expect(transactionService.findAll).toHaveBeenCalled();
    });
  });

  describe('findByTransactionAddress()', () => {
    it('should find all filtered transactions ', () => {
      transactionController.getFilteredTransactions(transactionDto);
      expect(transactionService.findByTransactionAddress).toHaveBeenCalled();
    });
  });

  describe('send()', () => {
    it('send transaction from source to destination ', () => {
      transactionController.send({
        transaction_type: 'Payment',
        source: 'rM2H7jAwwidKsoFdsjN3yVwFW5h2ZagG11',
        destination: 'rNzGhHvbR266ZXSbz128cfS5rh1KfLSjdZ',
        amount: 20,
      });
      expect(walletService.findByAddress).toHaveBeenCalled();
    });
  });

  describe('accountInfo()', () => {
    it('send transaction from source to destination ', () => {
      transactionController.accountInfo({
        account: 'rM2H7jAwwidKsoFdsjN3yVwFW5h2ZagG11',
      });
      expect(walletService.findByAddress).toHaveBeenCalled();
    });
  });
});
