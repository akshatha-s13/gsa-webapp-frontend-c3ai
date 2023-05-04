export const isDefault = (filter) => {
  if (filter.type === 'AUTHOR') {
    return true
  }
  if (!filter.name) {
    return false
  }
  const name = filter.name.toLowerCase()
  return (
    name.includes('number of layers')
    || name.includes('growth coverage')
    || name == 'carbon source'
  )
}