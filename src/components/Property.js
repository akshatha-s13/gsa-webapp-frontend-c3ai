import React, {useContext} from "react";
import {GlobalContext} from "../pages/App";

const Property = ({
                    id,
                    avgThicknessOfGrowth,
                    stdDevOfGrowth,
                    numLayers,
                    growthCoverage,
                    domainSize,
                    shape,
                    isAddedToFilter,
                    isFilter
                  }) => {
  const {toolDispatch} = useContext(GlobalContext)

  const displayAvgThicknessOfGrowth =
    <span className='md:w-1/2'>{avgThicknessOfGrowth} nm</span>
  const displayStdDevOfGrowth =
    <span className='md:w-1/2'>{stdDevOfGrowth} nm</span>
  const displayNumLayers =
    <span className='md:w-1/2'>{numLayers}</span>
  const displayGrowthCoverage =
    <span className='md:w-1/2'>{growthCoverage} %</span>
  const displayDomainSize =
    <span className='md:w-1/2'>{domainSize} um&sup2;</span>
  const displayShape =
    <span className='md:w-1/2'>{shape}</span>

  let btn
  if (isFilter) {
    btn = (
      <button
        className='w-9 h-9 text-center bg-red-500 hover:bg-red-700 text-white text-3xl font-bold rounded focus:outline-none focus:shadow-outline'
        type='button'
        onClick={() => {
          toolDispatch({type: 'DEL_PROPERTY_FILTER', payload: {id: id}})
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
          toolDispatch({type: 'ADD_PROPERTY_FILTER', payload: {id: id}})
        }}
      >
        +
      </button>
    )
  }

  return (
    <div className='flex flex-col py-2 px-4 mb-2 border rounded'>
      <div className='flex justify-between'>
        <h6 className='font-bold ml-3'> Property #{id}</h6>
        {btn}
      </div>
      <hr className='my-1'/>
      <div className='w-full md:flex md:items-center mb-1'>
        <span className='md:w-1/2 block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'>Average Thickness of Growth :</span>
        {displayAvgThicknessOfGrowth}
      </div>
      <div className='w-full md:flex md:items-center mb-1'>
        <span
          className='md:w-1/2 block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'>Std. Dev. of Growth :</span>
        {displayStdDevOfGrowth}
      </div>
      <div className='w-full md:flex md:items-center mb-1'>
        <span
          className='md:w-1/2 block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'>Number of Layers :</span>
        {displayNumLayers}
      </div>
      <div className='w-full md:flex md:items-center mb-1'>
        <span
          className='md:w-1/2 block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'>Growth Coverage :</span>
        {displayGrowthCoverage}
      </div>
      <div className='w-full md:flex md:items-center mb-1'>
        <span className='md:w-1/2 block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'>Domain Size :</span>
        {displayDomainSize}
      </div>
      <div className='w-full md:flex md:items-center mb-1'>
        <span className='md:w-1/2 block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'>Shape :</span>
        {displayShape}
      </div>
    </div>
  )
}
export default Property