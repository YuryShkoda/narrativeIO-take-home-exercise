import AppBar from '../components/navigation/AppBar/AppBar'
import { Outlet } from 'react-router-dom'
import Container from '@mui/material/Container'
import { connect, useDispatch } from 'react-redux'
import { checkState } from '../store/actions/orders/orders'
import { State } from '../store/reducers/rootReducer'
import { AnyAction } from 'redux'

interface MainProps {
  stateInStore: State
}

const Main = (props: MainProps) => {
  const { stateInStore } = props
  const dispatch = useDispatch()
  let stateHasSomeValues = false

  Object.values(stateInStore).forEach((item) => {
    if (Array.isArray(item)) {
      if (Object.values(item).length) stateHasSomeValues = true
    }
  })

  if (!stateHasSomeValues) dispatch(checkState() as unknown as AnyAction)

  return (
    <>
      <AppBar />
      <main style={{ padding: '1rem 0' }}>
        <Container maxWidth="lg">
          <Outlet />
        </Container>
      </main>
    </>
  )
}

const mapStateToProps = (state: State) => {
  return {
    stateInStore: state
  }
}

export default connect(mapStateToProps)(Main)
