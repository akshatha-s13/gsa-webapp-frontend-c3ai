export const isAddedToCurrentFilters = (name, toolStateFilters) => {
  for (const filter of toolStateFilters) {
    if (name === filter.name) {
      return true
    }
  }
  return false
}