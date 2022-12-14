import MainLayout from './layouts/Main'
import Orders from './containers/orders/Orders'
import Order, { OrderAction } from './containers/orders/Order'
import Datasets from './containers/dataset/Datasets'
import { Routes, Route, Navigate } from 'react-router-dom'
import { appRoutes } from './routes'

const App = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path={appRoutes.orders} element={<Orders />} />
        <Route
          path={appRoutes.createOrder}
          element={<Order action={OrderAction.Create} />}
        />
        <Route
          path={appRoutes.viewOrder}
          element={<Order action={OrderAction.View} />}
        />
        <Route
          path={appRoutes.editOrder}
          element={<Order action={OrderAction.Edit} />}
        />
        <Route path={appRoutes.datasets} element={<Datasets />} />
        <Route
          path="*"
          element={<Navigate to={`/${appRoutes.orders}`} replace />}
        />
      </Route>
    </Routes>
  )
}

export default App
