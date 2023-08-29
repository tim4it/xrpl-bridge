import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../entity/transaction.entity';
import { TransactionDto } from '../dto/transacton.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async create(transaction: Transaction): Promise<TransactionDto> {
    return this.transactionRepository
      .save(transaction)
      .then((transactionData) => TransactionDto.fromEntity(transactionData));
  }

  async findAll(): Promise<TransactionDto[]> {
    return await this.transactionRepository
      .find()
      .then((transactions) =>
        transactions.map((transaction) =>
          TransactionDto.fromEntity(transaction),
        ),
      );
  }

  async findByTransactionAddress(
    addressFind: string,
    isSource: boolean,
  ): Promise<Transaction[] | null> {
    return this.transactionRepository
      .findBy(
        isSource ? { account: addressFind } : { destination: addressFind },
      )
      .then((walletFound) => {
        if (walletFound == null || walletFound.length == 0)
          throw new NotFoundException(
            `Provided wallet transactions '${addressFind}' can't be found`,
          );
        return walletFound;
      });
  }

  async remove(id: number): Promise<void> {
    await this.transactionRepository.delete(id);
  }
}
