import React from "react";
import DetailEnvironmentCondition from "../components/ExperimentDetail/DetailEnvironmentCondition";
import DetailFurnace from "../components/ExperimentDetail/DetailFurnace";
import DetailSubstrate from "../components/ExperimentDetail/DetailSubstrate";
import DetailRecipe from "../components/ExperimentDetail/DetailRecipe";
import DetailProperties from "../components/ExperimentDetail/DetailProperties";
import DetailAuthors from "../components/ExperimentDetail/DetailAuthors";

const ExperimentDetails = () => {
  return (
    <>
      <DetailAuthors/>
      <DetailEnvironmentCondition/>
      <DetailFurnace/>
      <DetailSubstrate/>
      <DetailProperties/>
      <DetailRecipe/>
    </>
  )
}

export default ExperimentDetails