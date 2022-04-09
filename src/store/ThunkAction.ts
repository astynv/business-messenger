import { Action } from 'redux'
import RootState from './RootState'

type ThunkAction = (
  dispatch: (action: Action) => any,
  getState: () => RootState
) => Promise<void>

export default ThunkAction
