import axios from 'axios';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Sidebar from '../../components/Sidebar';

const Settings = () => {
    const [inputData, setInputData] = useState({
        schoolTerm: '',
        schoolYear: '',
    });
    const { schoolTerm, schoolYear, announcement } = inputData;

    const [announcementData, setAnnouncementData] = useState({
        title: '',
        content: '',
    });
    const { title, content } = announcementData;

    const announceChange  = (e) => {
        if (e.target.name === 'title' && e.target.value.length > 30) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Title cannot exceed 30 characters',
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false,
                confirmButtonColor: '#22C55E',
            });
            return;
        }
        setAnnouncementData({...announcementData, [e.target.name]: e.target.value});
    }

    const handleChange  = (e) => {
        setInputData({...inputData, [e.target.name]: e.target.value});
    }

    useEffect(() => {
        fetchData();
      },[]);
    
    const fetchData = async () => {
        try {
            const response = await axios.get('/api/settings');
            const data = response.data;
            if (data) {
                setInputData(data);
            } else {
                setInputData({
                    schoolTerm: '',
                    schoolYear: '',
                    announcement: '',
                });
            }
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.get(`/api/settings`);
            const exists = response.data;

            if (!exists) {
                await axios.post(`/api/newSettings`, inputData);
            } else {
                await axios.put(`/api/settings/${exists._id}`, inputData);
            }

            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Saved successfully!',
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false,
                confirmButtonColor: '#22C55E',
            });
        } catch (e) {
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

    const announceSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post('/api/announcement', announcementData).then((result) => {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: `${result.data}`,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    allowEnterKey: false,
                    confirmButtonColor: '#22C55E',
                });

                setAnnouncementData({
                    title: '',
                    content: '',
                })
            });
        } catch (e) {
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
                <h2 className='text-base font-bold text-white break-all md:text-lg'>Settings</h2>
            </div>
            
            <form onSubmit={handleSubmit}>
                <div className='grid grid-cols-1 mt-5 md:grid-cols-2 gap-10'>
                    <div className='bg-white shadow-sm rounded-2xl w-full p-5'>
                        <h3 className='label-text-alt md:label-text text-gray-300'>School Term</h3>
                        <select className='bg-transparent text-black w-full' name='schoolTerm' value={schoolTerm} onChange={handleChange} required>
                            <option value=''>Select Term</option>
                            <option value='1st Grading Period'>1st Grading Period</option>
                            <option value='2nd Grading Period'>2nd Grading Period</option>
                            <option value='3rd Grading Period'>3rd Grading Period</option>
                            <option value='4th Grading Period'>4th Grading Period</option>
                        </select>
                    </div>

                    <div className='bg-white shadow-sm rounded-2xl w-full p-5'>
                        <h3 className='label-text-alt md:label-text text-gray-300'>School Year</h3>
                        <select className='bg-transparent text-black w-full' name='schoolYear' value={schoolYear} onChange={handleChange} required>
                            <option value=''>Select Year</option>
                            <option value={`${new Date().getFullYear()}-${new Date().getFullYear() + 1}`}>{`${new Date().getFullYear()}-${new Date().getFullYear() + 1}`}</option>
                            <option value={`${new Date().getFullYear() + 1}-${new Date().getFullYear() + 2}`}>{`${new Date().getFullYear() + 1}-${new Date().getFullYear() + 2}`}</option>
                        </select>
                    </div>
                </div>

                <button type='submit' className="bg-[#3B82F6] hover:opacity-80 flex items-center gap-2 mt-5 text-white text-xs rounded-md p-1.5">Save Changes</button>
            </form>

            <form onSubmit={announceSubmit}>
                <div className='grid grid-cols-1 mt-32 md:grid-cols-2 gap-10'>
                    <div className='bg-white shadow-sm rounded-2xl w-full p-5'>
                        <h3 className='label-text-alt md:label-text text-gray-300'>Announcement</h3>
                        <input type='text' className='w-1/3 mb-3 p-2.5 pr-4 text-sm text-black bg-transparent rounded-md border-2 border-solid border-gray-200 outline-none' placeholder='Title' name='title' value={title} onChange={announceChange} maxLength="30" required/>
                        <textarea placeholder="Make an Announcement!" className="textarea textarea-bordered w-full h-36 bg-transparent text-black" name='content' value={content} onChange={announceChange} maxLength="100" required></textarea>

                        <button type='submit' className="bg-[#3B82F6] hover:opacity-80 flex items-center gap-2 mt-2 text-white text-xs rounded-md p-1.5">Submit</button>
                    </div>
                </div>
                
            </form>
        </div>
    </div>
  )
}

export default Settings