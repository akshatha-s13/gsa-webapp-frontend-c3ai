import React, {useContext} from "react";
import {ExperimentContext} from "../../pages/ExperimentView";

const DetailProperties = () => {
  const {experiment} = useContext(ExperimentContext)
  if (!experiment.properties) {
    return null
  }
  const properties = experiment.properties[0]
  
  const avgThicknessOfGrowth = properties.averageThicknessOfGrowth
  const stdDevOfGrowth = properties.standardDeviationOfGrowth
  const numLayers = properties.numberOfLayers
  const growthCoverage = properties.growthCoverage
  const domainSize = properties.domainSize
  const shape = properties.shape

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

  return (
    <div className='flex flex-col py-2 px-4 mb-2 border rounded'>
      <div className='flex justify-between'>
        <h6 className='font-bold ml-3'> Property #{properties.id}</h6>
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
export default DetailProperties