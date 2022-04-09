import {
  Request,
  Response
} from 'express'

import GenericApi from './GenericApi'

export default class TestApi extends GenericApi {
  get = async (req: Request, res: Response): Promise<void> => {
    const ec = this.getEntityControllers()

    const tests = await ec.Test.getAll()

    res.json(tests)
  }

  post = async (req: Request, res: Response): Promise<void> => {
    const ec = this.getEntityControllers()

    const test = await ec.Test.createRandom()

    res.json(test)
  }
}
