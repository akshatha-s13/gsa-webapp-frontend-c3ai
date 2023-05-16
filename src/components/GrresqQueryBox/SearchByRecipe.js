import React, {useContext, useState} from "react";
import {GlobalContext} from "../../pages/App";
import {carbonSourceOptions, inertGasOptions, defaultPrecision} from "../../settings";
import {isAddedToCurrentFilters} from "./utils";
import { showAlert } from '../CustomAlert';

const SearchByRecipe = () => {
  const [min, setMin] = useState(0)
  const [max, setMax] = useState(9999)
  const [name, setName] = useState("Carbon Source")
  const [inertGas, setInertGas] = useState(inertGasOptions[0])
  const {toolState, toolDispatch} = useContext(GlobalContext)
  const [carbonSource, setCarbonSource] = useState(toolState.carbonSource[0])

  const onClickAdd = () => {
    if (isAddedToCurrentFilters(name, toolState.filters)) {
     showAlert(name + ' is already added.')
      return
    }
    if (name === 'Carbon Source') {
      toolDispatch({
        type: 'ADD_FILTER',
        payload: {
          type: 'KEY_VALUE', category: 'recipe', name, value: carbonSource
        }
      })
    } else if (name === 'Inert Gas') {
      toolDispatch({
        type: 'ADD_FILTER',
        payload: {
          type: 'KEY_VALUE', category: 'recipe', name, value: inertGas
        }
      })
    } else {
      toolDispatch({
        type: 'ADD_FILTER',
        payload: {
          type: 'MIN_MAX', category: 'recipe', name, min, max
        }
      })
    }
  }

  return (
    <div className="w-full border rounded flex flex-col items-center py-5">
      <div className="w-full md:w-2/3 px-3 mb-6 md:mb-0">
        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
               htmlFor="recipe-option">
          Option
        </label>
        <div className="relative">
          <select
            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="recipe-option"
            onChange={e => setName(e.target.value)}
          >
            <option>Carbon Source</option>
            <option>Base Pressure (Torr)</option>
            <option>Maximum Temperature (°C)</option>
            <option>Maximum Pressure (Torr)</option>
            <option>Maximum Flow Rate (sccm)</option>
            <option>Inert Gas </option>
            <option>Growth Duration (min)</option>
            <option>Average Carbon Flow Rate (sccm)</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
      </div>
      <div className='flex flex-row md:w-2/3 justify-center my-2'>
        {name === 'Carbon Source' &&
          <div className="w-full px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                   htmlFor="carbon-source-option">
              Carbon Source
            </label>
            <div className="relative">
              <select
                className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="carbon-source-option"
                onChange={e => setCarbonSource(e.target.value)}
              >
                {toolState.carbonSource.map(cat => <option key={cat}>{cat}</option>)}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>
        }
        {name === 'Inert Gas' &&
          <div className="w-full px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                   htmlFor="inert-gas-option">
              Uses
            </label>
            <div className="relative">
              <select
                className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="inert-gas-option"
                onChange={e => setInertGas(e.target.value)}
              >
                {inertGasOptions.map(ig => <option key={ig}>{ig}</option>)}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>
        }
        {name !== 'Carbon Source' && name !== 'Inert Gas' &&
          <>
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                     htmlFor="recipe-min">
                min
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="recipe-min" type="number" step={defaultPrecision} value={min}
                onChange={(e) => setMin(parseFloat(e.target.value))}
              />
            </div>
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                     htmlFor="recipe-max">
                max
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="recipe-max" type="number" step={defaultPrecision} value={max}
                onChange={(e) => setMax(parseFloat(e.target.value))}
              />
            </div>
          </>
        }
      </div>
      <button type="button"
              className="mt-3 text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={onClickAdd}>
        Add
      </button>
    </div>
  )
}

export default SearchByRecipe