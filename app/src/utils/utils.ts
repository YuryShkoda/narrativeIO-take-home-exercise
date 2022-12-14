export const copyObject = (obj: {}) => JSON.parse(JSON.stringify(obj))

export const compareArrays = (arr1: any[], arr2: any[]) =>
  JSON.stringify(arr1.sort()) === JSON.stringify(arr2.sort())

export const dateToMMDDYYYY = (date: Date, separator = '/') => {
  const parts = new Date(date).toISOString().substring(0, 10).split('-')
  const year = parts[0]
  const month = parts[1]
  const day = parts[2]

  return [month, day, year].join(separator)
}
