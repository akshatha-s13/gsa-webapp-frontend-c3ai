import React, {useContext} from 'react'
import {ExperimentContext} from "../../pages/ExperimentView";

const DetailSubstrate = () => {
  const {experiment} = useContext(ExperimentContext)
  const substrate = experiment.substrate
  if (!substrate) {
    return null
  }
  const catalyst = substrate.catalyst
  const thickness = substrate.thickness
  const diameter = substrate.diameter
  const length = substrate.length
  const surfaceArea = substrate.surfaceArea

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
  return (
    <div className='flex flex-col py-2 px-4 mb-2 border'>
      <div className='flex justify-between'>
        <h6 className='font-bold ml-3'> Substrate #{substrate.name}</h6>
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
        <span className='md:w-1/2 block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'>Diameter :</span>
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

export default DetailSubstrate
