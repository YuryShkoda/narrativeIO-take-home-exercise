import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import rootReducer from './store/reducers/rootReducer'
import { configureStore } from '@reduxjs/toolkit'
import { saveState } from './utils'
import _ from 'lodash'

const store = configureStore({ reducer: rootReducer })

store.subscribe(
  _.throttle(() => {
    saveState({
      countries: store.getState().countries,
      storedData: store.getState().storedData,
      datasets: store.getState().datasets,
      orders: store.getState().orders
    })
  }, 1000)
)

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
