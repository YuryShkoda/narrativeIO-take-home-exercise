import * as actionTypes from '../actionTypes'
import { StoredItem } from '../../../components/selectors/CountrySelector/CountrySelector'

export const setAvailableRecords = (storedItems: StoredItem[]) => {
  return {
    type: actionTypes.SET_AVAILABLE_RECORDS,
    items: storedItems
  }
}
