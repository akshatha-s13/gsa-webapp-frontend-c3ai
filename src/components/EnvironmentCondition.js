import React, {useContext} from 'react'
import {GlobalContext} from "../pages/App";

const EnvironmentCondition = ({id, ambientTemperature, dewPoint, isAddedToFilter, isFilter}) => {
  const {toolDispatch} = useContext(GlobalContext)

  const displayAmbientTemperature =
    ambientTemperature
      ? <span className='md:w-1/2'>{ambientTemperature} &deg;C</span>
      : <span className='md:w-1/2'>-</span>

  const displayDewPoint =
    dewPoint
      ? <span className='md:w-1/2'>{dewPoint} &deg;C</span>
      : <span className='md:w-1/2'>-</span>

  let btn = null
  if (isFilter) {
    btn = (
      <button
        className='w-9 h-9 text-center bg-red-500 hover:bg-red-700 text-white text-3xl font-bold rounded focus:outline-none focus:shadow-outline'
        type='button'
        onClick={() => {
          toolDispatch({type: 'DEL_ENVIRONMENTAL_CONDITION_FILTER', payload: {id: id}})
        }}
      >
        -
      </button>
    )
  } else if (isAddedToFilter) {
    btn = (
      <button
        disabled
        className='cursor-default px-2 h-9 text-center bg-purple-500 text-white text-xl font-bold rounded focus:outline-none focus:shadow-outline'
      >
        Added
      </button>
    )
  } else {
    btn = (
      <button
        className='w-9 h-9 text-center bg-green-500 hover:bg-green-700 text-white text-3xl font-bold rounded focus:outline-none focus:shadow-outline'
        type='button'
        onClick={() => {
          toolDispatch({type: 'ADD_ENVIRONMENTAL_CONDITION_FILTER', payload: {id: id}})
        }}
      >
        +
      </button>
    )
  }
  return (
    <div className='flex flex-col py-2 px-4 mb-2 border'>
      <div className='flex justify-between'>
        <h6 className='font-bold ml-3'> Environmental Condition #{id}</h6>
        {btn}
      </div>
      <hr className='my-1'/>
      <div className='w-full md:flex md:items-center mb-1'>
        <span
          className='md:w-1/2 block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'>Ambient Temperature :</span>
        {displayAmbientTemperature}
      </div>
      <div className='w-full md:flex md:items-center mb-1'>
        <span className='md:w-1/2 block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'>Dew Point :</span>
        {displayDewPoint}
      </div>
    </div>
  )
}

export default EnvironmentCondition
