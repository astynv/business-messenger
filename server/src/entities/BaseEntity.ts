import {
  Entity,
  PrimaryKey,
  SerializedPrimaryKey
} from '@mikro-orm/core'
import { ObjectId } from '@mikro-orm/mongodb'

@Entity({ abstract: true })
export default abstract class BaseEntity {
  @PrimaryKey()
  _id!: ObjectId

  @SerializedPrimaryKey({ hidden: true })
  id!: string
}
