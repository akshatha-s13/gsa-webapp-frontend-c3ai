import React, {useContext} from "react"
import {GlobalContext} from "../../pages/App";

const SearchFilter = ({idx, type, name, min, max, value, firstName, lastName, institution}) => {
  const {toolDispatch} = useContext(GlobalContext)

  return (
    <div className='flex flex-col py-2 px-4 mb-2 border'>
      <div className='flex justify-between'>
        {type === 'AUTHOR' ||
          <h6 className='font-bold ml-3'>{name}</h6>
        }
        {type === 'AUTHOR' &&
          <h6 className='font-bold ml-3'>Author</h6>
        }
        <button
          className='w-6 h-6 text-center bg-red-500 hover:bg-red-700 text-white text-md font-bold rounded focus:outline-none focus:shadow-outline'
          type='button'
          onClick={() => {
            toolDispatch({type: 'REMOVE_FILTER', payload: idx})
          }}
        >
          ✕
        </button>
      </div>
      <hr className='my-1'/>
      {type === 'KEY_VALUE' &&
        <div className='w-full md:flex md:items-center mb-1'>
          <span className='md:w-1/2 block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'>Value :</span>
          <span className='md:w-1/2 block mb-1 md:mb-0 pr-4'>{value}</span>
        </div>
      }
      {type === 'MIN_MAX' &&
        <>
          <div className='w-full md:flex md:items-center mb-1'>
            <span className='md:w-1/2 block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'>Min :</span>
            <span className='md:w-1/2 block mb-1 md:mb-0 pr-4'>{min}</span>
          </div>
          <div className='w-full md:flex md:items-center mb-1'>
            <span className='md:w-1/2 block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'>Max :</span>
            <span className='md:w-1/2 block mb-1 md:mb-0 pr-4'>{max}</span>
          </div>
        </>
      }
      {type === 'AUTHOR' &&
        <>
          <div className='w-full md:flex md:items-center mb-1'>
            <span className='md:w-1/2 block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'>Name :</span>
            <span className='md:w-1/2 block mb-1 md:mb-0 pr-4'>{firstName} {lastName}</span>
          </div>
          <div className='w-full md:flex md:items-center mb-1'>
            <span
              className='md:w-1/2 block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4'>Institution :</span>
            <span className='md:w-1/2 block mb-1 md:mb-0 pr-4'>{institution}</span>
          </div>
        </>
      }
    </div>
  )
}

export default SearchFilter