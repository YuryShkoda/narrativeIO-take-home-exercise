interface TitleProps {
  title: string
}

const Title = (props: TitleProps) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}
  >
    <h1>{props.title}</h1>
  </div>
)

export default Title
