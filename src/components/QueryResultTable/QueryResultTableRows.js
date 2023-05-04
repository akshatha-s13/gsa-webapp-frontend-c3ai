import React, {useContext} from "react";
import {GlobalContext} from "../../pages/App";
import {isDefault} from "./utils";
import {Link} from "react-router-dom";

const QueryResultTableRows = () => {
  const {toolState} = useContext(GlobalContext)

  return (
    <>
      {toolState.queryResults.map(experiment => {
        const furnaceId = experiment.furnace ? experiment.furnace.id : 'N/A'
        const substrateId = experiment.substrate ? experiment.substrate.id : 'N/A'
        const numLayers = experiment.properties ? experiment.properties[0].numberOfLayers : 'N/A'
        const coverage = experiment.properties ? experiment.properties[0].growthCoverage : 'N/A'
        const author = experiment.authors ? (experiment.authors.length > 0 ? experiment.authors[0].firstName + ' ' + experiment.authors[0].lastName : 'N/A'):'N/A'
        const carbonSource = experiment.recipe ? experiment.recipe.carbonSource : 'N/A'
        return (
          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <td className="py-4 px-6 text-sm font-medium text-blue-700 underline whitespace-nowrap dark:text-white">
              <Link to={`/tool/experiments/${experiment.id}`}>
                {experiment.id}
              </Link>
            </td>
            <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
              {furnaceId}
            </td>
            <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
              {substrateId}
            </td>
            <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
              {numLayers}
            </td>
            <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
              {coverage}
            </td>
            {/* <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
              ????
            </td> */}
            <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
              {author}
            </td>
            <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
              {carbonSource}
            </td>
            {/* COLUMNS FOR ADDITIONAL FILTERS */}
            {toolState.savedFilters
              .filter(filter => !isDefault(filter))
              .map((filter, i) => {
                 //console.log(filter)
                  if (!filter || !filter.name) {
                    return null
                  }
                  const filterName = filter.name.toLowerCase()
                  let value = null
                  if (filterName.includes('dew point'))
                    value = experiment.environmentConditions ? experiment.environmentConditions.dewPoint : 'N/A'
                  else if (filterName.includes('ambient temperature'))
                    value = experiment.environmentConditions ? experiment.environmentConditions.ambientTemperature : 'N/A'
                  else if (filterName.includes('tube diameter'))
                    value = experiment.furnace ? experiment.furnace.tubeDiameter : 'N/A'
                  else if (filterName.includes('cross sectional area'))
                    value = experiment.furnace ? experiment.furnace.crossSectionalArea : 'N/A'
                  else if (filterName.includes('tube length'))
                    value = experiment.furnace ? experiment.furnace.tubeLength : 'N/A'
                  else if (filterName.includes('length of heated region'))
                    value = experiment.furnace ? experiment.furnace.lengthOfHeatedRegion : 'N/A'
                  else if (filterName.includes('catalyst'))
                    value = experiment.substrate ? experiment.substrate.catalyst : 'N/A'
                  else if (filterName.includes('average thickness of growth')) // check before thickness substring
                      value = experiment.properties ? experiment.properties[0].averageThicknessOfGrowth : 'N/A'
                  else if (filterName.includes('thickness'))
                    value = experiment.substrate ? experiment.substrate.thickness : 'N/A'
                  else if (filterName.includes('diameter'))
                    value = experiment.substrate ? experiment.substrate.diameter : 'N/A'
                  else if (filterName.includes('length'))
                    value = experiment.substrate ? experiment.substrate.length : 'N/A'
                  else if (filterName.includes('surface area'))
                    value = experiment.substrate ? experiment.substrate.surfaceArea : 'N/A'
                  else if (filterName.includes('shape'))
                    value = experiment.properties ? experiment.properties[0].shape : 'N/A'
                  else if (filterName.includes('std. dev. of growth'))
                    value = experiment.properties ? experiment.properties[0].standardDeviationOfGrowth : 'N/A'
                  else if (filterName.includes('number of layers'))
                    value = experiment.properties ? experiment.properties[0].numberOfLayers : 'N/A'
                  else if (filterName.includes('growth coverage'))
                    value = experiment.properties ? experiment.properties[0].growthCoverage : 'N/A'
                  else if (filterName.includes('domain size'))
                    value = experiment.properties ? experiment.properties[0].domainSize : 'N/A'
                  else if (filterName.includes('base pressure'))
                    value = experiment.recipe ? experiment.recipe.basePressure : 'N/A'
                  else if (filterName.includes('maximum temperature'))
                    value = experiment.recipe ? experiment.recipe.maximumTemperature : 'N/A' 
                  else if (filterName.includes('maximum pressure'))
                    value = experiment.recipe ? experiment.recipe.maximumPressure : 'N/A'
                  else if (filterName.includes('maximum flow rate'))
                    value = experiment.recipe ? experiment.recipe.maximumFlowRate : 'N/A'
                  else if (filterName.includes('inert gas'))
                    value = (experiment.recipe.usesArgon ? "Argon" : "")+" "+(experiment.recipe.usesHelium ? "Helium" : "") //value
                    // experiment.recipe ? (experiment.recipe.uses_helium? "Helium ":"") + (experiment.recipe.uses_argon? "Argon ":"") : 'N/A' 
                  else if (filterName.includes('growth duration'))
                    value = experiment.recipe ? experiment.recipe.growthDuration : 'N/A'
                  else if (filterName.includes('average carbon flow rate'))
                    value = experiment.recipe ? experiment.recipe.averageCarbonFlowRate.toFixed(2) : 'N/A'
                  return (
                    <td key={filter.name}
                        className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                      {value}
                    </td>
                  )
                }
              )
            }
          </tr>
        )
      })}
    </>
  )
}
export default QueryResultTableRows