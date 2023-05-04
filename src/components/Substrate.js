import React, {useContext} from 'react'
import {GlobalContext} from "../pages/App";

const Substrate = ({id, catalyst, thickness, diameter, length, surfaceArea, isAddedToFilter, isFilter}) => {
  const {toolDispatch} = useContext(GlobalContext)

  const displayCatalyst =
    catalyst
      ? <span className='md:w-1/2'>{catalyst}</span>
      : <span className='md:w-1/2'>-</span>

  const displayThickness =
    thickness
      ? <span className='md:w-1/2'>{thickness} um&sup2;</span>
      : <span className='md:w-1/2'>-</span>

  const displayDiameter =
    diameter
      ? <span className='md:w-1/2'>{diameter} um</span>
      : <span className='md:w-1/2'>-</span>

  const displayLength =
    length
      ? <span className='md:w-1/2'>{length} um</span>
      : <span className='md:w-1/2'>-</span>

  const displaySurfaceArea =
    surfaceArea
      ? <span className='md:w-1/2'>{surfaceArea} um</span>
      : <span className='md:w-1/2'>-</span>

  let btn = null
  if (isFilter) {
    btn = (
      <button
        className='w-9 h-9 text-center bg-red-500 hover:bg-red-700 text-white text-3xl font-bold rounded focus:outline-none focus:shadow-outline'
        type='button'
        onClick={() => {
          toolDispatch({type: 'DEL_SUBSTRATE_FILTER', payload: {id: id}})
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
          toolDispatch({type: 'ADD_SUBSTRATE_FILTER', payload: {id: id}})
        }}
      >
        +
      </button>
    )
  }
  return (
    <div className='flex flex-col py-2 px-4 mb-2 border'>
      <div className='flex justify-between'>
        <h6 className='font-bold ml-3'> Substrate #{id}</h6>
        {btn}
      </div>
      <hr className='my-1'/>
      <div className='w-full md:flex md:items-center mb-1'>
        <span className='md:w-1/2 block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'>Catalyst :</span>
        {displayCatalyst}
      </div>
      <div className='w-full md:flex md:items-center mb-1'>
        <span className='md:w-1/2 block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'>Thickness :</span>
        {displayThickness}
      </div>
      <div className='w-full md:flex md:items-center mb-1'>
        <span className='md:w-1/2 block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'>Diamter :</span>
        {displayDiameter}
      </div>
      <div className='w-full md:flex md:items-center mb-1'>
        <span className='md:w-1/2 block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'>Length :</span>
        {displayLength}
      </div>
      <div className='w-full md:flex md:items-center mb-1'>
        <span className='md:w-1/2 block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'>Surface Area :</span>
        {displaySurfaceArea}
      </div>
    </div>
  )
}

export default Substrate
