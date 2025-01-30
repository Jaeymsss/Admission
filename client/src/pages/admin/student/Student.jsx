import axios from 'axios';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { HiOutlineClipboardDocumentList, HiOutlineTrash } from "react-icons/hi2";
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import Sidebar from '../../../components/Sidebar';

const Student = () => {
  const [studentData, setStudentData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchData();
    
    const interval = setInterval(fetchData,5000);
    return () => clearInterval(interval);
  },[]);

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/students');
      const data = response.data;
      setStudentData(data);
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

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: "You will not be able to recover it",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#22C55E',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
    });

    if(confirm.isConfirmed) {
      try {
        const response = await axios.delete(`/api/students/${id}`);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: response.data,
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
          confirmButtonColor: '#22C55E',
        });
        fetchData();
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
    } 
  };

  const filteredStudents = studentData.filter(student => {
    if (filter === 'all') return true;
    return student.studentStatus.toLowerCase() === filter;
  });

  return (
    <div className='flex bg-[#081a04]'>
      <Sidebar/>

        <div className="bg-white mt-20 mb-20 shadow rounded-2xl w-72 2xl:w-full xl:w-[1300px] lg:w-[900px] md:w-[650px] sm:w-[500px] mx-5">

          <div className='bg-[#22C55E] py-2 flex justify-end'>
            <button onClick={() => setFilter('all')} className="bg-white text-black rounded-md p-2 text-xs md:text-sm focus:outline-none focus:border-[#DE7773] mx-2 my-4">All</button>
            <button onClick={() => setFilter('freshmen')} className="bg-white text-black rounded-md p-2 text-xs md:text-sm focus:outline-none focus:border-[#DE7773] mx-2 my-4">Freshmen</button>
            <button onClick={() => setFilter('transferee')} className="bg-white text-black rounded-md p-2 text-xs md:text-sm focus:outline-none focus:border-[#DE7773] mx-2 my-4">Transferees</button>
          </div>

          <div className="overflow-x-auto">
            <table className="table-auto table sm:table divide-y text-sm text-left text-black">
              <thead className='bg-[#f6f9ff]'>
                <tr className='text-gray-600 font-bold'>
                  <th scope="col">#</th>
                  <th scope="col">Full Name</th>
                  <th scope="col" className="hidden lg:table-cell">Address</th>
                  <th scope="col" className="hidden md:table-cell">Email Address</th>
                  <th scope="col" className="hidden lg:table-cell">Phone</th>
                  <th scope="col" className="hidden md:table-cell">Status</th>
                  <th scope="col" className="hidden lg:table-cell">Created At</th>
                  <th scope="col" className="px-2 sm:px-5">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, i) => (
                  <tr key={i}>
                    <th>{i + 1}</th>
                    <td>{student.lastName + ", " + student.firstName + " " + student.middleName + " " + student.extensionName}</td>
                    <td className='hidden lg:table-cell'>{student.address}</td>
                    <td className='hidden md:table-cell'>{student.email}</td>
                    <td className='hidden lg:table-cell'>{student.phone}</td>
                    <td className='hidden md:table-cell'>{student.studentStatus}</td>
                    <td className='hidden lg:table-cell'>{format(new Date(student.createdAt), 'MMM dd, yyyy | HH:mm')}</td>
                    <td className='flex gap-3.5 px-2 sm:px-5 py-2 whitespace-nowrap text-sm text-gray-500'>
                      <Link to={`/student/${student._id}`}><button className='bg-[#3B82F6] hover:bg-blue-400 flex items-center text-white text-xs rounded-md p-1.5 gap-1'><HiOutlineClipboardDocumentList size={20} /> View</button></Link>
                      <button className='bg-[#3B82F6] hover:bg-blue-400 flex items-center text-white text-xs rounded-md p-1.5 gap-1' onClick={() => handleDelete(student._id)}><HiOutlineTrash size={20} /> Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>


    </div>

  )
}

export default Student