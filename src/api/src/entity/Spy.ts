import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm'
import { Profile } from './Profile'

@Entity()
export class Spy {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  scrapingRate: number

  @ManyToMany(() => Profile)
  @JoinTable()
  profiles: Profile[]
}
