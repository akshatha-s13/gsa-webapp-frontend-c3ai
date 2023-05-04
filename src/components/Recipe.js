import React, {useContext} from 'react'
import PreparationSteps from '../containers/PreparationSteps'
import {GlobalContext} from "../pages/App";

const Recipe = ({id, carbonSource, basePressure, preparationSteps, isAddedToFilter, isFilter}) => {
  const {toolDispatch} = useContext(GlobalContext)

  const displayCarbonSource =
    carbonSource
      ? <span className='md:w-1/2'>{carbonSource}</span>
      : <span className='md:w-1/2'>-</span>

  const displayBasePressure =
    basePressure
      ? <span className='md:w-1/2'>{basePressure} Torr</span>
      : <span className='md:w-1/2'>-</span>

  let btn
  if (isFilter) {
    btn = (
      <button
        className='w-9 h-9 text-center bg-red-500 hover:bg-red-700 text-white text-3xl font-bold rounded focus:outline-none focus:shadow-outline'
        type='button'
        onClick={() => {
          toolDispatch({type: 'DEL_RECIPE_FILTER', payload: {id: id}})
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
          toolDispatch({type: 'ADD_RECIPE_FILTER', payload: {id: id}})
        }}
      >
        +
      </button>
    )
  }
  return (
    <div className='flex flex-col py-2 px-4 mb-2 border'>
      <div className='flex justify-between'>
        <h6 className='font-bold ml-3'> Recipe #{id}</h6>
        {btn}
      </div>
      <hr className='my-1'/>
      <div className='w-full md:flex md:items-center mb-1'>
        <span className='md:w-1/2 block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'>Carbon Source :</span>
        {displayCarbonSource}
      </div>
      <div className='w-full md:flex md:items-center mb-1'>
        <span className='md:w-1/2 block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'>Base Pressure :</span>
        {displayBasePressure}
      </div>
      <hr className='my-1'/>
      <PreparationSteps
        preparationSteps={preparationSteps}
      />
    </div>
  )
}

export default Recipe
