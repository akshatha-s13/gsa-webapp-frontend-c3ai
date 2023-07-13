import React from 'react'
//import {useContext} from 'react'
//import {GlobalContext} from "../pages/App";
import QueryResultTableAdditionalHeaders from "../components/QueryResultTable/QueryResultTableAdditionalHeaders";
import QueryResultTableDefaultHeaders from "../components/QueryResultTable/QueryResultTableDefaultHeaders";
import QueryResultTableRows from "../components/QueryResultTable/QueryResultTableRows";

const QueryResultTable = () => {
  //const {toolState} = useContext(GlobalContext)

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block py-2 min-w-full sm:px-6 lg:px-8">
          <div className="overflow-x-scroll sm:rounded-lg border">
            <table className="min-w-full">
              <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <QueryResultTableDefaultHeaders/>
                <QueryResultTableAdditionalHeaders/>
              </tr>
              </thead>
              <tbody>
              <QueryResultTableRows/>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QueryResultTable