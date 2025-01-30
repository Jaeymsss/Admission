import axios from 'axios';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Sidebar from '../../../components/Sidebar';
import { useAuth } from '../../../context/AuthContext';

const Profile = () => {
  const {userData } = useAuth();
  const [inputData, setInputData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    conPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const clearInputData = () => {
    setPasswordData({
      oldPassword: '',
      newPassword: '',
      conPassword: '',
    });
}

  const { firstName, lastName, email, phone } = inputData;
  const { oldPassword, newPassword, conPassword } = passwordData;

  const id = userData._id;

  useEffect(() => {
    fetchData();
  },[id]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`/api/getUser/${id}`);
      const data = response.data;
      setInputData(data);
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


  const handleChange  = (e) => {
    const { name, value } = e.target;
    if ((name === 'firstName' || name === 'lastName') && /[^a-zA-Z]/.test(value)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Input',
        text: 'First Name and Last Name should only contain letters.',
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        confirmButtonColor: '#22C55E',
      });
      return;
    }
    if (name === 'email') {
      if (value.length > 30) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Input',
          text: 'Email should not exceed 30 characters.',
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
          confirmButtonColor: '#22C55E',
        });
        return;
      }
      if (!/@/.test(value)) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Input',
          text: 'Email must contain an "@" symbol.',
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
          confirmButtonColor: '#22C55E',
        });
        return;
      }
    }
    if (name === 'phone') {
      if (/[^0-9]/.test(value)) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Input',
          text: 'Phone number should only contain numbers.',
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
          confirmButtonColor: '#22C55E',
        });
        return;
      }
      if (value.length > 11) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Input',
          text: 'Phone number should not exceed 11 digits.',
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
          confirmButtonColor: '#22C55E',
        });
        return;
      }
    }
    setInputData({ ...inputData, [name]: value });
  }

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`/api/editUser/${id}`, inputData).then((res) => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: `${res.data}`,
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
          confirmButtonColor: '#22C55E',
        });

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
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Password must have at least 8 characters.',
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        confirmButtonColor: '#22C55E',
      });
      clearInputData();
      return;
    }

    if (newPassword !== conPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'New password and Confirm password does not match!',
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        confirmButtonColor: '#22C55E',
      });
      clearInputData();
      return;
    }

    if (!/^[A-Z]/.test(newPassword)) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'First letter must be uppercase!',
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        confirmButtonColor: '#22C55E',
      });
      clearInputData();
      return;
    }

    try {
      await axios.put(`/api/user/password/${id}`, {
        oldPassword,
        newPassword,
      }).then((res) => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: `${res.data}`,
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
          confirmButtonColor: '#22C55E',
        });

        clearInputData();
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
      clearInputData();
    }
  };



  return (
    <div className='flex bg-[#081a04]'>
      <Sidebar/>

      <div className='bg-[#2a2d3e] mt-20 mb-10 shadow rounded-2xl w-72 2xl:w-full xl:w-[1300px] lg:w-[900px] md:w-[650px] sm:w-[500px] mx-4 p-2.5 md:p-10'>
          <div className='flex justify-between'>
            <h2 className='text-base font-bold text-white break-all md:text-lg'>Personal Information</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className='grid grid-cols-1 mt-5 md:grid-cols-2 gap-10'>
              <div className='bg-white shadow-sm rounded-2xl w-full p-5'>
                <h3 className='label-text-alt md:label-text text-gray-300'>First Name</h3>
                <input type='text' className='bg-transparent text-black w-full' placeholder='Type here' name='firstName' value={firstName} onChange={handleChange} required/>
              </div>

              <div className='bg-white shadow-sm rounded-2xl w-full p-5'>
                <h3 className='label-text-alt md:label-text text-gray-300'>Last Name</h3>
                <input type='text' className='bg-transparent text-black w-full' placeholder='Type here' name='lastName' value={lastName} onChange={handleChange} required/>
              </div>
            </div>


            <div className='grid grid-cols-1 mt-5 md:grid-cols-2 gap-10'>
              <div className='bg-white shadow-sm rounded-2xl w-full p-5'>
                <h3 className='label-text-alt md:label-text text-gray-300'>Email</h3>
                <input type='text' className='bg-transparent text-black w-full' placeholder='Type here' name='email' value={email} onChange={handleChange} required/>
              </div>

              <div className='bg-white shadow-sm rounded-2xl w-full p-5'>
                <h3 className='label-text-alt md:label-text text-gray-300'>Phone</h3>
                <input type='text' className='bg-transparent text-black w-full' placeholder='Type here' name='phone' value={phone} onChange={handleChange} required/>
              </div>
            </div>

            <button type='submit' className="bg-[#3B82F6] hover:opacity-80 flex items-center gap-2 mt-5 text-white text-xs rounded-md p-1.5">Save Changes</button>
          </form>

          <div className='flex justify-between mt-20'>
            <h2 className='text-base font-bold text-white break-all md:text-lg'>Security</h2>
          </div>

          <form onSubmit={handlePasswordSubmit} >
            <div className='grid grid-cols-1 mt-5 md:grid-cols-3 gap-10'>
              <div className='bg-white shadow-sm rounded-2xl w-full p-5'>
                <h3 className='label-text-alt md:label-text text-gray-300'>Old Password</h3>
                <input type={showPassword ? 'text' : 'password'} className='bg-transparent text-black w-full' placeholder='Type here' name='oldPassword' value={oldPassword} onChange={handlePasswordChange} required/>
              </div>

              <div className='bg-white shadow-sm rounded-2xl w-full p-5'>
                <h3 className='label-text-alt md:label-text text-gray-300'>New Password</h3>
                <input type={showPassword ? 'text' : 'password'} className='bg-transparent text-black w-full' placeholder='Type here' name='newPassword' value={newPassword} onChange={handlePasswordChange} required/>
              </div>

              <div className='bg-white shadow-sm rounded-2xl w-full p-5'>
                <h3 className='label-text-alt md:label-text text-gray-300'>Confirm Password</h3>
                <input type={showPassword ? 'text' : 'password'} className='bg-transparent text-black w-full' placeholder='Type here' name='conPassword' value={conPassword} onChange={handlePasswordChange} required/>
              </div>
            </div>

            <button type='button' onClick={toggleShowPassword} className="bg-[#3B82F6] hover:opacity-80 flex items-center gap-2 mt-5 text-white text-xs rounded-md p-1.5">
              {showPassword ? 'Hide Passwords' : 'Show Passwords'}
            </button>

            <button type='submit' className="bg-[#3B82F6] hover:opacity-80 flex items-center gap-2 mt-5 text-white text-xs rounded-md p-1.5">Change password</button>
          </form>
        
      </div>
    </div>
  )
}

export default Profile