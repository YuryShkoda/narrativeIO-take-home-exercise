import { Order } from '../../../containers/orders/Order'
import * as actionTypes from '../../actions/actionTypes'

interface Action {
  type: string
  orders?: Order[]
  state?: { orders: Order[] }
}

const setOrders = (action: Action) => {
  if (action.orders) return action.orders
}

const storedDataRestoreState = (action: Action) => {
  return action.state?.orders
}

const reducer = (state: Order[] | undefined, action: Action) => {
  if (!state) state = []

  switch (action.type) {
    case actionTypes.SET_ORDERS:
      return setOrders(action)
    case actionTypes.RESTORE_STATE:
      return storedDataRestoreState(action)
    default:
      return state
  }
}

export default reducer
