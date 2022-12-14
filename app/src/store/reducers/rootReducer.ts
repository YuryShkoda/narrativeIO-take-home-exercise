import { combineReducers } from 'redux'
import countriesReducer from './countries/countries'
import storedDataReducer from './storedData/storedData'
import datasetsReducer from './datasets/datasets'
import ordersReducer from './orders/orders'
import {
  Country,
  StoredItem
} from '../../components/selectors/CountrySelector/CountrySelector'
import { Dataset } from '../../containers/dataset/Dataset'
import { Order } from '../../containers/orders/Order'

export interface State {
  storedData: StoredItem[]
  countries: Country[]
  datasets: Dataset[]
  orders: Order[]
}

export default combineReducers({
  countries: countriesReducer,
  storedData: storedDataReducer,
  datasets: datasetsReducer,
  orders: ordersReducer
})
