import { StoredItem } from '../../../components/selectors/CountrySelector/CountrySelector'
import * as actionTypes from '../../actions/actionTypes'

interface Action {
  type: string
  items: StoredItem[]
  state?: { storedData: StoredItem[] }
}

const setAvailableRecords = (action: Action) => {
  const ids = [
    ...new Set(action.items.map((item: StoredItem) => item.datasetId))
  ]

  const availableRecords: StoredItem[] = []

  ids.forEach((id: number) => {
    const records = action.items.filter(
      (item: StoredItem) => item.datasetId === id
    )

    availableRecords.push({
      datasetId: id,
      recordCount: records.reduce(
        (acc: number, item: StoredItem) => acc + item.recordCount,
        0
      )
    })
  })

  return availableRecords
}

const storedDataRestoreState = (action: Action) => {
  return action.state?.storedData
}

const reducer = (state: StoredItem[] | undefined, action: Action) => {
  if (!state) state = []

  switch (action.type) {
    case actionTypes.SET_AVAILABLE_RECORDS:
      return setAvailableRecords(action)
    case actionTypes.RESTORE_STATE:
      return storedDataRestoreState(action)
    default:
      return state
  }
}

export default reducer
