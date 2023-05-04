export const buildExperimentQueryStr = (filters) => {
  const queryStrings = filters.map((filter) => {
    let queryString = filter.code + '=';
    if (filter.ineq) {
      queryString += filter.ineq;
    }
    queryString += filter.value;
    return queryString;
  });
  console.log(queryStrings)

  return queryStrings.join('&');
}
