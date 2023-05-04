import React, {useEffect, useState} from 'react'
import Substrate from '../components/Substrate'
import {defaultPrecision} from "../settings";
import {catalystOptions} from "../settings";

const Substrates = ({substrates, isFilter}) => {
  const [catalyst, setCatalyst] = useState("All")
  const [thicknessMin, setThicknessMin] = useState(0)
  const [thicknessMax, setThicknessMax] = useState(9999)
  const [diameterMin, setDiameterMin] = useState(0)
  const [diameterMax, setDiameterMax] = useState(9999)
  const [lengthMin, setLengthMin] = useState(0)
  const [lengthMax, setLengthMax] = useState(9999)
  const [surfaceAreaMin, setSurfaceAreaMin] = useState(0)
  const [surfaceAreaMax, setSurfaceAreaMax] = useState(9999)
  const [filteredSubstrates, setFilteredSubstrates] = useState(substrates)

  useEffect(() => {
    const filtered = substrates.filter((substrate) => {
      const catal = substrate.catalyst.value
      const thickness = substrate.thickness.value
      const diameter = substrate.diameter.value
      const length = substrate.length.value
      const surfaceArea = substrate.surface_area.value
      return (catalyst === 'All' || catal === catalyst)
        && (thickness === null || (thicknessMin <= thickness && thickness <= thicknessMax))
        && (diameter === null || (diameterMin <= diameter && diameter <= diameterMax))
        && (length === null || (lengthMin <= length && length <= lengthMax))
        && (surfaceArea === null || (surfaceAreaMin <= surfaceArea && surfaceArea <= surfaceAreaMax))
    })
    setFilteredSubstrates(filtered)
  }, [substrates, catalyst, thicknessMin, thicknessMax, diameterMin, diameterMax, lengthMin, lengthMax, surfaceAreaMin, surfaceAreaMax])
  if (!substrates) {
    return null
  }
  let scrollbarClass = 'w-full'
  let searchBar
  if (!isFilter) {
    scrollbarClass += ' border p-3 h-screen-3/4 overflow-y-scroll'
    searchBar =
      <div className='flex flex-col border rounded mb-2 p-2'>
        <h6 className='block tracking-wide text-gray-700 font-bold align-middle mx-auto'> Catalyst</h6>
        <div className='flex flex-row justify-center my-2'>
          <div className="w-full md:w-2/3 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="catalyst">
              Option
            </label>
            <div className="relative">
              <select
                className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="catalyst"
                onChange={e => setCatalyst(e.target.value)}>
                <option>All</option>
                {
                  catalystOptions.map((option, i) =>
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
          Thickness Range (um&sup2;)
        </h6>
        <div className='flex flex-row justify-center my-2'>
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                   htmlFor="thickness-min">
              min
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="thickness-min" type="number" step={defaultPrecision} value={thicknessMin}
              onChange={(e) => setThicknessMin(e.target.value)}
            />
          </div>
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                   htmlFor="thickness-max">
              max
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="thickness-max" type="number" step={defaultPrecision} value={thicknessMax} min={thicknessMin}
              onChange={(e) => setThicknessMax(e.target.value)}
            />
          </div>
        </div>
        <hr/>
        <h6 className='block tracking-wide text-gray-700 font-bold align-middle mx-auto my-2'>
          Diameter Range (mm)
        </h6>
        <div className='flex flex-row justify-center my-2'>
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                   htmlFor="diameter-min">
              min
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="diameter-min" type="number" step={defaultPrecision} value={diameterMin}
              onChange={(e) => setDiameterMin(e.target.value)}
            />
          </div>
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                   htmlFor="diameter-max">
              max
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="diameter-max" type="number" step={defaultPrecision} value={diameterMax} min={diameterMin}
              onChange={(e) => setDiameterMax(e.target.value)}
            />
          </div>
        </div>
        <hr/>
        <h6 className='block tracking-wide text-gray-700 font-bold align-middle mx-auto my-2'>
          Length Range (mm)
        </h6>
        <div className='flex flex-row justify-center my-2'>
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="length-min">
              min
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="length-min" type="number" step={defaultPrecision} value={lengthMin}
              onChange={(e) => setLengthMin(e.target.value)}
            />
          </div>
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="length-max">
              max
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="length-max" type="number" step={defaultPrecision} value={lengthMax} min={lengthMin}
              onChange={(e) => setLengthMax(e.target.value)}
            />
          </div>
        </div>
        <hr/>
        <h6 className='block tracking-wide text-gray-700 font-bold align-middle mx-auto my-2'>
          Surface Area Range (mm&sup2;)
        </h6>
        <div className='flex flex-row justify-center my-2'>
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                   htmlFor="surface-area-min">
              min
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="surface-area-min" type="number" step={defaultPrecision} value={surfaceAreaMin}
              onChange={(e) => setSurfaceAreaMin(e.target.value)}
            />
          </div>
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                   htmlFor="surface-area-max">
              max
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="surface-area-max" type="number" step={defaultPrecision} value={surfaceAreaMax} min={surfaceAreaMin}
              onChange={(e) => setSurfaceAreaMax(e.target.value)}
            />
          </div>
        </div>
      </div>
  }

  return (
    <>
      {searchBar}
      <div className={scrollbarClass}>
        {filteredSubstrates.map((substrate, i) =>
          <Substrate
            key={substrate.id}
            id={substrate.id}
            catalyst={substrate.catalyst.value}
            thickness={substrate.thickness.value}
            diameter={substrate.diameter.value}
            length={substrate.length.value}
            surfaceArea={substrate.surface_area.value}
            isAddedToFilter={substrate.isAddedToFilter}
            isFilter={isFilter}
          />
        )}
      </div>
    </>
  )
}

export default Substrates
