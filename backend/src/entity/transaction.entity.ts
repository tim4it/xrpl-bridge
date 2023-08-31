import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('bigint', { nullable: true })
  ledgerIndex: number;

  @Column('varchar', { length: 100 })
  ledgerHash: string;

  @Column('varchar', { length: 40 })
  account: string;

  @Column('varchar', { length: 40 })
  destination: string;

  @Column('bigint')
  amount: number;

  @Column('bigint')
  fee: number;

  @Column('varchar', { length: 130 })
  txSignature: string;

  @Column('bigint')
  date: number;
}
