import React, {useEffect, useState} from 'react'

import Recipe from '../components/Recipe'
import {carbonSourceOptions, defaultPrecision} from "../settings";

const Recipes = ({recipes, isFilter}) => {
  const [carbonSource, setCarbonSource] = useState("All")
  const [basePressureMin, setBasePressureMin] = useState(0)
  const [basePressureMax, setBasePressureMax] = useState(9999)
  const [filteredRecipes, setFilteredRecipes] = useState(recipes)
  useEffect(() => {
    const filtered = recipes.filter((recipe) => {
      const carbSource = recipe.carbon_source.value
      const basePressure = recipe.base_pressure.value
      return (carbonSource === 'All' || carbonSource === carbSource)
        && (basePressureMin <= basePressure && basePressure <= basePressureMax)
    })
    setFilteredRecipes(filtered)
  }, [recipes, carbonSource, basePressureMin, basePressureMax])

  if (!recipes) {
    return null
  }
  let scrollbarClass = 'w-full'
  let searchBar
  if (!isFilter) {
    scrollbarClass += ' border p-3 h-screen-3/4  overflow-y-scroll'
    searchBar =
      <div className='flex flex-col border rounded mb-2 p-2'>
        <h6 className='block tracking-wide text-gray-700 font-bold align-middle mx-auto'>Carbon Source</h6>
        <div className='flex flex-row justify-center my-2'>
          <div className="w-full md:w-2/3 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                   htmlFor="carbon-source">
              Option
            </label>
            <div className="relative">
              <select
                className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="carbon-source"
                onChange={e => setCarbonSource(e.target.value)}>
                <option>All</option>
                {
                  carbonSourceOptions.map((option, i) =>
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
        <h6 className='block tracking-wide text-gray-700 font-bold align-middle mx-auto'>Base Pressure Range (Torr)</h6>
        <div className='flex flex-row justify-center my-2'>
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                   htmlFor="base-pressure-min">
              min
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="base-pressure-min" type="number" step={defaultPrecision} value={basePressureMin}
              onChange={(e) => setBasePressureMin(e.target.value)}
            />
          </div>
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                   htmlFor="base-pressure-max">
              max
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="base-pressure-max" type="number" step={defaultPrecision} value={basePressureMax} min={basePressureMin}
              onChange={(e) => setBasePressureMax(e.target.value)}
            />
          </div>
        </div>
      </div>
  }
  return (
    <>
      {searchBar}
      <div className={scrollbarClass}>
        {filteredRecipes.map((recipe, i) =>
          <Recipe
            key={i}
            id={recipe.id}
            carbonSource={recipe.carbon_source.value}
            basePressure={recipe.base_pressure.value}
            preparationSteps={recipe.preparation_steps}
            isAddedToFilter={recipe.isAddedToFilter}
            isFilter={isFilter}
          />
        )}
      </div>
    </>
  )
}

export default Recipes
