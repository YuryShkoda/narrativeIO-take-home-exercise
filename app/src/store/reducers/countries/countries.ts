import { Country } from '../../../components/selectors/CountrySelector/CountrySelector'
import * as actionTypes from '../../actions/actionTypes'
import { copyObject } from '../../../utils'

interface Action {
  type: string
  countries?: Country[]
  country?: string
  state?: { countries: Country[] }
}

const setCountries = (action: Action) => {
  if (action.countries) {
    return action.countries.map((country: Country) => {
      country.isSelected = true

      return country
    })
  }
}

const changeSelection = (state: Country[], action: Action) => {
  const stateCopy = copyObject(state)

  const countryToChange = stateCopy.find(
    (country: Country) => country.name === action.country!
  )
  countryToChange!.isSelected = !countryToChange?.isSelected

  return stateCopy
}

const countriesRestoreState = (action: Action) => {
  return action.state?.countries
}

const reducer = (state: Country[] | undefined, action: Action) => {
  if (!state) state = []

  switch (action.type) {
    case actionTypes.SET_COUNTRIES:
      return setCountries(action)
    case actionTypes.CHANGE_COUNTRY_SELECTION:
      return changeSelection(state, action)
    case actionTypes.RESTORE_STATE:
      return countriesRestoreState(action)
    default:
      return state
  }
}

export default reducer
