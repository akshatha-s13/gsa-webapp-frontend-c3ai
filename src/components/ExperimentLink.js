import React from "react";
import {Link} from "react-router-dom";

const ExperimentLink = ({id}) => {
  return <Link to={`/tool/experiments/${id}`} target="_blank"
               className='bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 m-2 rounded'>
    Experiment {id}
  </Link>
}

export default ExperimentLink