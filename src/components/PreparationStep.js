import React from 'react'

const PreparationStep = ({ idx, id, step, name, duration, furnaceTemperature, furnacePressure, sampleLocation, heliumFlowRate, hydrogenFlowRate, carbonSourceFlowRate, argonFlowRate, coolingRate }) => {
  const displayStep =
    step !== null
      ? <span className='md:w-1/2'>{step + 1}</span>
      : <span className='md:w-1/2'>-</span>

  const displayName =
    name
      ? <span className='md:w-1/2'>{name}</span>
      : <span className='md:w-1/2'>-</span>

  const displayDuration =
    duration
      ? <span className='md:w-1/2'>{duration} min</span>
      : <span className='md:w-1/2'>-</span>

  const displayFurnaceTemperature =
    furnaceTemperature
      ? <span className='md:w-1/2'>{furnaceTemperature} &deg;C</span>
      : <span className='md:w-1/2'>-</span>

  const displayFurnacePressure =
    furnacePressure
      ? <span className='md:w-1/2'>{furnacePressure} Torr</span>
      : <span className='md:w-1/2'>-</span>

  const displaySampleLocation =
    sampleLocation
      ? <span className='md:w-1/2'>{sampleLocation} mm</span>
      : <span className='md:w-1/2'>-</span>

  const displayHeliumFlowRate =
    heliumFlowRate
      ? <span className='md:w-1/2'>{heliumFlowRate} sccm</span>
      : <span className='md:w-1/2'>-</span>

  const displayHydrogenFlowRate =
    hydrogenFlowRate
      ? <span className='md:w-1/2'>{hydrogenFlowRate} sccm</span>
      : <span className='md:w-1/2'>-</span>

  const displayCarbonSourceFlowRate =
    carbonSourceFlowRate
      ? <span className='md:w-1/2'>{carbonSourceFlowRate} sccm</span>
      : <span className='md:w-1/2'>-</span>

  const displayArgonFlowRate =
    argonFlowRate
      ? <span className='md:w-1/2'>{argonFlowRate} sccm</span>
      : <span className='md:w-1/2'>-</span>

  const displayCoolingRate =
    coolingRate
      ? <span className='md:w-1/2'>{coolingRate} &deg;C / min</span>
      : <span className='md:w-1/2'>-</span>

  return (
    <div className='flex flex-col py-2 px-4 mb-2 border rounded'>
      <div className='flex justify-between'>
        <h6 className='font-bold ml-3'> Preparation Step #{id}</h6>
      </div>
      <hr className='my-1' />
      <div className='w-full md:flex md:items-center mb-1'>
        <span className='md:w-1/2 block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'>Step :</span>
        {displayStep}
      </div>
      <div className='w-full md:flex md:items-center mb-1'>
        <span className='md:w-1/2 block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'>Name :</span>
        {displayName}
      </div>
      <div className='w-full md:flex md:items-center mb-1'>
        <span className='md:w-1/2 block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'>Duration :</span>
        {displayDuration}
      </div>
      <div className='w-full md:flex md:items-center mb-1'>
        <span className='md:w-1/2 block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'>Furnace Temperature :</span>
        {displayFurnaceTemperature}
      </div>
      <div className='w-full md:flex md:items-center mb-1'>
        <span className='md:w-1/2 block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'>Furnace Pressure :</span>
        {displayFurnacePressure}
      </div>
      <div className='w-full md:flex md:items-center mb-1'>
        <span className='md:w-1/2 block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'>Sample Location :</span>
        {displaySampleLocation}
      </div>
      <div className='w-full md:flex md:items-center mb-1'>
        <span className='md:w-1/2 block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'>Helium Flow Rate :</span>
        {displayHeliumFlowRate}
      </div>
      <div className='w-full md:flex md:items-center mb-1'>
        <span className='md:w-1/2 block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'>Hydrogen Flow Rate :</span>
        {displayHydrogenFlowRate}
      </div>
      <div className='w-full md:flex md:items-center mb-1'>
        <span className='md:w-1/2 block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'>Carbon Source Flow Rate :</span>
        {displayCarbonSourceFlowRate}
      </div>
      <div className='w-full md:flex md:items-center mb-1'>
        <span className='md:w-1/2 block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'>Argon Flow Rate :</span>
        {displayArgonFlowRate}
      </div>
      <div className='w-full md:flex md:items-center mb-1'>
        <span className='md:w-1/2 block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'>Cooling Rate :</span>
        {displayCoolingRate}
      </div>
    </div>
  )
}

export default PreparationStep
