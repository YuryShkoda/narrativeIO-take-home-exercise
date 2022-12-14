interface ListSummaryProps {
  amount: number
  countries: string[]
}

const ListSummary = (props: ListSummaryProps) => {
  const { amount, countries } = props
  const shouldDisplay = amount && countries.length

  return (
    <>
      {shouldDisplay ? (
        <span style={{ marginBottom: 5 }}>
          Shown <b>{amount}</b> results from <b>{countries.join(' & ')}</b>
        </span>
      ) : (
        'Nothing to display'
      )}
    </>
  )
}

export default ListSummary
