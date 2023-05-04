import React, {useContext, useState, useEffect, useRef} from 'react'
import {GlobalContext} from "./App";
import axios from "axios";
//import Select from "react-select";
const ManageUsers = () => {  
  const {userState} = useContext(GlobalContext)
  const [data, setData] = useState([]);
  const [flag, setFlag] = useState(1);
  const [groups, setGroups] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [userId, setUserId] = useState(null);
  const [groupId, setGroupId] = useState(null);
  // const [skills, setSkills] = useState([]);

  // const handleChange = (skills) => {
  //   setSkills(skills || []);
  // };

  useEffect(() => {
    console.log("useEffect")
    const init = async () => {
      try {
        const response = await axios.post(
          process.env.REACT_APP_C3_URL+'/api/1/'+process.env.REACT_APP_C3_TENANT+'/'+process.env.REACT_APP_C3_TAG+'/Author', 
          {spec: {include: 'this,id,firstName,lastName,institution,grdbGroups.this',filter:"isUser==true"}}, //"intersects(groups,['Grdb.Group.Basic'])"
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
        console.log(response.data.objs)
        if (response.status === 200) {
          setData(response.data.objs)
        }

        const response1 = await axios.post(
            process.env.REACT_APP_C3_URL+'/api/1/'+process.env.REACT_APP_C3_TENANT+'/'+process.env.REACT_APP_C3_TAG+'/AdminGroup', 
            {spec: {include: 'id',filter:"startsWith(id, 'Grdb.Group.')"}}, 
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
          console.log(response1.data.objs)
          const groupIds = response1.data.objs.map(group => ({'value':group.id,'label':group.id}));
          //const groupIds = response1.data.objs.map(group => ({ id: group.id, name:"name",description:"sample" }));
          if (response1.status === 200) {
            setGroups(groupIds)
            console.log("hereeeeee")
            console.log(groupIds)
          }
              
      } catch (e) {
        console.log(e)
      }
    }
    init()
  }, [flag])



  const handleSave = async () => {
    if(userId==null || groupId==null)
    {
      alert("User or group data is null")
      return;
    }
    if (window.confirm("Are you sure you want to add user "+userId+" to group "+groupId+"?")) {
      try {
        const response = await axios.post(
          process.env.REACT_APP_C3_URL + "/api/1/" + process.env.REACT_APP_C3_TENANT + "/" + process.env.REACT_APP_C3_TAG + "/GrdbGroup",
          {"this":{"id":groupId},"author":{"id":userId}},
          {
            params: {
              'action': "addMember"
            },
            headers: {
              "authorization": "Bearer " + window.localStorage.getItem("token"),
              "accept": "application/json",
              "content-type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          alert("User membership modified successfully.");
          setUserId(null);
          setGroupId(null);
          setShowModal(false);
          setFlag((prevdata)=>prevdata+1);
        } else {
          alert("Error modifying user membership. Try again.");
        }
      } catch (err) {
        console.log(err.message);
      }
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await axios.post(
          process.env.REACT_APP_C3_URL + "/api/1/" + process.env.REACT_APP_C3_TENANT + "/" + process.env.REACT_APP_C3_TAG + "/User",
          '',
          {
            params: {
              'action': "remove",
               'id': userId,
            },
            headers: {
              "authorization": "Bearer " + window.localStorage.getItem("token"),
              "accept": "application/json",
              "content-type": "application/xml",
            },
          }
        );
        if(response.data){
        // need to update isUser false in author database
        const response1 = await axios.post(
          process.env.REACT_APP_C3_URL + "/api/1/" + process.env.REACT_APP_C3_TENANT + "/" + process.env.REACT_APP_C3_TAG + "/Author",
          {"this":{"id":userId,"user":{"id":""}}},
          {
            params: {
              'action': "merge"
            },
            headers: {
              "authorization": "Bearer " + window.localStorage.getItem("token"),
              "accept": "application/json",
              "content-type": "application/json",
            },
          }
        );
        if (response1.status === 200) {
          //setData((prevData) => prevData.filter((author) => author.id !== userId));
          setFlag((prevdata)=>prevdata+1);
          alert("User deleted successfully");
        } else {
          alert("Error unlinking user");
        }
      }
      else{
        alert("Error deleting user");
      }
      } catch (err) {
        console.log(err.message);
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
                    User ID
                </th>
                <th scope="col"
                    className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
                    First Name
                </th>
                <th scope="col"
                    className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
                    Last Name
                </th>
                <th scope="col"
                    className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
                    Institution
                </th>
                <th scope="col"
                    className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
                    Grdb Groups
                </th>
                <th scope="col"
                    className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
                    Edit membership
                </th>
                {/* <th scope="col"
                    className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
                    Modify
                </th> */}
                <th scope="col"
                    className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
                    Delete
                </th>
              </tr>
              </thead>
              <tbody>
              {data.map(author => {
                return (
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                    {author.id}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                    {author.firstName}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                    {author.lastName}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                    {author.institution}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                    {author.grdbGroups?author.grdbGroups.map((group) => <div key={group.id}>{group.id}</div>):""}
                   </td>
                    <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                    <button
                  className='w-9 h-9 self-center text-center bg-gray-400 hover:bg-blue-700 text-white text-3xl font-bold rounded focus:outline-none focus:shadow-outline'
                  type='button' id='property-btn'  onClick={() => {setShowModal(true);setUserId(author.id);}}
                    > + </button>
                    </td>

                    <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                    <button
                        className="bg-black hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => handleDelete(author.id)}
                        >
                        Delete
                      </button>
                    </td>
                    </tr>
                )
                })}
              </tbody>
            </table>

      <br/>
      <br/>
      {showModal &&
      <div className="flex center w-full md:w-full px-3 mb-6 md:mb-0">
        <label className="block uppercase tracking-wide text-gray-700 text-l font-bold mb-2"
               htmlFor="characterization-option">
          Select Group
        </label>
        <div className="relative">
          <select
            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="characterization-option"
            onChange={e => setGroupId(e.target.value)}
          >
            {groups.map((group) => (
                <option key={group.value} value={group.value}>{group.value}</option>
              ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
        
          <button
              className="bg-black hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
              onClick={() => {setShowModal(false);setUserId(null);}}
              >
              Cancel
          </button>

          <button
              className="bg-black hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2"
              onClick={handleSave}
              >
              Save
          </button>
        
      </div>
      
      }
    
        
          </div>
          {/* <Select
        options={groups}
        onChange={handleChange}
        value={skills}
        isMulti
          /> */}
        </div>
      </div>
    </div>

    

  )
}

export default ManageUsers