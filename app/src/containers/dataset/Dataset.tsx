import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import CardMedia from '@mui/material/CardMedia'
import { connect } from 'react-redux'
import { StoredItem } from '../../components/selectors/CountrySelector/CountrySelector'

export interface Dataset {
  id: number
  thumbnailUrl: string
  label: string
  description: string
  costPerRecord: number
  storedDataInState: StoredItem[]
}

interface DatasetComponentProps extends Dataset {
  countries: string[]
  availableRecords: number | undefined
}

const DatasetComponent = (props: DatasetComponentProps) => {
  const {
    id,
    countries,
    thumbnailUrl,
    label,
    description,
    costPerRecord,
    availableRecords,
    storedDataInState
  } = props

  const getAvailableRecords = (id: number) => {
    const defaultValue = 'NA'

    if (!storedDataInState.length) return defaultValue

    return storedDataInState.filter(
      (dataset: StoredItem) => dataset.datasetId === id
    )[0].recordCount
  }

  return (
    <Card sx={{ maxWidth: 370 }}>
      <CardContent>
        <div style={{ display: 'flex', maxHeight: 70 }}>
          <CardMedia
            component="img"
            image={thumbnailUrl}
            alt={label}
            sx={{ objectFit: 'none', maxWidth: 70 }}
          />
          <div
            style={{ textAlign: 'center', display: 'table', paddingLeft: 20 }}
          >
            <h3
              style={{
                display: 'table-cell',
                verticalAlign: 'middle'
              }}
            >
              {label}
            </h3>
          </div>
        </div>
        <div>
          <p className="underlined" style={{ marginBottom: 10 }}>
            Dataset description:
          </p>
          <span>{description}</span>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 5
          }}
        >
          <span className="underlined">Cost per record:</span>
          <span>${costPerRecord}</span>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 5
          }}
        >
          <span style={{ textDecoration: 'underline' }}>
            Available records:
          </span>
          <span>{availableRecords || getAvailableRecords(id)} records</span>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 5
          }}
        >
          <span style={{ textDecoration: 'underline' }}>
            Included countries:
          </span>
        </div>
        <Stack direction="row" flexWrap="wrap">
          {countries.map((country: string, i: number) => (
            <Chip
              label={country}
              sx={{ marginRight: 1, marginTop: 1 }}
              key={i}
              color={'default'}
            />
          ))}
        </Stack>
      </CardContent>
    </Card>
  )
}

const mapStateToProps = (states: any, ownProps: any): any => {
  return {
    storedDataInState: states.storedData
  }
}

export default connect(mapStateToProps)(DatasetComponent)
