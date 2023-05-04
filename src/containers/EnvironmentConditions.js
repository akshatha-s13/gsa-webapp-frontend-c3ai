import React, {useEffect, useState} from 'react'
import {defaultPrecision} from "../settings";
import EnvironmentCondition from '../components/EnvironmentCondition'

const EnvironmentConditions = ({environmentConditions, isFilter}) => {
  const [envConMin, setEnvConMin] = useState(0)
  const [envConMax, setEnvConMax] = useState(9999)
  const [dewPointMin, setDewPointMin] = useState(0)
  const [dewPointMax, setDewPointMax] = useState(9999)
  const [filteredEnvCons, setFilteredEnvCons] = useState(environmentConditions)

  useEffect(() => {
    const filtered = environmentConditions.filter((envCon) => {
      const ambientTemperature = envCon.ambient_temperature.value
      const dewPoint = envCon.dew_point.value
      return (ambientTemperature === null || (envConMin <= ambientTemperature && ambientTemperature <= envConMax))
        && (dewPoint === null || (dewPointMin <= dewPoint && dewPoint <= dewPointMax))
    })
    setFilteredEnvCons(filtered)
  }, [environmentConditions, envConMin, envConMax, dewPointMin, dewPointMax])

  if (!environmentConditions) {
    return null
  }
  let scrollbarClass = 'w-full'
  let searchBar = null
  if (!isFilter) {
    scrollbarClass += ' border p-3 h-screen-3/4  overflow-y-scroll'
    searchBar =
      <div className='flex flex-col border rounded mb-2 p-2'>
        <h6 className='block tracking-wide text-gray-700 font-bold align-middle mx-auto'> Ambient Temperature
          Range (&deg;C)</h6>
        <div className='flex flex-row justify-center my-2'>
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="env-con-min">
              min
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="env-con-min" type="number" step={defaultPrecision} value={envConMin}
              onChange={(e) => setEnvConMin(e.target.value)}
            />
          </div>
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="env-con-max">
              max
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="env-con-max" type="number" step={defaultPrecision} value={envConMax} min={envConMin}
              onChange={(e) => setEnvConMax(e.target.value)}
            />
          </div>
        </div>
        <hr/>
        <h6 className='block tracking-wide text-gray-700 font-bold align-middle mx-auto my-2'> Dew Point Range
          Range (&deg;C)</h6>
        <div className='flex flex-row justify-center my-2'>
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                   htmlFor="dew-point-min">
              min
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="dew-point-min" type="number" step={defaultPrecision} value={dewPointMin}
              onChange={(e) => setDewPointMin(e.target.value)}
            />
          </div>
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                   htmlFor="dew-point-max">
              max
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="dew-point-max" type="number" step={defaultPrecision} value={dewPointMax} min={dewPointMin}
              onChange={(e) => setDewPointMax(e.target.value)}
            />
          </div>
        </div>
      </div>
  }
  return (
    <>
      {searchBar}
      <div className={scrollbarClass}>
        {filteredEnvCons.map((envCon, i) =>
          <EnvironmentCondition
            key={i}
            id={envCon.id}
            ambientTemperature={envCon.ambient_temperature.value}
            dewPoint={envCon.dew_point.value}
            isAddedToFilter={envCon.isAddedToFilter}
            isFilter={isFilter}
          />)}
      </div>
    </>
  )
}

export default EnvironmentConditions
