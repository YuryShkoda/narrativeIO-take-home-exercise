import { useEffect, useCallback, useState } from 'react'
import CountrySelector, {
  Country
} from '../../components/selectors/CountrySelector/CountrySelector'
import Title from '../../components/ui/Title'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import CardMedia from '@mui/material/CardMedia'
import { Dataset } from '../dataset/Dataset'
import { connect, useDispatch } from 'react-redux'
import { compareArrays, dateToMMDDYYYY } from '../../utils'
import { setDatasets } from '../../store/actions/datasets/datasets'
import { State } from '../../store/reducers/rootReducer'
import { filterDatasetsByCountries } from '../dataset/Datasets'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import { useSearchParams, Link } from 'react-router-dom'
import axiosConfig from '../../axiosConfig'
import { appRoutes } from '../../routes'

// INFO: Buy order example
// {
//   "id": Number, // the internal id of the Buy Order
//   "name": String, // the name of the Buy Order
//   "createdAt": Date, // the date at which the Buy Order was created
//   "datasetIds": Array[Number], // a list of the Datasets from which to purchase
//   "countries": Array[String] // a list of the two-digit country codes from which to purchase data,
//   "budget": Number // the maximum cost of the Buy Order in USD
// }

export interface Order {
  name: string
  createdAt: Date
  datasetIds: number[]
  countries: string[]
  budget: number
  id?: string
}

export enum OrderAction {
  Create = 'create',
  View = 'view',
  Edit = 'edit'
}

interface NewOrderProps {
  datasetsInState: Dataset[]
  countriesInState: Country[]
  ordersInState: Order[]
  action: OrderAction
}

const OrderComponent = (props: NewOrderProps) => {
  const [action, setAction] = useState<OrderAction | undefined>(props.action)
  const { datasetsInState, countriesInState, ordersInState } = props
  const [searchParams] = useSearchParams()
  const orderId: string | null = searchParams.get('id')
  const existingOrder = orderId
    ? ordersInState.find((order) => order.id === orderId)
    : undefined

  const [componentDatasets, setComponentDatasets] = useState<Dataset[]>(
    action === OrderAction.View
      ? datasetsInState.filter((dataset) =>
          existingOrder!.datasetIds.includes(dataset.id)
        )
      : datasetsInState
  )

  useEffect(() => {
    if (action === OrderAction.Edit) setComponentDatasets(datasetsInState)
  }, [datasetsInState, action])

  const dispatch = useDispatch()
  const [selectedDataSetIds, setSelectedDataSetIds] = useState<number[]>(
    existingOrder?.datasetIds || []
  )
  const [orderName, setOrderName] = useState<string>(existingOrder?.name || '')
  const [budget, setBudget] = useState<number>(existingOrder?.budget || 0)
  const [alert, setAlert] = useState<{
    text: string
    severity: 'error' | 'success' | 'info' | 'warning'
  }>({ text: '', severity: 'info' })

  const fetchDatasets = useCallback(async () => {
    const response = await axiosConfig.get('/datasets').catch((err) => {
      // TODO: handle
      console.log(`🤖[err]🤖`, err)
    })

    if (response && response.status === 200 && response.data) {
      const fetchedDatasets: Dataset[] = response.data

      if (!compareArrays(fetchedDatasets, datasetsInState)) {
        setComponentDatasets(fetchedDatasets)
        dispatch(setDatasets(fetchedDatasets))
      }
    }
  }, [datasetsInState, dispatch])

  useEffect(() => {
    if (!datasetsInState.length) fetchDatasets()
  }, [datasetsInState, fetchDatasets])

  const submitOrder = async () => {
    const selectedCountries = countriesInState.filter(
      (country) => country.isSelected
    )
    const datasetIdsInSelectedCountries = [
      ...new Set(
        selectedCountries
          .flatMap((country) =>
            country.storedData.map((item) =>
              item.recordCount > 0 ? item.datasetId : undefined
            )
          )
          .filter((id) => id)
      )
    ]

    // TODO: improve validation
    if (
      !orderName ||
      !budget ||
      !selectedCountries.length ||
      !datasetIdsInSelectedCountries ||
      !selectedDataSetIds.length
    ) {
      setAlert({
        severity: 'error',
        text: 'Please provide necessary information in order to create Buy Order.'
      })

      return
    }

    const order: Order = {
      name: orderName,
      budget,
      createdAt: new Date(),
      datasetIds: selectedDataSetIds.filter((id) =>
        datasetIdsInSelectedCountries.includes(id)
      ),
      countries: selectedCountries.map((country) => country.countryCode)
    }

    if (action === OrderAction.Create) {
      const response = await axiosConfig
        .post('/buy-orders', order)
        .catch((err) => {
          // TODO: handle
          console.log(`🤖[err]🤖`, err)
        })

      if (response && response.status === 201) {
        setAlert({
          severity: 'success',
          text: 'Order has been successfully created.'
        })
      } else {
        setAlert({
          severity: 'warning',
          text: 'Order was not created. Check the console for more info.'
        })

        console.log(
          `Server responded on order creating request. Response: ${response}`
        )
      }
    } else if (action === OrderAction.Edit) {
      const response = await axiosConfig
        .put('/buy-orders/' + existingOrder?.id, order)
        .catch((err) => {
          // TODO: handle
          console.log(`🤖[err]🤖`, err)
        })

      if (response && response.status === 200) {
        setAlert({
          severity: 'success',
          text: 'Order has been successfully updated.'
        })
      } else {
        setAlert({
          severity: 'warning',
          text: 'Order was not updated. Check the console for more info.'
        })

        console.log(
          `Server responded on order update request. Response: ${response}`
        )
      }
    }
  }

  const deleteOrder = async () => {
    const response = await axiosConfig
      .delete(`/buy-orders/${existingOrder?.id}`)
      .catch((err) => err)

    if (response && response.status === 200) {
      setAlert({
        severity: 'success',
        text: 'Order has been successfully deleted.'
      })
    } else {
      setAlert({
        severity: 'warning',
        text: 'Order was not deleted. Check the console for more info.'
      })

      console.log(
        `Server responded on order deletion request. Response: ${response}`
      )
    }
  }

  const getTextField = (
    id: string,
    handler: (event: any) => void,
    type?: string
  ) => (
    <TextField
      id={id}
      label=""
      variant="outlined"
      sx={{ marginTop: 1, marginBottom: 3, width: '100%' }}
      size="small"
      onChange={handler}
      type={type || undefined}
    />
  )

  const getControlledField = (
    value: string | number,
    handler: (event: any) => void,
    type?: string
  ) => (
    <TextField
      id={`${value}-controlled`}
      label=""
      variant="outlined"
      sx={{ marginTop: 1, marginBottom: 3, width: '100%' }}
      size="small"
      onChange={handler}
      value={value}
      disabled
      type={type || undefined}
    />
  )

  return (
    <div>
      <Title
        title={
          action === OrderAction.Create
            ? 'New Buy Order'
            : action === OrderAction.Edit
            ? 'Edit Buy Order'
            : 'Buy Order Details'
        }
      />
      {alert.text && (
        <Alert severity={alert.severity} style={{ marginBottom: 10 }}>
          {alert.text}
        </Alert>
      )}
      <Card>
        <CardContent sx={{ paddingLeft: 5, paddingRight: 5 }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                maxWidth: 350,
                width: '100%'
              }}
            >
              <span className="underlined">Order name</span>
              {action === OrderAction.View
                ? getControlledField(existingOrder!.name, (event) => {
                    setOrderName(event.target.value)
                  })
                : getTextField('order-name-not-controlled', (event) => {
                    setOrderName(event.target.value)
                  })}
            </div>
            {existingOrder && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  maxWidth: 350,
                  width: '100%'
                }}
              >
                <span className="underlined">Date Created</span>
                {getControlledField(
                  dateToMMDDYYYY(existingOrder.createdAt),
                  () => {}
                )}
              </div>
            )}
          </div>
          <div
            style={{ display: 'flex', flexDirection: 'column', maxWidth: 350 }}
          >
            <span className="underlined">Order budget</span>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'baseline'
              }}
            >
              <span
                style={{ marginLeft: 7, marginRight: 7, fontSize: '1.5rem' }}
              >
                $
              </span>
              {action === OrderAction.View
                ? getControlledField(
                    existingOrder!.budget,
                    (event) => {
                      setBudget(parseFloat(event.target.value))
                    },
                    'number'
                  )
                : getTextField(
                    'order-budget-not-controlled',
                    (event) => {
                      setBudget(parseFloat(event.target.value))
                    },
                    'number'
                  )}
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginBottom: 40
            }}
          >
            <span className="underlined">Included datasets</span>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                rowGap: 20,
                marginTop: 7
              }}
            >
              {filterDatasetsByCountries(
                componentDatasets,
                countriesInState
              ).map((dataset: Dataset) => (
                <Card
                  sx={{
                    flex: '1 0 48%',
                    flexGrow: 0,
                    cursor:
                      existingOrder && action === OrderAction.View
                        ? 'default'
                        : 'pointer',
                    border: selectedDataSetIds.includes(dataset.id)
                      ? '1px solid black'
                      : 'none'
                  }}
                  onClick={() => {
                    if (action !== OrderAction.View) {
                      setSelectedDataSetIds((prevState) => {
                        if (prevState.includes(dataset.id)) {
                          return prevState.filter((id) => id !== dataset.id)
                        } else {
                          return [...prevState, dataset.id]
                        }
                      })
                    }
                  }}
                  key={dataset.id}
                >
                  <CardContent>
                    <div style={{ display: 'flex', maxHeight: 70 }}>
                      <CardMedia
                        component="img"
                        image={dataset.thumbnailUrl}
                        alt={dataset.label}
                        sx={{ objectFit: 'none', maxWidth: 50 }}
                      />
                      <div
                        style={{
                          textAlign: 'center',
                          display: 'table',
                          paddingLeft: 20
                        }}
                      >
                        <div
                          style={{
                            display: 'table-cell',
                            verticalAlign: 'middle',
                            textAlign: 'left'
                          }}
                        >
                          <span
                            style={{
                              fontWeight: 500
                            }}
                          >
                            {dataset.label}
                          </span>
                          <br />
                          <span
                            style={{
                              fontWeight: 300,
                              fontSize: '0.9rem'
                            }}
                          >
                            ${dataset.costPerRecord} per record
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <CountrySelector
            embedded
            editable={action !== OrderAction.View}
            selected={
              existingOrder && action === OrderAction.View
                ? existingOrder?.countries
                : undefined
            }
          />
          <div
            style={{
              marginTop: 100,
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            {action === OrderAction.View ? (
              <div style={{ display: 'flex', flexDirection: 'row', gap: 30 }}>
                <Link
                  to={`/${appRoutes.editOrder}?id=${existingOrder?.id}`}
                  className="noDecoration"
                >
                  <Button
                    variant="contained"
                    color="success"
                    size="large"
                    onClick={() => {
                      setAction(OrderAction.Edit)
                    }}
                  >
                    edit order
                  </Button>
                </Link>
                <Button
                  variant="contained"
                  color="warning"
                  size="large"
                  onClick={() => deleteOrder()}
                >
                  delete order
                </Button>
              </div>
            ) : (
              <Button
                variant="contained"
                color="success"
                size="large"
                onClick={() => submitOrder()}
              >
                {action === OrderAction.Create ? 'create order' : 'save'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const mapStateToProps = (states: State) => {
  return {
    datasetsInState: states.datasets,
    countriesInState: states.countries,
    ordersInState: states.orders
  }
}

export default connect(mapStateToProps)(OrderComponent)
