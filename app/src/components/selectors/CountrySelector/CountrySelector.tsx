import { ReactNode, useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import axiosConfig from '../../../axiosConfig'
import {
  setCountries,
  changeSelection
} from '../../../store/actions/countries/countries'
import { setAvailableRecords } from '../../../store/actions/storedData/storedData'
import { State } from '../../../store/reducers/rootReducer'
import { useDispatch, connect } from 'react-redux'
import { compareArrays } from '../../../utils'

export interface StoredItem {
  datasetId: number
  recordCount: number
}
export interface Country {
  countryCode: string
  name: string
  storedData: StoredItem[]
  isSelected?: boolean
}
interface CountryChip {
  name: string
  isSelected: boolean
}

interface CountrySelectorProps {
  countriesInState: Country[]
  embedded?: boolean
  editable?: boolean
  selected?: string[]
}

const CountrySelector = (props: CountrySelectorProps) => {
  const { countriesInState, embedded, editable, selected } = props

  const [countryChips, setCountryChips] = useState<CountryChip[]>(
    countriesInState.map((country: Country) => ({
      name: country.name,
      isSelected: !!country.isSelected
    }))
  )
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchCountries = async () => {
      const response = await axiosConfig.get('/countries').catch((err) => {
        // TODO: Send error to external resource processing issues
        console.log(`🤖[Error while fetching countries. Error: ]🤖`, err)
      })

      if (response && response.status === 200 && response.data) {
        let fetchedCountries: Set<CountryChip> | CountryChip[] = new Set(
          response.data.map((country: Country) => ({
            name: country.name,
            isSelected: true
          }))
        )
        fetchedCountries = [...fetchedCountries]

        if (
          !compareArrays(
            fetchedCountries,
            countriesInState.map((country: Country) => ({
              name: country.name,
              isSelected: true
            }))
          )
        ) {
          dispatch(setCountries(response.data))
          dispatch(
            setAvailableRecords(
              response.data.flatMap((country: Country) => country.storedData)
            )
          )
          setCountryChips(fetchedCountries)
        }
      }
    }

    if (selected === undefined && editable === undefined) {
      fetchCountries()
    } else if (selected) {
      const selectedCountries = countriesInState.filter((country) =>
        selected.includes(country.countryCode)
      )

      setCountryChips(
        selectedCountries.map((country) => ({
          name: country.name,
          isSelected: true
        }))
      )
    } else {
      setCountryChips(
        countriesInState.map((country) => ({
          name: country.name,
          isSelected: !!country.isSelected
        }))
      )
    }
  }, [dispatch, countriesInState, selected, editable])

  const fixPosition = (element: ReactNode) => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <div
        style={{
          position: 'absolute',
          bottom: '5vh',
          zIndex: 100
        }}
      >
        <Card sx={{ maxWidth: 500, border: '1px solid black' }}>
          <CardContent>{element}</CardContent>
        </Card>
      </div>
    </div>
  )

  const getComponent = () => {
    let component = (
      <>
        <span className="underlined">Included Countries:</span>
        <Stack direction="row" flexWrap="wrap">
          {countryChips.map((chip: CountryChip, i: number) => (
            <Chip
              label={chip.name}
              onClick={() => {
                if (!selected) {
                  setCountryChips((prevState) =>
                    prevState.map((chipToUpdate: CountryChip) => {
                      if (chipToUpdate.name === chip.name) {
                        chipToUpdate.isSelected = !chipToUpdate.isSelected
                      }

                      return chipToUpdate
                    })
                  )
                }

                if (selected === undefined) dispatch(changeSelection(chip.name))
              }}
              sx={{ marginRight: 1, marginTop: 1 }}
              key={i}
              color={chip.isSelected ? 'success' : 'default'}
            />
          ))}
        </Stack>
      </>
    )

    if (!embedded) component = fixPosition(component)

    return component
  }

  return getComponent()
}

const mapStateToProps = (state: State) => {
  return {
    countriesInState: state.countries
  }
}

export default connect(mapStateToProps)(CountrySelector)
