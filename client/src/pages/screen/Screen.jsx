import { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
// import Faculty from '../../assets/faculty.jpg'
import axios from 'axios';
import { format } from 'date-fns';
import { FiAlertOctagon } from "react-icons/fi";
import { HiChevronDoubleRight, HiOutlineMegaphone } from 'react-icons/hi2';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'swiper/css/bundle';
import { Autoplay, EffectFade } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import ButongMatatag from '../../assets/ButongMatatag.svg';
import ButongCover from '../../assets/ButongCover.svg';
import requirementsPDF from '/src/assets/Butong Elementary School Requirements.pdf';


const Screen = () => {
  const [inputData, setInputData] = useState({
    schoolTerm: '',
    schoolYear: '',
  });

  const [todaySchedule, setTodaySchedule] = useState([]);
  const [tomorrowSchedule, setTomorrowSchedule] = useState([]);
  const [announcements, setAnnouncements] = useState(null);

  useEffect(() => {
    fetchData();
    fetchSchedules();
    fetchAnnouncements();
  },[]);


  const fetchAnnouncements = async () => {
    try {
        const response = await axios.get('/api/getAnnouncement');
        const data = response.data;
        
        setAnnouncements(data);
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


  const fetchData = async () => {
    try {
        const response = await axios.get('/api/settings');
        const data = response.data;
        if (data) {
            setInputData(data);
        } else {
            setInputData({
                schoolTerm: '',
                schoolYear: ''
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


  const fetchSchedules = async () => {
    try {
      const response = await axios.get('/api/application/schedule');
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      const tomorrowDate = new Date(currentDate);
      tomorrowDate.setDate(tomorrowDate.getDate() + 1);

      const todaySchedules = response.data.filter(schedule => {
        const scheduleDate = new Date(schedule.date);
        scheduleDate.setHours(0, 0, 0, 0);
        return scheduleDate.getTime() === currentDate.getTime() && schedule.maxStudent > schedule.studentId.length;
      });
      todaySchedules.sort((a, b) => new Date(a.time) - new Date(b.time));
      setTodaySchedule(todaySchedules);


      const tomorrowSchedules = response.data.filter(schedule => {
        const scheduleDate = new Date(schedule.date);
        scheduleDate.setHours(0, 0, 0, 0);
        return scheduleDate.getTime() === tomorrowDate.getTime() && schedule.maxStudent > schedule.studentId.length;
      });
      tomorrowSchedules.sort((a, b) => new Date(a.time) - new Date(b.time));
      setTomorrowSchedule(tomorrowSchedules);
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

  const todayDate = () => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString(undefined, options);
  };

  const tomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return tomorrow.toLocaleDateString(undefined, options);
  };

  return (
    <div className='w-full min-h-screen bg-[#F7F7F7]'>
      <Header />
      <section className='flex items-center px-[1.5%] xl:px-[9%]'>
        <div className='w-full'>
            <div className='bg-[#3FA34D] bg-opacity-65 rounded-md p-12 text-center mb-6 mt-7'>
                <h2 className='text-black text-2xl font-bold'>Welcome to Butong Elementary School Admission System</h2>
                <hr className='border-t-2 border-white my-4 w-1/3 mx-auto' />
                <p className='text-black text-lg mt-2'>Easily Manage and Submit Admission Forms Online</p>
                <p className='text-black text-lg mt-2'>For the Upper Primary Education</p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
                <div className='text-black text-lg mt-10'>
                    Streamline your journey to Butong Elementary School with our efficient and user-friendly Admission System, designed to make applying simple and hassle-free.
                </div>
                <div className='flex justify-center'>
                    <img src={ButongMatatag} alt="Butong Matatag" className='w-auto h-48 md:h-64 object-contain' />
                </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
                <div className='flex justify-center'>
                    <img src={ButongCover} alt="Butong Cover" className='w-auto h-48 md:h-64 object-contain' />
                </div>
                <div className='text-black text-lg mt-10'>
                    The Butong Elementary School Admission System is a dedicated platform designed to simplify and manage the enrollment process, ensuring a seamless experience for students, parents, and administrators.
                    <div className='mt-4'>
                        <Link to="/about" className="bg-[#137547] text-white rounded-md px-4 py-2 hover:bg-[#0f5a36] active:bg-[#0a3d25]">About Us</Link>
                    </div>
                </div>
            </div>

            <hr className='border-t-4 border-[#137547] my-10' />

            <h1 className='font-bold text-7xl text-center text-[#7a7575] mt-24 leading-tight drop-shadow-xl max-md:text-5xl max-md:text-center max-sm:text-2xl'>Online <span className='e text-warning'>Application</span> For <span className='text-success'>Admission</span>Interview</h1>
            <h3 className='text-[#000] text-center mt-2 text-2xl drop-shadow-xl font-medium max-md:text-center max-md:text-lg'>Upper Primary Education: {inputData.schoolTerm} S.Y {inputData.schoolYear}</h3>
            <div className='flex justify-center mt-5'>
              <Link to="https://www.facebook.com/DepEdTayoBES108238" target="_blank" className="bg-[#3B82F6] hover:opacity-80 flex justify-center items-center gap-2 text-black text-sm md:text-base rounded-md p-2 md:p-3">Learn more <HiChevronDoubleRight size={20}/></Link>
            </div>

            <h2 className='text-center text-[#137547] text-2xl font-bold mt-10'>Requirements</h2>
              <p className='text-center text-black mt-2'>Click the link below to download the Requirements PDF file.</p>
              <div className='flex justify-center mt-4'>
                <a 
                  href={requirementsPDF} 
                  download="Butong_Elementary_School_Requirements.pdf" 
                  className="bg-[#259230] text-white rounded-md px-4 py-2 hover:bg-[#0f5a36] active:bg-[#0a3d25]">
                  Download Requirements
                </a>
              </div>

            <hr className='border-t-4 border-[#137547] mt-10 mb-8' />
            
            <Swiper
              spaceBetween={30}
              centeredSlides={true}
              loop={true}
              autoplay={{
                delay: 5500,
                disableOnInteraction: false,
              }}
              modules={[Autoplay, EffectFade]}
              className='mt-10 mx-auto w-[500px] max-sm:w-[300px]'
            >
              {announcements && (
              <SwiperSlide key={announcements._id}>
                <div className='bg-[#fefefe] rounded-xl w-[500px] h-80 pt-6 px-10 mt-12 shadow max-sm:mx-auto max-sm:w-[300px]'>
                    <div className="icon bg-[#3B82F6] w-[70px] h-[70px] rounded-full flex justify-center items-center max-sm:w-[60px] max-sm:h-[60px]">
                        <HiOutlineMegaphone className='text-[#fefefe] items-center' size={40}/>
                    </div>
                    <p className='font-bold text-[#fefefe] mt-5 max-sm:text-sm badge badge-success badge-md'>Important Announcement:</p>
                    <p className='text-[#000] font-medium text-justify pt-2 max-sm:text-xs break-words'>{announcements.title}</p>
                    <p className='text-[#000] font-light text-justify pt-2 max-sm:text-xs break-words'>{announcements.content}</p>
                </div>
              </SwiperSlide>
              )}
              <SwiperSlide>
                <div className='bg-[#2a2d3e] rounded-xl w-[500px] h-80 pt-6 px-10 mt-12 shadow max-sm:mx-auto max-sm:w-[300px]'>
                  <p className='text-white font-bold text-base max-sm:text-sm'>Available Schedule Today:</p>
                  <p className='font-medium text-sm md:text-base text-white'>{todayDate()}</p>
                  {todaySchedule.length > 0 ? (
                    <ul>
                      {todaySchedule.map(schedule => (
                        <li key={schedule._id} className='badge badge-lg mt-5 mx-1 select-none'>
                          {format(new Date(schedule.time),'hh:mm a')}
                        </li>
                      ))}
                    </ul>
                    ) : (
                    <p className='mt-5 badge badge-error text-white text-[9px] md:text-sm'>No available schedules for today</p>
                  )}
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className='bg-[#fefefe] rounded-xl w-[500px] h-80 pt-6 px-10 mt-12 shadow max-sm:mx-auto max-sm:w-[300px]'>
                    <div className="icon bg-[#3B82F6] w-[70px] h-[70px] rounded-full flex justify-center items-center max-sm:w-[60px] max-sm:h-[60px]">
                        <FiAlertOctagon className='text-[#fefefe] items-center' size={40}/>
                    </div>
                    <p className='text-[#000] font-bold text-base pt-5 max-sm:text-sm'>Data Privacy Consent for Applicants:</p>
                    <p className='text-[#000] font-light text-justify pt-2 max-sm:text-xs'>I understand that by providing my information. I give my full-consent to the Office of the Admission for the
                    collection, use, and processing of the information provided above with respect to my admission, enrollment,
                    scholarship financial assistance, graduation, and verification of records.</p>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className='bg-[#2a2d3e] rounded-xl w-[500px] h-80 pt-6 px-10 mt-12 shadow max-sm:mx-auto max-sm:w-[300px]'>
                  <p className='text-white font-bold text-base max-sm:text-sm'>Available Schedule Tomorrow:</p>
                  <p className='font-medium text-sm md:text-base text-white'>{tomorrowDate()}</p>
                  {tomorrowSchedule.length > 0 ? (
                    <ul>
                      {tomorrowSchedule.map(schedule => (
                        <li key={schedule._id} className='badge badge-lg mt-5 mx-1 select-none'>
                          {format(new Date(schedule.time),'hh:mm a')}
                        </li>
                      ))}
                    </ul>
                    ) : (
                    <p className='mt-5 badge badge-error text-white text-[9px] md:text-sm'>No available schedules for tomorrow</p>
                  )}
                </div>
              </SwiperSlide>
              {/* <SwiperSlide>
                <div className='bg-[#FEDED6] rounded-xl w-[500px] h-80 pt-10 px-10 mt-12 shadow max-sm:mx-auto max-sm:w-[300px]'>
                  <img className='object-cover object-center rounded-md max-sm:h-[240px]' src={Faculty} alt="" />
                </div>
              </SwiperSlide> */}
            </Swiper>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default Screen
