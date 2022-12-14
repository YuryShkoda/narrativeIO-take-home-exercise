import { Dataset } from '../../../containers/dataset/Dataset'
import * as actionTypes from '../../actions/actionTypes'

interface Action {
  type: string
  datasets?: Dataset[]
  state?: { datasets: Dataset[] }
}

const setDatasets = (action: Action) => {
  if (action.datasets) return action.datasets
}

const storedDataRestoreState = (action: Action) => {
  return action.state?.datasets
}

const reducer = (state: Dataset[] | undefined, action: Action) => {
  if (!state) state = []

  switch (action.type) {
    case actionTypes.SET_DATASETS:
      return setDatasets(action)
    case actionTypes.RESTORE_STATE:
      return storedDataRestoreState(action)
    default:
      return state
  }
}

export default reducer
