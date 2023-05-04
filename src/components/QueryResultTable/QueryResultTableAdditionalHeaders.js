import React, {useContext} from "react";
import {GlobalContext} from "../../pages/App";
import  {isDefault} from "./utils";

const QueryResultTableAdditionalHeaders = () => {
  const {toolState} = useContext(GlobalContext)
  return (
    <>
      {toolState.savedFilters
        .filter(filter => !isDefault(filter))
        .map(filter =>
          <th scope="col"
              className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
            {filter.name}
          </th>
        )
      }
    </>
  )
}
export default QueryResultTableAdditionalHeaders