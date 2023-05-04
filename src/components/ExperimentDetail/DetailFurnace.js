import React, {useContext} from 'react'
import {ExperimentContext} from "../../pages/ExperimentView";

const DetailFurnace = () => {
  const {experiment} = useContext(ExperimentContext)
  const furnace = experiment.furnace
  if (!furnace) {
    return null
  }
  const tubeDiameter = furnace.tubeDiameter
  const crossSectionalArea = furnace.crossSectionalArea
  const tubeLength = furnace.tubeLength
  const lengthOfHeatedRegion = furnace.lengthOfHeatedRegion

  const displayTubeDiameter =
    tubeDiameter
      ? <span className='md:w-1/2'>{tubeDiameter} mm</span>
      : <span className='md:w-1/2'>-</span>

  const displayCrossSectionalArea =
    crossSectionalArea
      ? <span className='md:w-1/2'>{crossSectionalArea} mm&sup2;</span>
      : <span className='md:w-1/2'>-</span>

  const displayTubeLength =
    tubeLength
      ? <span className='md:w-1/2'>{tubeLength} mm</span>
      : <span className='md:w-1/2'>-</span>

  const displayLengthOfHeatedRegion =
    lengthOfHeatedRegion
      ? <span className='md:w-1/2'>{lengthOfHeatedRegion} mm</span> //TODO:UNIT?
      : <span className='md:w-1/2'>-</span>

  return (
    <div className='flex flex-col py-2 px-4 mb-2 border'>
      <div className='flex justify-between'>
        <h6 className='font-bold ml-3'> Furnace #{furnace.id}</h6>
      </div>
      <hr className='my-1'/>
      <div className='w-full md:flex md:items-center mb-1'>
        <span className='md:w-1/2 block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'>Tube Diameter :</span>
        {displayTubeDiameter}
      </div>
      <div className='w-full md:flex md:items-center mb-1'>
        <span
          className='md:w-1/2 block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'>Cross Sectional Area :</span>
        {displayCrossSectionalArea}
      </div>
      <div className='w-full md:flex md:items-center mb-1'>
        <span className='md:w-1/2 block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'>Tube Length :</span>
        {displayTubeLength}
      </div>
      <div className='w-full md:flex md:items-center mb-1'>
        <span className='md:w-1/2 block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'>Length of Heated Region :</span>
        {displayLengthOfHeatedRegion}
      </div>
    </div>
  )
}

export default DetailFurnace
