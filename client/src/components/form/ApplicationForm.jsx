import axios from 'axios';
import { format } from 'date-fns';
import { useEffect, useRef, useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import { FiArrowLeft, FiSend } from "react-icons/fi";
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Header from '../Header';
import Footer from '../Footer';

const ApplicationForm = () => {
    const form = useRef();
    const clearInputFile = useRef(null);
    const clearInputFile2 = useRef(null);
    const clearInputFile3 = useRef(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [schedules, setSchedules] = useState([]);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [selectedButton, setSelectedButton] = useState(null);
    const navigate = useNavigate();
    const [agree, setAgree] = useState(false);

    useEffect(() => {
        fetchSchedules();
    }, []);

    const fetchSchedules = async () => {
        try {
            const response = await axios.get('/api/application/schedule');
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);

            const availableSchedule = response.data.filter(schedule => {
                const scheduleDate = new Date(schedule.date);
                scheduleDate.setHours(0, 0, 0, 0);
                return scheduleDate >= currentDate && schedule.maxStudent > schedule.studentId.length;
            });
            
            availableSchedule.sort((a, b) => new Date(a.date) - new Date(b.date));
            setSchedules(availableSchedule);
        } catch (e) {
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

    const handleScheduleSelect = (schedule, e) => {
        e.preventDefault();
        setSelectedSchedule(schedule);
        setSelectedButton(schedule._id);
    };


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

    const [inputFile, setInputFile] = useState({
        fileOne: null,
        fileTwo: null,
        fileThree: null
    });

    const { firstName, middleName, lastName, extensionName, age, sex, civilStatus, religion, dob, placeOfBirth, address, citizenship, zipCode, lrn, email, phone, parentName, occupation, parentPhone, school, schoolAddress, course } = inputData;

    const { fileOne, fileTwo, fileThree } = inputFile;

    const clearInputData = () => {
        setInputData({
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
    }

    const capitalizeFirstLetter = (string) => {
        return string.replace(/\b\w/g, char => char.toUpperCase());
    };

    const getMaxDate = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today.toISOString().split('T')[0];
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const capitalizedValue = capitalizeFirstLetter(value);
        if (/^\s/.test(value)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Input',
                text: 'Input cannot start with a space.',
                confirmButtonColor: '#22C55E',
            });
            setInputData({ ...inputData, [name]: '' });
        } else if ((name === 'lastName' || name === 'firstName' || name === 'middleName' || name === 'parentName' || name === 'extensionName') && /[^a-zA-Z\s]/.test(value)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Input',
                text: 'Please enter only letters.',
                confirmButtonColor: '#22C55E',
            });
            setInputData({ ...inputData, [name]: '' });
        } else if (name === 'age' && (value <= 0 || isNaN(value))) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Age',
                text: 'Age must be a positive number.',
                confirmButtonColor: '#22C55E',
            });
            setInputData({ ...inputData, [name]: '' });
        } else if (name === 'email' && /^\s/.test(value)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Email',
                text: 'Email cannot start with a space.',
                confirmButtonColor: '#22C55E',
            });
            setInputData({ ...inputData, [name]: '' });
        } else if (name === 'email') {
            setInputData({ ...inputData, [name]: value });
        } else if (name === 'lrn' && (/[^0-9]/.test(value) || value.length > 13)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid LRN',
                text: 'LRN should be a numeric value and exactly 13 digits.',
                confirmButtonColor: '#22C55E',
            });
            setInputData({ ...inputData, [name]: '' });
        } else {
            setInputData({ ...inputData, [name]: capitalizedValue });
        }
        if (name === 'zipCode' && isNaN(value)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Zip Code',
                text: 'Please enter a valid numeric zip code.',
                confirmButtonColor: '#22C55E',
            });
        }
    }

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        const allowedSize = 2 * 1024 * 1024;

        if (selectedFile.type !== "application/pdf") {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please upload PDF files only.',
                confirmButtonColor: '#22C55E',
            });
            e.target.value = null;
        } else if (selectedFile.size > allowedSize) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please upload a PDF file that is 2MB below.',
                confirmButtonColor: '#22C55E',
            });
            e.target.value = null;
        } else if (Object.values(inputFile).some(file => file && file.name === selectedFile.name)) {
            Swal.fire({
                icon: 'error',
                title: 'Duplicate File',
                text: 'You have already uploaded this file. Please upload a different file.',
                confirmButtonColor: '#22C55E',
            });
            e.target.value = null;
        } else {
            setInputFile({ ...inputFile, [e.target.name]: selectedFile });
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!agree) {
            Swal.fire({
                icon: 'error',
                title: 'Agreement Required',
                text: 'You must agree to the Privacy Policy, Terms of Service, and Data Policy.',
                confirmButtonColor: '#22C55E',
            });
            setIsSubmitting(false);
            return;
        }

        if (lastName.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Empty Last Name',
                text: 'Please Enter your Last Name.',
                confirmButtonColor: '#22C55E',
            });
            setIsSubmitting(false);
            return;
        }
        if (firstName.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Empty First Name',
                text: 'Please Enter your First Name.',
                confirmButtonColor: '#22C55E',
            });
            setIsSubmitting(false);
            return;
        }
        if (middleName.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Empty Middle Name',
                text: 'Please Enter your Last Name.',
                confirmButtonColor: '#22C55E',
            });
            setIsSubmitting(false);
            return;
        }
        if (age.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Empty Age',
                text: 'Please Enter your Age.',
                confirmButtonColor: '#22C55E',
            });
            setIsSubmitting(false);
            return;
        }
        if (sex.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Empty Sex',
                text: 'Please Enter your Sex.',
                confirmButtonColor: '#22C55E',
            });
            setIsSubmitting(false);
            return;
        }
        if (civilStatus.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Empty Civil Status',
                text: 'Please Enter your Civil Status.',
                confirmButtonColor: '#22C55E',
            });
            setIsSubmitting(false);
            return;
        }
        if (religion.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Empty Religion',
                text: 'Please Enter your Religion.',
                confirmButtonColor: '#22C55E',
            });
            setIsSubmitting(false);
            return;
        }
        if (dob.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Empty Date of Birth',
                text: 'Please Enter your Date of Birth.',
                confirmButtonColor: '#22C55E',
            });
            setIsSubmitting(false);
            return;
        }
        if (placeOfBirth.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Empty Place of Birth',
                text: 'Please Enter your Place of Birth.',
                confirmButtonColor: '#22C55E',
            });
            setIsSubmitting(false);
            return;
        }
        if (address.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Empty Address',
                text: 'Please Enter your Address.',
                confirmButtonColor: '#22C55E',
            });
            setIsSubmitting(false);
            return;
        }
        if (citizenship.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Empty Citizenship',
                text: 'Please Enter your Citizenship.',
                confirmButtonColor: '#22C55E',
            });
            setIsSubmitting(false);
            return;
        }
        if (lrn.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Empty LRN',
                text: 'Please Enter your LRN.',
                confirmButtonColor: '#22C55E',
            });
            setIsSubmitting(false);
            return;
        }
        if (email.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Empty Email Address',
                text: 'Please Enter your Email Address.',
                confirmButtonColor: '#22C55E',
            });
            setIsSubmitting(false);
            return;
        }
        if (phone.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Empty Phone Number',
                text: 'Please Enter your Phone Number.',
                confirmButtonColor: '#22C55E',
            });
            setIsSubmitting(false);
            return;
        }
        if (zipCode.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Empty zip code',
                text: 'Please Enter your zip code.',
                confirmButtonColor: '#22C55E',
            });
            setIsSubmitting(false);
            return;
        }
        if (parentName.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Empty Parent Name',
                text: 'Please Enter your Parent Name.',
                confirmButtonColor: '#22C55E',
            });
            setIsSubmitting(false);
            return;
        }
        if (occupation.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Empty Occupation',
                text: 'Please Enter your Occupation.',
                confirmButtonColor: '#22C55E',
            });
            setIsSubmitting(false);
            return;
        }
        if (parentPhone.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Empty Parent Phone Number',
                text: 'Please Enter your Parent Phone Number.',
                confirmButtonColor: '#22C55E',
            });
            setIsSubmitting(false);
            return;
        }
        if (school.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Empty School Name',
                text: 'Please Enter your School Name.',
                confirmButtonColor: '#22C55E',
            });
            setIsSubmitting(false);
            return;
        }
        if (schoolAddress.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Empty School Address',
                text: 'Please Enter your School Address.',
                confirmButtonColor: '#22C55E',
            });
            setIsSubmitting(false);
            return;
        }
        if (course.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Empty Strand',
                text: 'Please Enter your Strand.',
                confirmButtonColor: '#22C55E',
            });
            setIsSubmitting(false);
            return;
        }
        if (isNaN(lrn)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid LRN',
                text: 'Please enter a valid numeric LRN.',
                confirmButtonColor: '#22C55E',
            });
            setIsSubmitting(false);
            return;
        } else if (lrn.length !== 13) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid LRN',
                text: 'LRN should be exactly 13 digits.',
                confirmButtonColor: '#22C55E',
            });
            setIsSubmitting(false);
            return;
        }
        if (isNaN(zipCode)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Zip Code',
                text: 'Please enter a valid numeric zip code.',
                confirmButtonColor: '#22C55E',
            });
            setIsSubmitting(false);
            return;
        } 

        if (phone.length !== 10 || parentPhone.length !== 10) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Phone Number',
                text: 'Phone number should be exactly 10 digits.',
                confirmButtonColor: '#22C55E',
            });
            setIsSubmitting(false);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Email',
                text: 'Please enter a valid email address.',
                confirmButtonColor: '#22C55E',
            });
            setIsSubmitting(false);
            return;
        }

        const formData = new FormData();
        if(fileOne) {
            formData.append('files', fileOne);
        }
        if(fileTwo) { 
            formData.append('files', fileTwo);
        }
        if(fileThree) {
            formData.append('files', fileThree);
        }

        formData.append('firstName', firstName);
        formData.append('middleName', middleName);
        formData.append('lastName', lastName);
        formData.append('extensionName', extensionName);
        formData.append('age', age);
        formData.append('sex', sex);
        formData.append('civilStatus', civilStatus);
        formData.append('religion', religion);
        formData.append('dob', dob);
        formData.append('placeOfBirth', placeOfBirth);
        formData.append('address', address);
        formData.append('citizenship', citizenship);
        formData.append('lrn', lrn);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('zipCode', zipCode);
        formData.append('parentName', parentName);
        formData.append('occupation', occupation);
        formData.append('parentPhone', parentPhone);
        formData.append('school', school);
        formData.append('schoolAddress', schoolAddress);
        formData.append('course', course);
        formData.append('studentStatus', 'Freshmen');

        try {
            const response = await axios.post('/api/application', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const studentId = response.data.id;

            if (selectedSchedule) {
                await axios.put(`/api/application/select/${selectedSchedule._id}`, { studentId: studentId });
            }

            let timerInterval;
            Swal.fire({
                title: 'Application is Submitting',
                html: 'Please wait for a moment...',
                timer: 1500,
                timerProgressBar: true,
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                    const timer = Swal.getPopup().querySelector('b');
                    timerInterval = setInterval(() => {
                        timer.textContent = `${Swal.getTimerLeft()}`;
                    }, 100);
                },
                willClose: () => {
                    clearInterval(timerInterval);
                },
            }).then((result) => {
                if (result.dismiss === Swal.DismissReason.timer) {
                    Swal.fire({
                        title: `${response.data.message}`,
                        text: `Please verify your email address. We sent an email on this address: ${response.data.email}`,
                        icon: 'success',
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        allowEnterKey: false,
                        confirmButtonColor: '#22C55E',
                    });
                }
            });
    
            clearInputData();
            setSelectedButton(null);
            if (clearInputFile.current) {
                clearInputFile.current.value = '';
            }
            if (clearInputFile2.current) {
                clearInputFile2.current.value = '';
            }
            if (clearInputFile3.current) {
                clearInputFile3.current.value = '';
            }
            setIsSubmitting(false);
            fetchSchedules();
        } catch(e){
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `${e.response.data}`,
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false,
                confirmButtonColor: '#22C55E',
            });
            setIsSubmitting(false);
        }
    }

  return (
    <div className='w-full min-h-screen bg-gradient-to-r from-green-900 to-green-700'>
        <Header />
    
            <div className="p-5 w-full">
                <form ref={form} onSubmit={handleSubmit} className='bg-white max-w-5xl p-12 shadow rounded-lg mt-16 mx-auto max-sm:px-5'>
                    <h2 className='text-3xl uppercase font-bold mb-10 text-black max-sm:text-xl'>APPLICATION FORM FOR THE OLD STUDENTS</h2>    
                    <p className='text-base font-normal text-black mb-5'>
                        Note: There will be no admissions fee to be collected and no entrance examinations. The basis of the evaluation will be the documents that you will be uploading and the result of the interviews (as needed).
                        <br/><br/>
                        <strong>STEP 1:</strong> Fill-up the APPLICATION FORM. All fields with asterisk (*) are mandatory fields.
                        <br/><br/>
                        <strong>STEP 2:</strong> UPLOAD the REQUIREMENTS stated on the list requirements provided on the link below. All MANDATORY requirements should be uploaded.
                        <br/><br/>
                        <strong>STEP 3:</strong> Click SUBMIT and wait for an EMAIL confirmation of your application. The automated message contains your application details which you should save.
                        <br/><br/>
                        <strong>STEP 4:</strong> You MAY BE INVITED for a series of face-to-face interviews for further evaluation as necessary. Otherwise, you will immediately receive the final result of your application via email and/or SMS. Make sure that you provide your active email address and mobile number to receive all the communications from the Butong Elementary School Admissions.
                        <br/><br/>
                        <strong>STEP 5:</strong> Once the last interview with the SHS Homeroom Coordinator or his delegate is completed, you will be notified via email and/or SMS of the result of your application within 3-5 working days from the date of your interview, which you would need to go to the school after you received the news.
                    </p> 
                    <hr className='border-black mb-5' style={{ borderWidth: '2px' }}/>
                    <div className='flex items-center justify-center gap-[30px] mb-8 max-sm:flex-col'>
                        <div className="w-1/2 max-sm:w-full">
                            <span className='label-text text-black font-bold select-none'>Last Name*</span>
                            <input className='w-full p-4 pr-4 text-sm text-black rounded-md border-2 border-solid border-gray-200 outline-none bg-[#EBEBEB] placeholder-gray-500' type="text" placeholder='Type here' name='lastName' value={lastName} onChange={handleChange} maxLength={50} required/>
                        </div>

                        <div className="w-1/2 max-sm:w-full">
                            <span className='label-text text-black font-bold select-none'>First Name*</span>
                            <input className='w-full p-4 pr-4 text-sm text-black rounded-md border-2 border-solid border-gray-200 outline-none bg-[#EBEBEB] placeholder-gray-500' type="text" placeholder='Type here' name='firstName' value={firstName} onChange={handleChange} maxLength={50} required/>
                        </div>

                        <div className="w-1/2 max-sm:w-full">
                            <span className='label-text text-black font-bold select-none'>Middle Name</span>
                            <input className='w-full p-4 pr-4 text-sm text-black rounded-md border-2 border-solid border-gray-200 outline-none bg-[#EBEBEB] placeholder-gray-500' type="text" placeholder='Type here' name='middleName' value={middleName} onChange={handleChange} maxLength={50}/>
                        </div>

                        <div className="w-1/4 max-sm:w-full">
                            <span className='label-text text-black font-bold select-none capitalize'>Suffix</span>
                            <input className='w-full p-4 pr-4 text-sm text-black rounded-md border-2 border-solid border-gray-200 outline-none bg-[#EBEBEB] placeholder-gray-500' type="text" placeholder='Type here' name='extensionName' value={extensionName} onChange={handleChange} maxLength={50}/>
                        </div>
                    </div>


                    <div className='flex items-center justify-center gap-[30px] mb-8 max-sm:flex-col'>
                        <div className="w-1/4 max-sm:w-full">
                            <span className='label-text text-black font-bold select-none'>Age*</span>
                            <input className='w-full p-4 pr-4 text-sm text-black rounded-md border-2 border-solid border-gray-200 outline-none bg-[#EBEBEB] placeholder-gray-500' type="number" placeholder='' name='age' value={age} onChange={handleChange} required/>
                        </div>

                        <div className="w-1/2 max-sm:w-full">
                            <span className='label-text text-black font-bold select-none'>Gender*</span>
                            <select name="sex" onChange={handleChange} className='w-full p-4 text-sm text-black rounded-md border-2 border-solid border-gray-200 outline-none bg-[#EBEBEB] placeholder-gray-500' required>
                                <option selected disabled>Choose a gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>

                        <div className="w-1/2 max-sm:w-full">
                            <span className='label-text text-black font-bold select-none'>Civil Status*</span>
                            <select name="civilStatus" onChange={handleChange} className='w-full p-4 text-sm text-black rounded-md border-2 border-solid border-gray-200 outline-none bg-[#EBEBEB] placeholder-gray-500' required>
                                <option selected disabled>Civil Status</option>
                                <option value="Single">Single</option>
                                <option value="Married">Married</option>
                                <option value="Widowed">Widowed</option>
                                <option value="Separated">Separated</option>
                            </select>
                        </div>

                        <div className="w-1/2 max-sm:w-full">
                            <span className='label-text text-black font-bold select-none capitalize'>Religion*</span>
                            <input className='w-full p-4 pr-4 text-sm text-black rounded-md border-2 border-solid border-gray-200 outline-none bg-[#EBEBEB] placeholder-gray-500' type="text" placeholder='Type here' name='religion' value={religion} onChange={handleChange}/>
                        </div>
                    </div>


                    <div className='flex items-center justify-center gap-[30px] mb-8 max-sm:flex-col'>
                        <div className="w-1/2 max-sm:w-full">
                            <span className='label-text text-black font-bold select-none capitalize'>Date of Birth*</span>
                            <input className='w-full p-4 pr-4 text-sm text-black rounded-md border-2 border-solid border-gray-200 outline-none bg-[#EBEBEB] placeholder-gray-500' type="date" placeholder='Date of Birth' name='dob' value={dob} onChange={handleChange} max={getMaxDate()} required/>
                        </div>

                        <div className="w-1/2 max-sm:w-full">
                            <span className='label-text text-black font-bold select-none'>Place of Birth*</span>
                            <input className='w-full p-4 pr-4 text-sm text-black rounded-md border-2 border-solid border-gray-200 outline-none bg-[#EBEBEB] placeholder-gray-500' type="text" placeholder='Type here' name='placeOfBirth' value={placeOfBirth} onChange={handleChange} required/>
                        </div>

                        <div className="w-1/2 max-sm:w-full">
                            <span className='label-text text-black font-bold select-none'>Permanent Address*</span>
                            <input className='w-full p-4 pr-4 text-sm text-black rounded-md border-2 border-solid border-gray-200 outline-none bg-[#EBEBEB] placeholder-gray-500' type="text" placeholder='Type here' name='address' value={address} onChange={handleChange} required/>
                        </div>
                        <div className="w-1/3 max-sm:w-full">
                            <span className='label-text text-black font-bold select-none'>Citizenship*</span>
                            <input className='w-full p-4 pr-4 text-sm text-black rounded-md border-2 border-solid border-gray-200 outline-none bg-[#EBEBEB] placeholder-gray-500' type="text" placeholder='Type here' name='citizenship' value={citizenship} onChange={handleChange} required/>
                        </div>
                    </div>


                    <div className='flex items-center justify-center gap-[30px] mb-12 max-sm:flex-col'>
                        <div className="w-1/2 max-sm:w-full">
                            <span className='label-text text-black font-bold select-none'>LRN*</span>
                            <input className='w-full p-4 pr-4 text-sm text-black rounded-md border-2 border-solid border-gray-200 outline-none bg-[#EBEBEB] placeholder-gray-500' type="text" placeholder='Type here' name='lrn' value={lrn} onChange={handleChange} required/>
                        </div>

                        <div className="w-1/2 max-sm:w-full">
                            <span className='label-text text-black font-bold select-none'>Email Address*</span>
                            <input className='w-full p-4 pr-4 text-sm text-black rounded-md border-2 border-solid border-gray-200 outline-none bg-[#EBEBEB] placeholder-gray-500' type="email" placeholder='Type here' name='email' value={email} onChange={handleChange} required/>
                        </div>

                        <div className="w-1/3 max-sm:w-full">
                            <span className='label-text text-black font-bold select-none'>Phone Number*<span className='text-gray-700'>+63</span></span>
                            <input className='w-full p-4 pr-4 text-sm text-black rounded-md border-2 border-solid border-gray-200 outline-none bg-[#EBEBEB] placeholder-gray-500' type="number" placeholder='Phone (9xxxxxxxxx)' name='phone' value={phone} onChange={handleChange} maxLength={10} required/>
                        </div>

                        <div className="w-1/4 max-sm:w-full">
                            <span className='label-text text-black font-bold select-none'>Zip Code*</span>
                            <input className='w-full p-4 pr-4 text-sm text-black rounded-md border-2 border-solid border-gray-200 outline-none bg-[#EBEBEB] placeholder-gray-500' type="text" placeholder='Type here' name='zipCode' value={zipCode} onChange={handleChange} required/>
                        </div>
                        
                    </div>


                    <div className='flex items-center justify-center gap-[30px] mb-12 max-sm:flex-col'>
                        <div className="w-1/2 max-sm:w-full">
                            <span className='label-text text-black font-bold select-none'>Parent/Guardian Name*</span>
                            <input className='w-full p-4 pr-4 text-sm text-black rounded-md border-2 border-solid border-gray-200 outline-none bg-[#EBEBEB] placeholder-gray-500' type="text" placeholder='Type here' name='parentName' value={parentName} onChange={handleChange} required/>
                        </div>

                        <div className="w-1/2 max-sm:w-full">
                            <span className='label-text text-black font-bold select-none'>Occupation*</span>
                            <input className='w-full p-4 pr-4 text-sm text-black rounded-md border-2 border-solid border-gray-200 outline-none bg-[#EBEBEB] placeholder-gray-500' type="text" placeholder='Occupation' name='occupation' value={occupation} onChange={handleChange} required/>
                        </div>

                        <div className="w-1/3 max-sm:w-full">
                            <span className='label-text text-black font-bold select-none'>Phone Number*<span className='text-gray-700'>+63</span></span>
                            <input className='w-full p-4 pr-4 text-sm text-black rounded-md border-2 border-solid border-gray-200 outline-none bg-[#EBEBEB] placeholder-gray-500' type="number" placeholder='Phone (9xxxxxxxxx)' name='parentPhone' value={parentPhone} onChange={handleChange} maxLength={10} required/>
                        </div>
                    </div>



                    <div className="flex items-start justify-center mb-12 max-sm:flex-col">
                        <div className="w-1/2 max-sm:w-full">
                            <h2 className='text-2xl font-bold text-black break-all text-center max-sm:text-lg'>FOR THE UPPER PRIMARY EDUCATION</h2>
                            <h2 className='text-2xl font-bold text-black break-all text-center max-sm:text-lg'>APPLICANT OF THE CURRENT</h2>
                            <h2 className='text-2xl font-bold text-black break-all text-center max-sm:text-lg'>ACADEMIC YEAR</h2>
                            <p className='mt-6 text-base font-normal text-center max-sm:text-xs'>Name of the School you've taken for the Lower Primary Education (Do not abbreviate).</p>
                            <span className='label-text text-black font-bold select-none mt-3'>*</span>
                            <input className='w-full p-4 pr-4 text-sm text-black rounded-md border-2 border-solid border-gray-200 outline-none bg-[#EBEBEB] placeholder-gray-500' type="text" placeholder='Do not leave it blank.' name='school' value={school} onChange={handleChange}/>


                            <p className='mt-6 text-base font-normal text-center max-sm:text-xs'>Address of the School of the Lower Prmary Education Attended</p>
                            <span className='label-text text-black font-bold select-none mt-3'>*</span>
                            <input className='w-full p-4 pr-4 text-sm text-black rounded-md border-2 border-solid border-gray-200 outline-none bg-[#EBEBEB] placeholder-gray-500' type="text" placeholder='Do not leave it blank.' name='schoolAddress' value={schoolAddress} onChange={handleChange}/>


                            <p className='mt-6 text-base font-normal text-center max-sm:text-xs'>Grade Level</p>
                            <span className='label-text text-black font-bold select-none mt-3'>*</span>
                            <select name="course" onChange={handleChange} className='w-full p-4 text-sm text-black rounded-md border-2 border-solid border-gray-200 outline-none bg-[#EBEBEB] placeholder-gray-500'>
                                <option selected disabled>Choose a grade level</option>
                                <option value="Grade 4">Grade 4</option>
                                <option value="Grade 5">Grade 5</option>
                                <option value="Grade 6">Grade 6</option>
                            </select>
                        </div>
                    </div>


                    <h2 className='text-xl font-bold text-black break-all max-sm:text-lg'>Requirements for Old Students for the Upper Primary Education</h2>
                    <p className='mt-3 label-text font-normal max-sm:text-xs'>Note: Include your full name in the filename of the requirements;</p>
                    <p className='label-text font-normal max-sm:text-xs'>Incomplete entry of personal information, tampered documents, erasures, and incomplete documents will not be processed.</p>
                    <p className='label-text font-normal max-sm:text-xs'>PASS THE FOLLOWING IN A PDF FILE FORMAT</p>

                    <div className='flex items-start justify-center gap-[30px] mb-20 mt-8 max-sm:flex-col'>
                        <div className="w-1/2 max-sm:w-full">
                            <p className='text-lg font-medium text-black max-sm:text-base'>Please Upload the Following</p>
                            <p className='label-text text-justify mt-2 max-sm:text-xs'>Upload a Copy of PSA Birth Certificate</p>                   
                            <p className='label-text text-justify mt-2 max-sm:text-xs'>Note: Documents should be readable and completely scanned</p>                   
                            <input ref={clearInputFile} className='file-input file-input-bordered file-input-sm w-full max-w-xs rounded-md mt-2' type="file" name='fileOne' onChange={handleFileChange} accept='.pdf' required/>


                            <p className='label-text text-justify mt-10 max-sm:text-xs'>2 pieces Identical Photograph, Passport size with name tag, white background, and taken within the last six months.</p>
                            <input ref={clearInputFile2} className='file-input file-input-bordered file-input-sm w-full max-w-xs rounded-md mt-2' type="file" name='fileTwo' onChange={handleFileChange} accept='.pdf' required/>


                            <p className='label-text text-justify mt-10 max-sm:text-xs'>For the Upper Primary Education, the grades for the First, Second, Third, and Fourth Grading Periods should be passed in a PDF Form<br/>(Note: Documents schould be readable and completely scanned)</p>
                            <input ref={clearInputFile3} className='file-input file-input-bordered file-input-sm w-full max-w-xs rounded-md mt-2' type="file" name='fileThree' onChange={handleFileChange} accept='.pdf' required/>
                        </div>
                    </div>

                    <div className="flex items-center mb-4">
                        <input type="checkbox" id="agree" name="agree" checked={agree} onChange={() => setAgree(!agree)} required />
                        <label htmlFor="agree" className="ml-2 text-lg text-black">
                            Do you agree with the <span className="text-blue-500 cursor-pointer" onClick={() => window.open('/policies', '_blank')}>Privacy Policy, Terms of Service and Data Policy?</span>
                        </label>
                    </div>
                    
                    <div className="mt-6 mb-20">
                        <h2 className="text-lg font-bold text-gray-800 mb-2">Available Schedules</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {schedules.map(schedule => (
                                <div key={schedule._id} className="border border-gray-200 rounded p-4">
                                    <div className='select-none'>Date: {format(new Date(schedule.date),'MMM dd, yyyy')}</div>
                                    <div className='select-none'>Time: {format(new Date(schedule.time),'hh:mm a')}</div>
                                    <div className='flex items-center justify-between'>
                                        <button onClick={(e) => handleScheduleSelect(schedule, e)} disabled={selectedButton === schedule._id} className={`mt-2 bg-[#3B82F6] hover:opacity-80 text-white text-sm rounded-md p-1.5 ${selectedButton === schedule._id ? 'cursor-not-allowed opacity-50' : ''}`}>
                                            {selectedButton === schedule._id ? 'Selected' : 'Select'}
                                        </button>
                                        <span className='mt-2 select-none text-xs md:text-sm badge badge-success text-white badge-sm md:badge-md'>Left: {schedule.maxStudent - schedule.studentId.length}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <Link to='/' className='btn bg-blue-500 hover:bg-blue-400 text-sm text-white rounded-md border-none shadow capitalize max-sm:btn-sm max-sm:text-xs'><FiArrowLeft size={20}/>back</Link>
                        <button className='btn bg-green-500 hover:bg-green-400 text-sm text-white rounded-md border-none shadow capitalize max-sm:btn-sm max-sm:text-xs' disabled={isSubmitting || schedules.length === 0}>{isSubmitting ? 'Submitting...' : 'Submit'}<FiSend size={20}/></button>
                    </div>
                </form>
            </div>
            <Footer />
    </div>
  )
}

export default ApplicationForm
