import * as actionTypes from '../actionTypes'
import { State } from '../../reducers/rootReducer'
import { Order } from '../../../containers/orders/Order'
import { loadState } from '../../../utils/localStorage'

export const checkState = () => {
  return (dispatch: any) => {
    const restoredState = loadState()

    if (restoredState) dispatch(restoreState(restoredState))
  }
}

export const restoreState = (state: State) => {
  return {
    type: actionTypes.RESTORE_STATE,
    state
  }
}

export const setOrders = (orders: Order[]) => {
  return {
    type: actionTypes.SET_ORDERS,
    orders
  }
}
