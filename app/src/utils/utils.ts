export const copyObject = (obj: {}) => JSON.parse(JSON.stringify(obj))

export const compareArrays = (arr1: any[], arr2: any[]) =>
  JSON.stringify(arr1.sort()) === JSON.stringify(arr2.sort())
