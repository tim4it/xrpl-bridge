import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('integer', { nullable: true })
  ledgerIndex: number;

  @Column('varchar', { length: 100 })
  ledgerHash: string;

  @Column('varchar', { length: 40 })
  account: string;

  @Column('varchar', { length: 40 })
  destination: string;

  @Column('integer')
  amount: number;

  @Column('integer')
  fee: number;

  @Column('varchar', { length: 130 })
  txSignature: string;

  @Column('integer')
  date: number;
}
