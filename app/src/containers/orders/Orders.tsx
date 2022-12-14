import { useEffect, useState, useCallback } from 'react'
import Title from '../../components/ui/Title'
import ListSummary from '../../components/ui/ListSummary'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'
import { appRoutes } from '../../routes'
import CountrySelector, {
  Country
} from '../../components/selectors/CountrySelector/CountrySelector'
import { Order } from './Order'
import { State } from '../../store/reducers/rootReducer'
import { connect, useDispatch } from 'react-redux'
import axiosConfig from '../../axiosConfig'
import { compareArrays, dateToMMDDYYYY } from '../../utils'
import { setOrders } from '../../store/actions/orders/orders'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

/*
Users should be able to view a list of their current Buy Orders. **Only show Buy Orders that contain at least one country currently selected in the Country Selection Control.**  Buy Orders should display the following information:
  - Name of the Buy Order
  - Date the Buy Order was created
*/

interface OrdersProps {
  ordersInState: Order[]
  countriesInState: Country[]
}

const Orders = (props: OrdersProps) => {
  const { ordersInState, countriesInState } = props

  const [orders, setComponentOrders] = useState<Order[]>(ordersInState)
  const dispatch = useDispatch()

  // REFACTOR: create custom hook
  const fetchOrders = useCallback(async () => {
    const response = await axiosConfig.get('/buy-orders').catch((err) => {
      // TODO: handle
      console.log(`🤖[err]🤖`, err)
    })

    if (response && response.status === 200 && response.data) {
      const fetchedOrders: Order[] = response.data

      if (!compareArrays(fetchedOrders, ordersInState)) {
        setComponentOrders(fetchedOrders)

        dispatch(setOrders(fetchedOrders))
      }
    }
  }, [ordersInState, dispatch])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const getOrderItem = (title: string, value: string) => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minWidth: 200
      }}
    >
      <span className="underlined" style={{ marginBottom: 10 }}>
        {title}
      </span>
      <span style={{ fontSize: '1.4rem' }}>{value}</span>
    </div>
  )

  const countries = countriesInState.reduce(
    (acc: Country[], country: Country) => {
      if (
        [...new Set(orders.flatMap((order) => order.countries))].includes(
          country.countryCode
        ) &&
        country.isSelected
      ) {
        acc.push(country)
      }

      return acc
    },
    []
  )

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        // maxWidth: 335, INFO: such width is mentioned at provided wireframe, but it does not look user-friendly. To fix- uncomment this line
        maxWidth: 1000,

        justifyContent: 'center'
      }}
    >
      <Title title="Your By Orders" />
      <Link
        to={`/${appRoutes.createOrder}`}
        style={{ marginBottom: 30 }}
        className="noDecoration"
      >
        <Button variant="contained" color="success">
          new order
        </Button>
      </Link>
      <ListSummary
        amount={orders.length}
        countries={countries.map((country) => country.name)}
      />
      <div style={{ display: 'flex', flexDirection: 'column', rowGap: 20 }}>
        {orders
          .filter((order) =>
            order.countries.find((countryCode) =>
              countries
                .map((country) => country.countryCode)
                .includes(countryCode)
            )
          )
          .map((order) => (
            <Link
              to={`/${appRoutes.viewOrder}?id=${order.id}`}
              key={order.id}
              className="noDecoration"
            >
              <Card>
                <CardContent>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between'
                    }}
                  >
                    {getOrderItem('Order Name', order.name)}
                    {getOrderItem(
                      'Date Created',
                      dateToMMDDYYYY(order.createdAt)
                    )}
                    {getOrderItem('Budget', '$' + order.budget)}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
      </div>
      <CountrySelector />
    </div>
  )
}

const mapStateToProps = (states: State) => {
  return {
    ordersInState: states.orders,
    countriesInState: states.countries
  }
}

export default connect(mapStateToProps)(Orders)
