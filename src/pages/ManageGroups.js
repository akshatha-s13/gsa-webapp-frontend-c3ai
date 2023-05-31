import React, {useContext, useState, useEffect} from 'react'
//import {GlobalContext} from "./App";
import axios from "axios";
import { showConfirm } from '../components/CustomConfirm';
import { showAlert } from '../components/CustomAlert';

const ManageGroups = () => {  
  //const {userState} = useContext(GlobalContext)
  const [data, setData] = useState([]);
  const [flag, setFlag] = useState(1);
  const [addNewInstitution, setAddNewInstitution] = useState(false)
  const [newInstitution, setNewInstitution] = useState('')
  const [institutionOptions, setInstitutionOptions] = useState([])
  const [institution, setInstitution] = useState('')
  const [groupId, setGroupId] = useState('')
  const [groupName, setGroupName] = useState('')
  const [groupDescription, setGroupDescription] = useState('')

  useEffect(() => {
    const init = async () => {
      try {
        const response = await axios.post(
          process.env.REACT_APP_C3_URL+'/api/1/'+process.env.REACT_APP_C3_TENANT+'/'+process.env.REACT_APP_C3_TAG+'/GrdbGroup', 
          {}, 
          {
              params: {
                  'action': 'fetch'
              },
              headers: {
                  'authorization': 'Bearer '+ window.localStorage.getItem('token'),
                  'accept': 'application/json', //xml
                  'content-type': 'application/json'
              }
          } 
        );
        //console.log(response.data.objs)
        if (response.status === 200) {
          setData(response.data.objs)
        }

        const response1 = await axios.post(
            process.env.REACT_APP_C3_URL+'/api/1/'+process.env.REACT_APP_C3_TENANT+'/'+process.env.REACT_APP_C3_TAG+'/Author', 
            {spec: {projection: 'unique(institution)'}},
            {
                params: {
                    'action': 'evaluate'
                },
                headers: {
                    'authorization': 'Bearer '+  window.localStorage.getItem('adminToken'),
                    'accept': 'application/json', //xml
                    'content-type': 'application/json'
                }
            }
        );  
        if(response1.data.count>0)
        {
        const data = response1.data.tuples.map((obj) => obj.cells[0].str) 
        setInstitutionOptions(data)
        //setInstitution(data[0])
        } 

      } catch (e) {
        //console.log(e)
       showAlert(e.message)
      }
    }
    init()
  }, [flag])
 
  const onClickCreateBtn = async (e) => {
    e.preventDefault()
    if (groupId === '') {
     showAlert('Group ID field is empty.')
      return
    }
    if (groupName === '') {
     showAlert('Group name field is empty.')
      return
    }
    if (groupDescription === '') {
     showAlert('Group description field is empty.')
      return
    }
    if (addNewInstitution && newInstitution === '') {
     showAlert('Institution field is empty.')
      return
    }
    try {
      const inst = addNewInstitution ? newInstitution : institution;
      const token = window.localStorage.getItem('token');
      const response = await axios.post(
        process.env.REACT_APP_C3_URL+'/api/1/'+process.env.REACT_APP_C3_TENANT+'/'+process.env.REACT_APP_C3_TAG+'/GrdbIdentityManager', 
        '', 
        {
            params: {
                'action': 'createGrdbGroup',
                'id': groupId,
                'name': groupName,
                'institution': inst,
                'description': groupDescription 
            },
            headers: {
                'authorization': 'Bearer '+token,
                'accept': 'application/xml',
                'content-type': 'application/xml'
            }
        }
      );
      if(response.status===200)
      {
       showAlert("New group created")  // change 
        setFlag((prevdata)=>prevdata+1);
        setGroupId('');
        setGroupName('');
        setGroupDescription('');
        setInstitution('');
        setNewInstitution('');
        setAddNewInstitution(false);
      }
      else
      {
       showAlert("Creating new group failed. Try again")  // change 
      }

    } catch (err) {
      if(err){
      //console.log(err.message) // change 
     showAlert(err.message)
    }
    }
  }

  const handleDelete = async (groupId) => {
    const confirmed = await showConfirm("Are you sure you want to delete this group?");
    if (confirmed){
    //if (window.confirm("Are you sure you want to delete this group?")) {
      try {
        const response = await axios.post(
          process.env.REACT_APP_C3_URL + "/api/1/" + process.env.REACT_APP_C3_TENANT + "/" + process.env.REACT_APP_C3_TAG + "/GrdbGroup",
          '',
          {
            params: {
              'action': "remove",
              'id': groupId,
            },
            headers: {
              "authorization": "Bearer " + window.localStorage.getItem("token"),
              "accept": "application/xml",
              "content-type": "application/xml",
            },
          }
        );
        if (response.status === 200) {
          //setData((prevData) => prevData.filter((group) => group.id !== groupId));
          setFlag((prevdata)=>prevdata+1);
         showAlert("Group deleted successfully.");
        } else {
         showAlert("Deleting group failed. Try again.");
        }
      } catch (err) {
        //console.log(err.message);
       showAlert(err.message)
      }
    }
  };
  

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block py-2 min-w-full sm:px-6 lg:px-8">
          <div className="overflow-x-scroll sm:rounded-lg border">
            <table className="min-w-full">
              <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th scope="col"
                    className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
                    Group ID
                </th>
                <th scope="col"
                    className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
                    Name
                </th>
                <th scope="col"
                    className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
                    Institution
                </th>
                <th scope="col"
                    className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
                    Description
                </th>
                <th scope="col"
                    className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
                    Delete
                </th>
              </tr>
              </thead>
              <tbody>
              {data.map(group => {
                return (
                <tr key={group.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                    {group.id}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                    {group.name}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                    {group.institution}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                    {group.description}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                        <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => handleDelete(group.id)}
                        >
                        Delete
                        </button>
                    </td>
                    </tr>
                )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <form className='md:w-1/2 flex flex-col md:items-center mx-auto border rounded my-6 py-6'
                onSubmit={onClickCreateBtn}>
            <h2 className='text-center text-3xl font-bold mb-6'>Create New Group</h2>
            <div className="md:w-full md:flex md:items-center mb-6">
                <div className="md:w-1/3">
                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                        htmlFor="groupId">
                    Group ID
                </label>
                </div>
                <div className="md:w-1/3">
                <input
                    className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    id="groupId" type="text" placeholder="Group ID"
                    value={groupId}
                    onChange={e => {
                    setGroupId(e.target.value)
                    }}
                />
                </div>
            </div>
            <div className="md:w-full md:flex md:items-center mb-6">
                <div className="md:w-1/3">
                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                        htmlFor="groupName">
                    Group Name
                </label>
                </div>
                <div className="md:w-1/3">
                <input
                    className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    id="groupName" type="text" placeholder="Group Name"
                    value={groupName}
                    onChange={e => {
                    setGroupName(e.target.value)
                    }}
                />
                </div>
            </div>
            <div className="md:w-full md:flex md:items-center mb-6">
                <div className="md:w-1/3">
                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                        htmlFor="groupDescription">
                    Group Description
                </label>
                </div>
                <div className="md:w-1/3">
                <input
                    className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    id="lastname" type="text" placeholder="Group Description"
                    value={groupDescription}
                    onChange={e => setGroupDescription(e.target.value)}
                />
                </div>
            </div>
            {addNewInstitution ||
                <div className="md:w-full md:flex md:items-center mb-6">
                <div className="md:w-1/3">
                    <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                        htmlFor="lastname">
                    Institution
                    </label>
                </div>
                <div className="md:w-1/3 relative">
                    <select
                    className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    value={institution}
                    onChange={e => {
                        setInstitution(e.target.value)
                    }}
                    >
                    {institutionOptions.map((school, i) => {
                        return <option key={i}>{school}</option>
                    })}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                    </div>
                </div>
                </div>}
            <div className="mx-auto md:flex md:items-center mb-6">
                <label className="block text-black md:text-right mb-1 md:mb-0 pr-4"
                    htmlFor="lastname">
                Can't see your institution?
                </label>
                <input type='checkbox'
                    onChange={e => setAddNewInstitution(e.target.checked)}
                />
            </div>
            {addNewInstitution &&
                <div className="md:w-full md:flex md:items-center mb-6">
                <div className="md:w-1/3">
                    <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                        htmlFor="lastname">
                    Institution
                    </label>
                </div>
                <div className="md:w-1/3">
                    <input
                    className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    id="new-institution" type="text" placeholder="New Institution"
                    value={newInstitution}
                    onChange={e => {
                        setNewInstitution(e.target.value)
                    }}
                    />
                </div>
                </div>
            }
            <button
                className='self-center w-1/4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-5'
                type='submit'>
                Create
            </button>
            </form>

      </div>
    </div>

  )
}

export default ManageGroups
