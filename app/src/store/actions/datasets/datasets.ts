import * as actionTypes from '../actionTypes'
import { Dataset } from '../../../containers/dataset/Dataset'

export const setDatasets = (datasets: Dataset[]) => {
  return {
    type: actionTypes.SET_DATASETS,
    datasets
  }
}
