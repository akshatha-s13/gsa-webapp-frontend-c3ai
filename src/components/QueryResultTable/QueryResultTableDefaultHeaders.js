import React from "react";

const QueryResultTableDefaultHeaders = () => {
  return (
    <>
      <th scope="col"
          className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
        Experiment ID
      </th>
      <th scope="col"
          className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
        Furnace ID
      </th>
      <th scope="col"
          className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
        Substrate ID
      </th>
      <th scope="col"
          className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
        No. of Layers
      </th>
      <th scope="col"
          className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
        Growth Coverage (%)
      </th>
      {/* <th scope="col"
          className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
        Quality
      </th> */}
      <th scope="col"
          className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
        Author
      </th>
      <th scope="col"
          className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
        Carbon Source
      </th>
    </>
  )
}
export default QueryResultTableDefaultHeaders