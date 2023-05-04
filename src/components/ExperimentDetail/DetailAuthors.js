import React, {useContext} from "react";
import {ExperimentContext} from "../../pages/ExperimentView";
import DetailAuthor from "./DetailAuthor";

const DetailAuthors = () => {
  const {experiment} = useContext(ExperimentContext)
  const authors = experiment.authors
  if (!authors || authors.length === 0) {
    return null
  }

  return (
    <div className='flex flex-col py-2 px-4 mb-2 border'>
      <div className='flex justify-between'>
        <h6 className='font-bold ml-3'>Authors</h6>
      </div>
      <hr className='my-1'/>
      {authors.map(author =>
        <DetailAuthor
          key={author.id}
          id={author.id}
          firstName={author.firstName}
          lastName={author.lastName}
          institution={author.institution}
        />
      )}
    </div>
  )
}

export default DetailAuthors