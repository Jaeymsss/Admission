import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import Sidebar from '../../../components/Sidebar';

const ViewSched = () => {
    const { id } = useParams();
    const [scheduleData, setScheduleData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchData();
    
      },[]);
    
      const fetchData = async () => {
        try {
          const response = await axios.get(`/api/schedule/view/${id}`);
          const data = response.data;
          setScheduleData(data);
        } catch(e) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `${e.response.data}`,
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            confirmButtonColor: '#22C55E',
          });
        }
      };

      const filteredStudents = scheduleData.filter(student =>
        student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.middleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.extensionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentStatus.toLowerCase().includes(searchTerm.toLowerCase())
      );
  return (
    <div className='flex bg-[#212332]'>
      <Sidebar/>

        <div className='bg-white mt-20 mb-20 shadow rounded-2xl w-72 2xl:w-full xl:w-[1300px] lg:w-[900px] md:w-[650px] sm:w-[500px] mx-5'>

          <div className='bg-[#22C55E] py-2'>
            <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="border border-gray-300 bg-white text-black rounded-md p-2 w-52 md:w-64 text-xs md:text-sm focus:outline-none focus:border-[#FEFEFE] mx-2 my-4" />
          </div>

          <div className="overflow-x-auto">
            <table className="table-auto table sm:table divide-y text-sm text-left text-black">
              <thead className='bg-[#f6f9ff]'>
                <tr>
                  <th scope='col'>#</th>
                  <th scope="col">Full Name</th> 
                  <th scope="col" className="hidden lg:table-cell">Email</th> 
                  <th scope="col" className="hidden lg:table-cell">Phone</th>
                  <th scope="col" className="hidden md:table-cell">Status</th>  
                </tr>
              </thead> 
              <tbody>
                {filteredStudents.map((student, index) => (
                  <tr key={index}>
                    <th>{index + 1}</th>
                    <td>{student.firstName} {student.middleName} {student.lastName} {student.extensionName}</td>
                    <td className="hidden lg:table-cell">{student.email}</td>
                    <td className="hidden lg:table-cell">{student.phone}</td>
                    <td className="hidden md:table-cell">{student.studentStatus}</td>
                  </tr>
                    ))}
              </tbody> 
            </table>
          </div>

      </div>

    </div>
  )
}

export default ViewSched