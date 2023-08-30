import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from '../src/transaction/transaction.controller';
import { TransactionService } from '../src/transaction/transaction.service';
import { WalletService } from '../src/wallet/wallet.service';
import { WalletController } from '../src/wallet/wallet.controller';
import { WalletDto } from '../src/dto/wallet.dto';

const walletDto: WalletDto = {
  public_key: 'public key',
  address: 'address',
  seed: 'seed',
};

describe('Wallet controller', () => {
  let walletController: WalletController;
  let walletService: WalletService;

  beforeEach(async () => {
    jest
      .spyOn(WalletController.prototype, <any>'findAndSubscribe')
      .mockImplementation(async () => {
        return [
          {
            public_key: 'public key',
            address: 'address',
            seed: 'seed',
          },
          {
            public_key: 'public key1',
            address: 'address1',
            seed: 'seed1',
          },
        ] as WalletDto[];
      });
    const app: TestingModule = await Test.createTestingModule({
      controllers: [WalletController, TransactionController],
      providers: [
        WalletService,
        {
          provide: WalletService,
          useValue: {
            findAll: jest
              .fn()
              .mockImplementation(() =>
                Promise.resolve([walletDto, walletDto, walletDto]),
              ),
            create: jest
              .fn()
              .mockImplementation(() => Promise.resolve(walletDto)),
            update: jest
              .fn()
              .mockImplementation(() => Promise.resolve(walletDto)),
            remove: jest
              .fn()
              .mockImplementation(() => Promise.resolve(walletDto)),
          },
        },
        TransactionService,
        {
          provide: TransactionService,
          useValue: {},
        },
      ],
    }).compile();

    walletController = app.get<WalletController>(WalletController);
    walletService = app.get<WalletService>(WalletService);
  });

  it('should be defined', () => {
    expect(walletController).toBeDefined();
  });

  describe('findAll()', () => {
    it('should find all wallet information', () => {
      walletController.getWallets();
      expect(walletService.findAll).toHaveBeenCalled();
    });
  });

  describe('addWallet()', () => {
    it('should add specific wallet', () => {
      walletController.addWallet({
        address: 'address',
        public_key: 'public key',
        seed: 'seed',
      });
      expect(walletService.create).toHaveBeenCalled();
    });
  });

  describe('updateWallet()', () => {
    it('should update specific wallet', () => {
      walletController.updateWallet({
        current_address: 'current address',
        new_address: 'new address',
        new_seed: 'new seed',
      });
      expect(walletService.update).toHaveBeenCalled();
    });
  });

  describe('deleteWallet()', () => {
    it('should delete specific wallet', () => {
      walletController.deleteWallet({
        address: 'address',
      });
      expect(walletService.remove).toHaveBeenCalled();
    });
  });
});
