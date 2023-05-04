import React, {useEffect, useState} from 'react'
import Property from "../components/Property";
import {shapeOptions, defaultPrecision} from "../settings";


const Properties = ({properties, isFilter}) => {
  const [avgThicknessOfGrowthMin, setAvgThicknessOfGrowthMin] = useState(0)
  const [avgThicknessOfGrowthMax, setAvgThicknessOfGrowthMax] = useState(9999)
  const [stdDevOfGrowthMin, setStdDevOfGrowthMin] = useState(0)
  const [stdDevOfGrowthMax, setStdDevOfGrowthMax] = useState(9999)
  const [numberOfLayersMin, setNumberOfLayersMin] = useState(0)
  const [numberOfLayersMax, setNumberOfLayersMax] = useState(9999)
  const [growthCoverageMin, setGrowthCoverageMin] = useState(0)
  const [growthCoverageMax, setGrowthCoverageMax] = useState(100)
  const [domainSizeMin, setDomainSizeMin] = useState(0)
  const [domainSizeMax, setDomainSizeMax] = useState(9999)
  const [shape, setShape] = useState("All")
  const [filteredProperties, setFilteredProperties] = useState(properties)

  useEffect(() => {
    const filtered = properties.filter((property) => {
      const avgThicknessOfGrowth = property.average_thickness_of_growth.value
      const stdDevOfGrowth = property.standard_deviation_of_growth.value
      const numberOfLayers = property.number_of_layers.value
      const growthCoverage = property.growth_coverage.value
      const domainSize = property.domain_size.value
      const shape_ = property.shape.value
      return (shape === 'All' || shape_ === shape)
        && (avgThicknessOfGrowthMin <= avgThicknessOfGrowth && avgThicknessOfGrowth <= avgThicknessOfGrowthMax)
        && (stdDevOfGrowthMin <= stdDevOfGrowth && stdDevOfGrowth <= stdDevOfGrowthMax)
        && (numberOfLayersMin <= numberOfLayers && numberOfLayers <= numberOfLayersMax)
        && (growthCoverageMin <= growthCoverage && growthCoverage <= growthCoverageMax)
        && (domainSizeMin <= domainSize && domainSize <= domainSizeMax)
    })
    setFilteredProperties(filtered)
  }, [properties, shape, avgThicknessOfGrowthMin, avgThicknessOfGrowthMax, stdDevOfGrowthMin, stdDevOfGrowthMax,
    numberOfLayersMin, numberOfLayersMax, growthCoverageMin, growthCoverageMax, domainSizeMin, domainSizeMax])
  if (!properties) {
    return null
  }
  let scrollbarClass = 'w-full'
  let searchBar
  if (!isFilter) {
    scrollbarClass += ' border p-3 h-screen-3/4  overflow-y-scroll'
    searchBar =
      <div className='flex flex-col border rounded mb-2 p-2'>
        <h6 className='block tracking-wide text-gray-700 font-bold align-middle mx-auto'>Shape</h6>
        <div className='flex flex-row justify-center my-2'>
          <div className="w-full md:w-2/3 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="shape">
              Option
            </label>
            <div className="relative">
              <select
                className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="shape"
                onChange={e => setShape(e.target.value)}>
                <option>All</option>
                {
                  shapeOptions.map((option, i) =>
                    <option key={i}>{option}</option>
                  )
                }
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <hr/>
        <h6 className='block tracking-wide text-gray-700 font-bold align-middle mx-auto'>
          Average Thickness of Growth Range (um&sup2;)
        </h6>
        <div className='flex flex-row justify-center my-2'>
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                   htmlFor="avg-thickness-of-growth-min">
              min
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="avg-thickness-of-growth-min" type="number" step={defaultPrecision} value={avgThicknessOfGrowthMin}
              onChange={(e) => setAvgThicknessOfGrowthMin(e.target.value)}
            />
          </div>
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                   htmlFor="avg-thickness-of-growth-max">
              max
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="avg-thickness-of-growth-max" type="number" step={defaultPrecision} value={avgThicknessOfGrowthMax}
              min={avgThicknessOfGrowthMin}
              onChange={(e) => setAvgThicknessOfGrowthMax(e.target.value)}
            />
          </div>
        </div>
        <hr/>
        <h6 className='block tracking-wide text-gray-700 font-bold align-middle mx-auto my-2'>
          Std. Dev. of Growth Range (mm)
        </h6>
        <div className='flex flex-row justify-center my-2'>
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                   htmlFor="std-dev-of-growth-min">
              min
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="std-dev-of-growth-min" type="number" step={defaultPrecision} value={stdDevOfGrowthMin}
              onChange={(e) => setStdDevOfGrowthMin(e.target.value)}
            />
          </div>
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                   htmlFor="std-dev-of-growth-max">
              max
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="std-dev-of-growth-max" type="number" step={defaultPrecision} value={stdDevOfGrowthMax}
              min={stdDevOfGrowthMin}
              onChange={(e) => setStdDevOfGrowthMax(e.target.value)}
            />
          </div>
        </div>
        <hr/>
        <h6 className='block tracking-wide text-gray-700 font-bold align-middle mx-auto my-2'>
          Number of Layers Range (mm)
        </h6>
        <div className='flex flex-row justify-center my-2'>
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                   htmlFor="number-of-layers-min">
              min
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="number-of-layers-min" type="number" step={1} value={numberOfLayersMin}
              onChange={(e) => setNumberOfLayersMin(e.target.value)}
            />
          </div>
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                   htmlFor="number-of-layers-max">
              max
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="number-of-layers-max" type="number" step={1} value={numberOfLayersMax} min={numberOfLayersMin}
              onChange={(e) => setNumberOfLayersMax(e.target.value)}
            />
          </div>
        </div>
        <hr/>
        <h6 className='block tracking-wide text-gray-700 font-bold align-middle mx-auto my-2'>
          Growth Coverage Range (mm&sup2;)
        </h6>
        <div className='flex flex-row justify-center my-2'>
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                   htmlFor="growth-coverage-min">
              min
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="growth-coverage-min" type="number" step={defaultPrecision} value={growthCoverageMin}
              onChange={(e) => setGrowthCoverageMin(e.target.value)}
            />
          </div>
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                   htmlFor="growth-coverage-max">
              max
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="growth-coverage-max" type="number" step={defaultPrecision} value={growthCoverageMax}
              min={growthCoverageMin}
              onChange={(e) => setGrowthCoverageMax(e.target.value)}
            />
          </div>
        </div>
        <hr/>
        <h6 className='block tracking-wide text-gray-700 font-bold align-middle mx-auto my-2'>
          Domain Size Range (mm&sup2;)
        </h6>
        <div className='flex flex-row justify-center my-2'>
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                   htmlFor="domain-size-min">
              min
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="domain-size-min" type="number" step={defaultPrecision} value={domainSizeMin}
              onChange={(e) => setDomainSizeMin(e.target.value)}
            />
          </div>
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                   htmlFor="domain-size-max">
              max
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="domain-size-max" type="number" step={defaultPrecision} value={domainSizeMax}
              min={domainSizeMin}
              onChange={(e) => setDomainSizeMax(e.target.value)}
            />
          </div>
        </div>
      </div>
  }
  return (
    <>
      {searchBar}
      <div className={scrollbarClass}>
        {filteredProperties.map((property, i) =>
          <Property
            key={i}
            id={property.id}
            avgThicknessOfGrowth={property.average_thickness_of_growth.value}
            stdDevOfGrowth={property.standard_deviation_of_growth.value}
            numLayers={property.number_of_layers.value}
            growthCoverage={property.growth_coverage.value}
            domainSize={property.domain_size.value}
            shape={property.shape.value}
            isAddedToFilter={property.isAddedToFilter}
            isFilter={isFilter}
          />
        )}
      </div>
    </>
  )
}

export default Properties
