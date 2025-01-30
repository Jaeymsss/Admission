import axios from 'axios';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { HiOutlineDocumentText, HiOutlinePencilSquare } from "react-icons/hi2";
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import Sidebar from '../../../components/Sidebar';

const View = () => {
  const { id } = useParams();
  const [studentData, setStudentData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputData, setInputData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    extensionName: '',
    age: '',
    sex: '',
    civilStatus: '',
    religion: '',
    dob: '',
    placeOfBirth: '',
    address: '',
    citizenship: '',
    zipCode:'',
    lrn: '',
    email: '',
    phone: '',
    parentName: '',
    occupation: '',
    parentPhone: '',
    school: '',
    schoolAddress: '',
    course: ''
  });

  useEffect(() => {
    fetchData();
    
    const interval = setInterval(fetchData,5000);
    return () => clearInterval(interval);
  },[]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`/api/student/${id}`);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
    if (name === 'firstName' || name === 'middleName' || name === 'lastName') {
      if (/^[A-Za-z]*$/.test(value) && value.length <= 50) {
        setInputData({ ...inputData, [name]: capitalizedValue });
      }
    } else if (name === 'address') {
      if (value.length <= 50) {
        setInputData({ ...inputData, [name]: value });
      }
    } else if (name === 'age') {
      if (/^\d*$/.test(value) && parseInt(value, 10) >= 0) {
        setInputData({ ...inputData, [name]: value });
      }
    } else {
      setInputData({ ...inputData, [name]: value });
    }
  }

  const handleEdit = async (id) => {
    setInputData({...studentData});
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`/api/student/edit/${id}`, inputData).then((res) => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: `${res.data}`,
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
          confirmButtonColor: '#22C55E',
        });

        setIsModalOpen(false);
        fetchData();
      });
    } catch(e) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `${e.response.data}`,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        confirmButtonColor: '#22C55E',
      });
    }
  };

  
  const handleViewPDF = async (filename) => {
    try {
      const response = await axios.get(`/api/viewPdf/${filename}`, {
        responseType: 'blob'
      });
      const pdfUrl = URL.createObjectURL(response.data);
  
      window.open(pdfUrl,'_blank');
    } catch (e) {
      console.error('Error fetching PDF:', e);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `${e.response.data}`,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        confirmButtonColor: '#22C55E',
      });
    }
  };

  const handleGeneratedPDF = async () => {
    try {
      const response = await axios.post('/api/viewGeneratedPDF', studentData, {
        responseType: 'blob'
      });
      const pdfUrl = URL.createObjectURL(response.data);
      window.open(pdfUrl, '_blank');
    } catch (e) {
      console.error('Error generating PDF:', e);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `${e.response.data}`,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        confirmButtonColor: '#22C55E',
      });
    }
  }

  return (
    <div className='flex bg-[#081a04]'>
      <Sidebar/>

      <div className='bg-[#2a2d3e] mt-20 mb-10 shadow rounded-2xl w-72 2xl:w-full xl:w-[1300px] lg:w-[900px] md:w-[650px] sm:w-[500px] mx-4 p-2.5 md:p-10'>
          <div className='flex justify-between'>
            <h2 className='text-base font-bold text-white break-all md:text-lg'>General Information</h2>
            <div className='flex gap-5'>
              <button className='bg-[#3B82F6] hover:bg-blue-400 flex items-center text-white text-xs rounded-md p-1.5 gap-1' onClick={handleGeneratedPDF}><HiOutlineDocumentText size={20} /> Generate</button>
              <button className='bg-[#3B82F6] hover:bg-blue-400 flex items-center text-white text-xs rounded-md p-1.5 gap-1' onClick={() => handleEdit(studentData._id)}><HiOutlinePencilSquare size={20} /> Edit</button>
            </div>
          </div>

          <div className='grid grid-cols-1 mt-5 md:grid-cols-2 gap-10'>
            <div className='bg-white shadow-sm rounded-2xl w-full p-5'>
              <h3 className='label-text-alt md:label-text text-gray-300'>Full Name</h3>
              <p className='text-xs md:text-base font-medium text-black'>{studentData.firstName} {studentData.middleName} {studentData.lastName} {studentData.extensionName}</p>
            </div>

            <div className='bg-white shadow-sm rounded-2xl p-5 w-full'>
              <h3 className='label-text-alt md:label-text text-gray-300'>Complete Address</h3>
              <p className='text-xs md:text-base font-medium text-black'>{studentData.address}</p>
            </div>
          </div>


          <div className='grid grid-cols-1 mt-5 md:grid-cols-4 gap-10'>
            <div className='bg-white shadow-sm rounded-2xl w-full p-5'>
              <h3 className='label-text-alt md:label-text text-gray-300'>Age</h3>
              <p className='text-xs md:text-base font-medium text-black'>{studentData.age}</p>
            </div>

            <div className='bg-white shadow-sm rounded-2xl p-5 w-full'>
              <h3 className='label-text-alt md:label-text text-gray-300'>Sex</h3>
              <p className='text-xs md:text-base font-medium text-black'>{studentData.sex}</p>
            </div>

            <div className='bg-white shadow-sm rounded-2xl p-5 w-full'>
              <h3 className='label-text-alt md:label-text text-gray-300'>Civil Status</h3>
              <p className='text-xs md:text-base font-medium text-black'>{studentData.civilStatus}</p>
            </div>

            <div className='bg-white shadow-sm rounded-2xl p-5 w-full'>
              <h3 className='label-text-alt md:label-text text-gray-300'>Religion</h3>
              <p className='text-xs md:text-base font-medium text-black'>{studentData.religion}</p>
            </div>
          </div>


          <div className='grid grid-cols-1 mt-5 md:grid-cols-4 gap-10'>
            <div className='bg-white shadow-sm rounded-2xl w-full p-5'>
              <h3 className='label-text-alt md:label-text text-gray-300'>Date of Birth</h3>
              <p className='text-xs md:text-base font-medium text-black'>{studentData.dob}</p>
            </div>

            <div className='bg-white shadow-sm rounded-2xl p-5 w-full'>
              <h3 className='label-text-alt md:label-text text-gray-300'>Place of Birth</h3>
              <p className='text-xs md:text-base font-medium text-black'>{studentData.placeOfBirth}</p>
            </div>

            <div className='bg-white shadow-sm rounded-2xl p-5 w-full'>
              <h3 className='label-text-alt md:label-text text-gray-300'>Citizenship</h3>
              <p className='text-xs md:text-base font-medium text-black'>{studentData.citizenship}</p>
            </div>

            <div className='bg-white shadow-sm rounded-2xl p-5 w-full'>
              <h3 className='label-text-alt md:label-text text-gray-300'>ZipCode</h3>
              <p className='text-xs md:text-base font-medium text-black'>{studentData.zipCode}</p>
            </div>
          </div>


          <div className='grid grid-cols-1 mt-5 md:grid-cols-3 gap-10'>
            <div className='bg-white shadow-sm rounded-2xl w-full p-5'>
              <h3 className='label-text-alt md:label-text text-gray-300'>LRN</h3>
              <p className='text-xs md:text-base font-medium text-black'>{studentData.lrn}</p>
            </div>

            <div className='bg-white shadow-sm rounded-2xl w-full p-5'>
              <h3 className='label-text-alt md:label-text text-gray-300'>Email Address</h3>
              <p className='text-xs md:text-base font-medium text-black'>{studentData.email}</p>
            </div>

            <div className='bg-white shadow-sm rounded-2xl w-full p-5'>
              <h3 className='label-text-alt md:label-text text-gray-300'>Phone Number</h3>
              <p className='text-xs md:text-base font-medium text-black'>+63 {studentData.phone}</p>
            </div>
          </div>


          <div className='grid grid-cols-1 mt-5 md:grid-cols-3 gap-10'>
            <div className='bg-white shadow-sm rounded-2xl w-full p-5'>
              <h3 className='label-text-alt md:label-text text-gray-300'>Parent Name</h3>
              <p className='text-xs md:text-base font-medium text-black'>{studentData.parentName}</p>
            </div>

            <div className='bg-white shadow-sm rounded-2xl w-full p-5'>
              <h3 className='label-text-alt md:label-text text-gray-300'>Occupation</h3>
              <p className='text-xs md:text-base font-medium text-black'>{studentData.occupation}</p>
            </div>

            <div className='bg-white shadow-sm rounded-2xl w-full p-5'>
              <h3 className='label-text-alt md:label-text text-gray-300'>Parent Contact</h3>
              <p className='text-xs md:text-base font-medium text-black'>+63 {studentData.parentPhone}</p>
            </div>
          </div>


          <div className='grid grid-cols-1 mt-5 md:grid-cols-2 gap-10'>
            <div className='bg-white shadow-sm rounded-2xl w-full p-5'>
              <h3 className='label-text-alt md:label-text text-gray-300'>School</h3>
              <p className='text-xs md:text-base font-medium text-black'>{studentData.school}</p>
            </div>

            <div className='bg-white shadow-sm rounded-2xl w-full p-5'>
              <h3 className='label-text-alt md:label-text text-gray-300'>School Address</h3>
              <p className='text-xs md:text-base font-medium text-black'>{studentData.schoolAddress}</p>
            </div>
          </div>

          <div className='grid grid-cols-1 mt-5 md:grid-cols-3 gap-5'>
            <div className='bg-white shadow-sm rounded-2xl w-full p-5 mr-10'>
              <h3 className='label-text-alt md:label-text text-gray-300'>Course</h3>
              <p className='text-xs md:text-base font-medium text-black'>{studentData.course}</p>
            </div>

            <div className='bg-white shadow-sm rounded-2xl w-full p-5 mr-10'>
              <h3 className='label-text-alt md:label-text text-gray-300'>Status</h3>
              <p className='text-xs md:text-base font-medium text-black'>{studentData.studentStatus}</p>
            </div>

            <div className='bg-white shadow-sm rounded-2xl w-full p-5'>
              <h3 className='label-text-alt md:label-text text-gray-300'>Created At</h3>
              <p className='text-xs md:text-base font-medium text-black'>{studentData.createdAt ? format(new Date(studentData.createdAt),'MMM dd, yyyy | hh:mm a') : 'N/A'}</p>
            </div>
          </div>

          <div className='flex items-center gap-3 mt-3'>
          {studentData.files && studentData.files.map((pdf, i) => (
            <button key={i} className="bg-[#3B82F6] hover:bg-blue-400 flex items-center gap-2 mt-5 text-white text-xs rounded-md p-1.5" onClick={() => handleViewPDF(pdf)}><HiOutlineDocumentText size={20}/> View PDF {i + 1}</button>
          ))}
          </div>
        
      </div>


      <dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="modal">
        <div className='fixed inset-0 bg-black opacity-35'></div>
        <div className="modal-box flex items-center justify-center flex-col w-full lg:max-w-[900px] md:max-w-[700px]">
          <h3 className="font-bold text-lg mt-2 text-white">Edit Information</h3>
          <div className="modal-action relative">
            <form onSubmit={handleSubmit} className="p-4" method="dialog">

              <div className='grid grid-cols-2 md:grid-cols-4 gap-2'>
                <div className='mb-4 w-full'>
                  <label className='label-text-alt md:label-text text-black-700 font-bold select-none'>First Name</label>
                  <input type="text" placeholder='First Name' name='firstName' value={inputData.firstName} onChange={handleChange} className='w-full py-2 px-3 text-sm text-white bg-transparent rounded-md border-2 border-solid border-gray-200 outline-none' />
                </div>

                <div className='mb-4 w-full'>
                  <label className='label-text-alt md:label-text text-black-700 font-bold select-none'>Middle Name</label>
                  <input type="text" placeholder='Middle Name' name='middleName' value={inputData.middleName} onChange={handleChange} className='w-full py-2 px-3 text-sm text-white bg-transparent rounded-md border-2 border-solid border-gray-200 outline-none' />
                </div>

                <div className='mb-4 w-full'>
                  <label className='label-text-alt md:label-text text-black-700 font-bold select-none'>Last Name</label>
                  <input type="text" placeholder='Last Name' name='lastName' value={inputData.lastName} onChange={handleChange} className='w-full py-2 px-3 text-sm text-white bg-transparent rounded-md border-2 border-solid border-gray-200 outline-none' />
                </div>

                <div className='mb-4 w-full'>
                  <label className='label-text-alt md:label-text text-black-700 font-bold select-none'>Suffix</label>
                  <input type="text" placeholder='Suffix' name='extensionName' value={inputData.extensionName} onChange={handleChange} className='w-full py-2 px-3 text-sm text-white bg-transparent rounded-md border-2 border-solid border-gray-200 outline-none' />
                </div>
              </div>


              <div className='grid grid-cols-2 md:grid-cols-4 gap-2'>
                <div className='mb-4 w-full'>
                  <label className='label-text-alt md:label-text text-black-700 font-bold select-none'>Address</label>
                  <input type="text" placeholder='Complete Address' name='address' value={inputData.address} onChange={handleChange} className='w-full py-2 px-3 text-sm text-white bg-transparent rounded-md border-2 border-solid border-gray-200 outline-none' />
                </div>

                <div className='mb-4 w-full'>
                  <label className='label-text-alt md:label-text text-black-700 font-bold select-none'>Age</label>
                  <input type="text" placeholder='Age' name='age' value={inputData.age} onChange={handleChange} className='w-full py-2 px-3 text-sm text-white bg-transparent rounded-md border-2 border-solid border-gray-200 outline-none' />
                </div>

                <div className='mb-4 w-full'>
                  <label className='label-text-alt md:label-text text-black-700 font-bold select-none'>Sex</label>
                  <select name="sex" onChange={handleChange} className='w-full py-2 px-3 text-sm text-black bg-white rounded-md border-2 border-solid border-gray-200 outline-none' required>
                    <option value={inputData.sex} selected disabled>{inputData.sex}</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div className='mb-4 w-full'>
                  <label className='label-text-alt md:label-text text-black-700 font-bold select-none'>Civil Status</label>
                  <select name="civilStatus" onChange={handleChange} className='w-full py-2 px-3 text-sm text-black bg-white rounded-md border-2 border-solid border-gray-200 outline-none' required>
                    <option value={inputData.civilStatus} disabled selected>{inputData.civilStatus}</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Widowed">Widowed</option>
                    <option value="Separated">Separated</option>
                  </select>
                </div>
              </div>


              <div className='grid grid-cols-2 md:grid-cols-4 gap-2'>
                <div className='mb-4 w-full'>
                  <label className='label-text-alt md:label-text text-black-700 font-bold select-none'>Religion</label>
                  <input type="text" placeholder='Religion' name='religion' value={inputData.religion} onChange={handleChange} className='w-full py-2 px-3 text-sm text-white bg-transparent rounded-md border-2 border-solid border-gray-200 outline-none' />
                </div>

                <div className='mb-4 w-full'>
                  <label className='label-text-alt md:label-text text-black-700 font-bold select-none'>Birthday</label>
                  <input type="text" placeholder='Date of Birth' name='dob' value={inputData.dob} onChange={handleChange} className='w-full py-2 px-3 text-sm text-white bg-transparent rounded-md border-2 border-solid border-gray-200 outline-none' />
                </div>

                <div className='mb-4 w-full'>
                  <label className='label-text-alt md:label-text text-black-700 font-bold select-none'>Place of Birth</label>
                  <input type="text" placeholder='Place of Birth' name='placeOfBirth' value={inputData.placeOfBirth} onChange={handleChange} className='w-full py-2 px-3 text-sm text-white bg-transparent rounded-md border-2 border-solid border-gray-200 outline-none' />
                </div>

                <div className='mb-4 w-full'>
                  <label className='label-text-alt md:label-text text-black-700 font-bold select-none'>Citizenship</label>
                  <input type="text" placeholder='Citizenship' name='citizenship' value={inputData.citizenship} onChange={handleChange} className='w-full py-2 px-3 text-sm text-white bg-transparent rounded-md border-2 border-solid border-gray-200 outline-none' />
                </div>
              </div>


              <div className='grid grid-cols-1 md:grid-cols-4 gap-2'>
                <div className='mb-4 w-full'>
                  <label className='label-text-alt md:label-text text-black-700 font-bold select-none'>LRN</label>
                  <input type="text" placeholder='LRN' name='lrn' value={inputData.lrn} onChange={handleChange} className='w-full py-2 px-3 text-sm text-white bg-transparent rounded-md border-2 border-solid border-gray-200 outline-none' />
                </div>

                <div className='mb-4 w-full'>
                  <label className='label-text-alt md:label-text text-black-700 font-bold select-none'>Email Address</label>
                  <input type="email" placeholder='Email Address' name='email' value={inputData.email} onChange={handleChange} className='w-full py-2 px-3 text-sm text-white bg-transparent rounded-md border-2 border-solid border-gray-200 outline-none' />
                </div>

                <div className='mb-4 w-full'>
                  <label className='label-text-alt md:label-text text-black-700 font-bold select-none'>Phone Number</label>
                  <input type="number" placeholder='+63' name='phone' value={inputData.phone} onChange={handleChange} className='w-full py-2 px-3 text-sm text-white bg-transparent rounded-md border-2 border-solid border-gray-200 outline-none' maxLength={10} />
                </div>

                <div className='mb-4 w-full'>
                  <label className='label-text-alt md:label-text text-black-700 font-bold select-none'>ZipCode</label>
                  <input type="text" placeholder='zip code' name='zipCode' value={inputData.zipCode} onChange={handleChange} className='w-full py-2 px-3 text-sm text-white bg-transparent rounded-md border-2 border-solid border-gray-200 outline-none' />
                </div>
              </div>


              <div className='grid grid-cols-1 md:grid-cols-3 gap-2'>
                <div className='mb-4 w-full'>
                  <label className='label-text-alt md:label-text text-black-700 font-bold select-none'>Parent Name</label>
                  <input type="text" placeholder='Parent Name' name='parentName' value={inputData.parentName} onChange={handleChange} className='w-full py-2 px-3 text-sm text-white bg-transparent rounded-md border-2 border-solid border-gray-200 outline-none' />
                </div>

                <div className='mb-4 w-full'>
                  <label className='label-text-alt md:label-text text-black-700 font-bold select-none'>Occupation</label>
                  <input type="text" placeholder='Occupation' name='occupation' value={inputData.occupation} onChange={handleChange} className='w-full py-2 px-3 text-sm text-white bg-transparent rounded-md border-2 border-solid border-gray-200 outline-none' />
                </div>

                <div className='mb-4 w-full'>
                  <label className='label-text-alt md:label-text text-black-700 font-bold select-none'>Parent Contact</label>
                  <input type="number" placeholder='+63' name='parentPhone' value={inputData.parentPhone} onChange={handleChange} className='w-full py-2 px-3 text-sm text-white bg-transparent rounded-md border-2 border-solid border-gray-200 outline-none' maxLength={10} />
                </div>
              </div>


              <div className='grid grid-cols-1 md:grid-cols-3 gap-2'>
                <div className='mb-4 w-full'>
                  <label className='label-text-alt md:label-text text-black-700 font-bold select-none'>School Name</label>
                  <input type="text" placeholder='School Name' name='school' value={inputData.school} onChange={handleChange} className='w-full py-2 px-3 text-sm text-white bg-transparent rounded-md border-2 border-solid border-gray-200 outline-none' />
                </div>

                <div className='mb-4 w-full'>
                  <label className='label-text-alt md:label-text text-black-700 font-bold select-none'>School Address</label>
                  <input type="text" placeholder='School Address' name='schoolAddress' value={inputData.schoolAddress} onChange={handleChange} className='w-full py-2 px-3 text-sm text-white bg-transparent rounded-md border-2 border-solid border-gray-200 outline-none' />
                </div>

                <div className='mb-4 w-full'>
                  <label className='label-text-alt md:label-text text-black-700 font-bold select-none'>Course</label>
                  <input type="text" placeholder='Course' name='course' value={inputData.course} onChange={handleChange} className='w-full py-2 px-3 text-sm text-white bg-transparent rounded-md border-2 border-solid border-gray-200 outline-none' />
                </div>
              </div>

            
              <div className='flex justify-end mt-4'>
                <button type='submit' className='bg-green-500 hover:bg-green-400 flex items-center text-white text-xs rounded-md p-1.5 px-3 gap-1'>Save</button>
              </div>
        
            </form>

            <div className='absolute bottom-4 left-2'>
              <button className='bg-[#DE7773] hover:opacity-80 flex items-center text-white text-xs rounded-md p-1.5 gap-1 mr-4' onClick={() => setIsModalOpen(false)}>Cancel</button>
            </div>
          </div>
          
        </div>
      </dialog>
    </div>
  )
}

export default View