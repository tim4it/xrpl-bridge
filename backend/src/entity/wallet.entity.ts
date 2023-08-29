import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 100 })
  publicKey: string;

  @Column('varchar', { length: 40 })
  address: string;

  @Column('varchar', { length: 40 })
  seed: string;
}
