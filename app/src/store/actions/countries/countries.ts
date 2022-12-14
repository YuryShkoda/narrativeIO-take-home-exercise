import * as actionTypes from '../actionTypes'
import { Country } from '../../../components/selectors/CountrySelector/CountrySelector'

export const setCountries = (countries: Country[]) => {
  return {
    type: actionTypes.SET_COUNTRIES,
    countries: countries
  }
}

export const changeSelection = (country: string) => {
  return {
    type: actionTypes.CHANGE_COUNTRY_SELECTION,
    country: country
  }
}
