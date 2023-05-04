import React from 'react'
import PreparationStep from '../components/PreparationStep'

const PreparationSteps = ({preparationSteps}) => {
  if (!preparationSteps) {
    return null
  }
  return (
    preparationSteps.map((preparationStep, i) =>
      <PreparationStep
        key={preparationStep.id}
        id={preparationStep.id}
        step={preparationStep.step}
        name={preparationStep.name}
        duration={preparationStep.duration}
        furnaceTemperature={preparationStep.furnaceTemperature}
        furnacePressure={preparationStep.furnacePressure}
        sampleLocation={preparationStep.sampleLocation}
        heliumFlowRate={preparationStep.heliumFlowRate}
        hydrogenFlowRate={preparationStep.hydrogenFlowRate}
        carbonSourceFlowRate={preparationStep.carbonSourceFlowRate}
        argonFlowRate={preparationStep.argonFlowRate}
        coolingRate={preparationStep.coolingRate}
      />
    )
  )
}

export default PreparationSteps
