import React from "react";

const DetailAuthor = ({id, firstName, lastName, institution}) => {
  const displayName = <span className='md:w-1/2'>{firstName} {lastName}</span>
  const displayInstitution = <span className='md:w-1/2'>{institution}</span>

  return (
    <div className='flex flex-col py-2 px-4 mb-2 border'>
      <div className='flex justify-between'>
        <h6 className='font-bold ml-3'> Author #{id}</h6>
      </div>
      <hr className='my-1'/>
      <div className='w-full md:flex md:items-center mb-1'>
        <span className='md:w-1/2 block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'>Name :</span>
        {displayName}
      </div>
      <div className='w-full md:flex md:items-center mb-1'>
        <span
          className='md:w-1/2 block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'>Institution :</span>
        {displayInstitution}
      </div>
    </div>
  )
}

export default DetailAuthor