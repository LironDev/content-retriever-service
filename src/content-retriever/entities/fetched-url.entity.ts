import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('fetched_urls')
export class FetchedUrl {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  originalUrl: string;

  @Column({ nullable: true })
  finalUrl: string;

  @Column({ nullable: true })
  httpStatus: number;

  @Column({ type: 'text', nullable: true })
  contentType: string;

  @Column({ type: 'blob', nullable: true })
  content: Buffer;

  @Column({ type: 'text', nullable: true })
  contentEncoding: string;

  @Column({ type: 'text', nullable: true })
  error: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  fetchedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  expiresAt: Date;
}
