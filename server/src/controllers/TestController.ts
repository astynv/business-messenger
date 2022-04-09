import faker from 'faker'

import GenericController from './GenericController'
import { Test } from '../entities'

export default class TestController extends GenericController {
  async getAll (): Promise<Test[]> {
    return await this.em.find(Test, {})
  }

  async createRandom (): Promise<Test> {
    const title = faker.lorem.words(3)
    const description = faker.lorem.paragraph()

    const test = new Test(title, description)
    this.em.persist(test)

    await this.em.flush()

    return test
  }
}
