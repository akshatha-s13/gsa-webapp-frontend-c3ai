import React, {useContext, useEffect} from "react";
import {Line} from "react-chartjs-2";
import {Chart} from "chart.js/auto"; // Required for graph
import {ExperimentContext} from "../pages/ExperimentView";

const RecipeGraph = () => {
  const {recipeGraphData, experimentDispatch} = useContext(ExperimentContext)
  useEffect(() => {
    experimentDispatch({type: 'INIT_GRAPH_DATA'})
  }, [experimentDispatch])

  if (!recipeGraphData) {
    return null
  }

  return (
    <div className='w-full'>
      <p className='text-center my-3'>x axis: time (min), y axis: value (unit described in the ledger)</p>
      <Line
        data={recipeGraphData.data}
        options={{
          scales: {
            x: {
              type: 'linear',
              beginAtZero: false
            },
            y: {
              beginAtZero: false
            }
          }
        }}
      />
      <p className='text-center my-3 mb-2'>
        Annealing: 0 - {recipeGraphData.annealingEndTime} min
      </p>
      <p className='text-center my-3 mb-2'>
        Growing: {recipeGraphData.annealingEndTime} - {recipeGraphData.growingEndTime} min
      </p>
      <p className='text-center my-3 mb-2'>
        Cooling: {recipeGraphData.growingEndTime} - {recipeGraphData.coolingEndTime} min
      </p>
    </div>
  )
}

export default RecipeGraph