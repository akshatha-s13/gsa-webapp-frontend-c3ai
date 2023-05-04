import React, {useContext} from "react";
import {GlobalContext} from "../pages/App";

const Author = ({idx, id, firstName, lastName, institution, isCurrentFilter, isFilter}) => {
  const {toolState, toolDispatch} = useContext(GlobalContext)

  const displayName =
    <span className='md:w-1/2'>{firstName} {lastName}</span>
  const displayInstitution =
    <span className='md:w-1/2'>{institution}</span>

  const onClickAdd = () => {
    for (const filter of toolState.filters) {
      if (filter.type === 'AUTHOR' && filter.id === id) {
        alert("The author is already added to the filters.")
        return
      }
    }

    toolDispatch({
      type: 'ADD_FILTER',
      payload: {
        type: 'AUTHOR', category: 'author', id, firstName, lastName, institution
      }
    })
  }
  let btn = (
    <button
      className='w-6 h-6 text-center bg-green-500 hover:bg-green-700 text-white text-md font-bold rounded focus:outline-none focus:shadow-outline'
      type='button'
      onClick={onClickAdd}
    >
      +
    </button>
  )


  return (
    <div className='flex flex-col py-2 px-4 mb-2 border rounded'>
      <div className='flex justify-between'>
        <h6 className='font-bold ml-3'>Author #{id}</h6>
        {btn}
      </div>
      <hr className='my-1'/>
      <div className='w-full md:flex md:items-center mb-1'>
        <span className='md:w-1/2 block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'>Name :</span>
        {displayName}
      </div>
      <div className='w-full md:flex md:items-center mb-1'>
        <span className='md:w-1/2 block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'>Institution :</span>
        {displayInstitution}
      </div>
    </div>
  )
}
export default Author