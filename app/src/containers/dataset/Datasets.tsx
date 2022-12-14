import { useEffect, useState, useCallback } from 'react'
import CountrySelector, {
  Country,
  StoredItem
} from '../../components/selectors/CountrySelector/CountrySelector'
import Title from '../../components/ui/Title'
import ListSummary from '../../components/ui/ListSummary'
import DatasetComponent, { Dataset } from './Dataset'
import axiosConfig from '../../axiosConfig'
import { connect, useDispatch } from 'react-redux'
import { compareArrays } from '../../utils'
import { setDatasets } from '../../store/actions/datasets/datasets'
import { State } from '../../store/reducers/rootReducer'

/*
Users should be able to view a list of the available Datasets, given the countries selected in the Country Selection Control. **Only show Datasets that contain records for at least one country currently selected in the Country Selection Control.**  Each entry should include the following details:
  - Dataset thumbnail image
  - Dataset label
  - Dataset description
  - Cost per record
  - Total record count for that Dataset **given the countries selected**
  - Countries for which records exist in the Dataset
*/

export const filterDatasetsByCountries = (
  datasets: Dataset[],
  countriesInState: Country[]
) => {
  const datasetsInCountries = [
    ...new Set(
      countriesInState
        .filter((country: Country) => country.isSelected)
        .flatMap((country: Country) => country.storedData)
        .map((item: StoredItem) =>
          item.recordCount > 0 ? item.datasetId : null
        )
        .filter((item: number | null) => item)
    )
  ]

  return datasets.filter((dataset: Dataset) =>
    datasetsInCountries.includes(dataset.id)
  )
}

interface DatasetsProps {
  datasetsInState: Dataset[]
  countriesInState: Country[]
}

const Datasets = (props: DatasetsProps) => {
  const { datasetsInState, countriesInState } = props
  const [datasets, setComponentDatasets] = useState<Dataset[]>(datasetsInState)
  const dispatch = useDispatch()

  // REFACTOR: create custom hook
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
    fetchDatasets()
  }, [fetchDatasets])

  filterDatasetsByCountries(datasets, countriesInState)

  const filterCountriesByDataset = (
    datasetId: number,
    removeNotSelected = true
  ) =>
    countriesInState
      .filter((country: Country) =>
        removeNotSelected ? country.isSelected : country
      )
      .filter((country: Country) =>
        country.storedData.find(
          (item: StoredItem) =>
            item.datasetId === datasetId && item.recordCount > 0
        )
      )

  return (
    <div>
      <Title title="Datasets" />
      {datasets.length && (
        <ListSummary
          amount={filterDatasetsByCountries(datasets, countriesInState).length}
          countries={countriesInState
            .filter((country: Country) => country.isSelected)
            .map((country: Country) => country.name)}
        />
      )}

      <div
        style={{
          display: 'flex',
          flexFlow: 'wrap',
          marginTop: 5,
          gap: 20
        }}
      >
        {datasets.map((dataset: Dataset) =>
          filterCountriesByDataset(dataset.id).length ? (
            <DatasetComponent
              countries={filterCountriesByDataset(dataset.id, false).map(
                (country: Country) => country.name
              )}
              thumbnailUrl={dataset.thumbnailUrl}
              label={dataset.label}
              description={dataset.description}
              costPerRecord={dataset.costPerRecord}
              id={dataset.id}
              key={dataset.id}
            />
          ) : null
        )}
      </div>

      <CountrySelector />
    </div>
  )
}

const mapStateToProps = (states: State) => {
  return {
    datasetsInState: states.datasets,
    countriesInState: states.countries
  }
}

export default connect(mapStateToProps)(Datasets)
