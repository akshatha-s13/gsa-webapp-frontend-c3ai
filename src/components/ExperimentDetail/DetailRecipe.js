import React, {useContext} from 'react'
import {ExperimentContext} from "../../pages/ExperimentView";
import PreparationSteps from "../../containers/PreparationSteps";

const Recipe = () => {
  const {experiment} = useContext(ExperimentContext)

  const recipe = experiment.recipe
  if (!recipe) {
    return null
  }
  const preparationSteps = recipe.preparationSteps
  const prepStepDetails =
    preparationSteps
      ? <PreparationSteps preparationSteps={preparationSteps}/>
      : null
  const carbonSource = recipe.carbonSource
  const basePressure = recipe.basePressure

  const displayCarbonSource =
    carbonSource
      ? <span className='md:w-1/2'>{carbonSource}</span>
      : <span className='md:w-1/2'>-</span>
  const displayBasePressure =
    basePressure
      ? <span className='md:w-1/2'>{basePressure} Torr</span>
      : <span className='md:w-1/2'>-</span>

  return (
    <div className='flex flex-col py-2 px-4 mb-2 border'>
      <div className='flex justify-between'>
        <h6 className='font-bold ml-3'> Recipe #{recipe.id}</h6>
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
      {prepStepDetails}
    </div>
  )
}

export default Recipe
