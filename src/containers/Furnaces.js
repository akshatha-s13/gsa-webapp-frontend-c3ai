import React, {useEffect, useState} from 'react'

import Furnace from '../components/Furnace'
import {defaultPrecision} from "../settings";

const Furnaces = ({furnaces, isFilter}) => {
  const [tubeDiameterMin, setTubeDiameterMin] = useState(0)
  const [tubeDiameterMax, setTubeDiameterMax] = useState(9999)
  const [CSAMin, setCSAMin] = useState(0)
  const [CSAMax, setCSAMax] = useState(9999)
  const [tubeLengthMin, setTubeLengthMin] = useState(0)
  const [tubeLengthMax, setTubeLengthMax] = useState(9999)
  const [LoHRMin, setLoHRMin] = useState(0)
  const [LoHRMax, setLoHRMax] = useState(9999)
  const [filteredFurnaces, setFilteredFurnaces] = useState(furnaces)

  useEffect(() => {
    const filtered = furnaces.filter((furnace) => {
      const tubeDiameter = furnace.tube_diameter.value
      const CSA = furnace.cross_sectional_area.value
      const tubeLength = furnace.tube_length.value
      const LoHR = furnace.length_of_heated_region.value
      return (tubeDiameter === null || (tubeDiameterMin <= tubeDiameter && tubeDiameter <= tubeDiameterMax))
        && (CSA === null || (CSAMin <= CSA && CSA <= CSAMax))
        && (tubeLength === null || (tubeLengthMin <= tubeLength && tubeLength <= tubeLengthMax))
        && (LoHR === null || (LoHRMin <= LoHR && LoHR <= LoHRMax))
    })
    setFilteredFurnaces(filtered)
  }, [furnaces, tubeDiameterMin, tubeDiameterMax, CSAMin, CSAMax, tubeLengthMin, tubeLengthMax, LoHRMin, LoHRMax])

  if (!furnaces) {
    return null
  }
  let scrollbarClass = 'w-full'
  let searchBar
  if (!isFilter) {
    scrollbarClass += ' border p-3 h-screen-3/4  overflow-y-scroll'
    searchBar =
      <div className='flex flex-col border rounded mb-2 p-2'>
        <h6 className='block tracking-wide text-gray-700 font-bold align-middle mx-auto'> Tube Diameter Range (mm)</h6>
        <div className='flex flex-row justify-center my-2'>
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="tube-diameter-min">
              min
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="tube-diameter-min" type="number" step={defaultPrecision} value={tubeDiameterMin}
              onChange={(e) => setTubeDiameterMin(e.target.value)}
            />
          </div>
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="tube-diameter-max">
              max
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="tube-diameter-max" type="number" step={defaultPrecision} value={tubeDiameterMax} min={tubeDiameterMin}
              onChange={(e) => setTubeDiameterMax(e.target.value)}
            />
          </div>
        </div>
        <hr/>
        <h6 className='block tracking-wide text-gray-700 font-bold align-middle mx-auto my-2'> Cross Sectional Area
          Range (mm&sup2;)</h6>
        <div className='flex flex-row justify-center my-2'>
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="csa-min">
              min
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="csa-min" type="number" step={defaultPrecision} value={CSAMin}
              onChange={(e) => setCSAMin(e.target.value)}
            />
          </div>
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="csa-max">
              max
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="csa-max" type="number" step={defaultPrecision} value={CSAMax} min={CSAMin}
              onChange={(e) => setCSAMax(e.target.value)}
            />
          </div>
        </div>
        <hr/>
        <h6 className='block tracking-wide text-gray-700 font-bold align-middle mx-auto my-2'> Tube Length Range (mm)</h6>
        <div className='flex flex-row justify-center my-2'>
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="tube-length-min">
              min
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="tube-length-min" type="number" step={defaultPrecision} value={tubeLengthMin}
              onChange={(e) => setTubeLengthMin(e.target.value)}
            />
          </div>
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="tube-length-max">
              max
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="tube-length-max" type="number" step={defaultPrecision} value={tubeLengthMax} min={tubeLengthMin}
              onChange={(e) => setTubeLengthMax(e.target.value)}
            />
          </div>
        </div>
        <hr/>
        <h6 className='block tracking-wide text-gray-700 font-bold align-middle mx-auto my-2'> Length of Heated Region
          Range (mm)</h6>
        <div className='flex flex-row justify-center my-2'>
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="lohr-min">
              min
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="lohr-min" type="number" step={defaultPrecision} value={LoHRMin}
              onChange={(e) => setLoHRMin(e.target.value)}
            />
          </div>
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="lohr-max">
              max
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="lohr-max" type="number" step={defaultPrecision} value={LoHRMax} min={LoHRMin}
              onChange={(e) => setLoHRMax(e.target.value)}
            />
          </div>
        </div>
      </div>
  }
  return (
    <>
      {searchBar}
      <div className={scrollbarClass}>
        {filteredFurnaces.map((furnace, i) =>
          <Furnace
            key={furnace.id}
            id={furnace.id}
            tubeDiameter={furnace.tube_diameter.value}
            crossSectionalArea={furnace.cross_sectional_area.value}
            tubeLength={furnace.tube_length.value}
            lengthOfHeatedRegion={furnace.length_of_heated_region.value}
            isAddedToFilter={furnace.isAddedToFilter}
            isFilter={isFilter}
          />
        )}
      </div>
    </>
  )
}

export default Furnaces
