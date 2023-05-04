import React, {useContext} from 'react'
import {GlobalContext} from "../pages/App";
import QueryResultTableAdditionalHeaders from "../components/QueryResultTable/QueryResultTableAdditionalHeaders";
import QueryResultTableDefaultHeaders from "../components/QueryResultTable/QueryResultTableDefaultHeaders";
import QueryResultTableRows from "../components/QueryResultTable/QueryResultTableRows";

const QueryResultTable = () => {
  const {toolState} = useContext(GlobalContext)

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
              {/*<tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">*/}
              {/*  <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">*/}
              {/*    Apple MacBook Pro 17"*/}
              {/*  </td>*/}
              {/*  <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">*/}
              {/*    Sliver*/}
              {/*  </td>*/}
              {/*  <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">*/}
              {/*    Laptop*/}
              {/*  </td>*/}
              {/*  <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">*/}
              {/*    $2999*/}
              {/*  </td>*/}
              {/*  <td className="py-4 px-6 text-sm font-medium text-right whitespace-nowrap">*/}
              {/*    <a href="#" className="text-blue-600 dark:text-blue-500 hover:underline">Edit</a>*/}
              {/*  </td>*/}
              {/*</tr>*/}
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