import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { FaBookReader } from 'react-icons/fa';
import { RiUserCommunityLine } from 'react-icons/ri';
import { GiGrowth, GiSmart } from 'react-icons/gi';
import { MdEmail } from "react-icons/md";
import { FaFacebookSquare } from "react-icons/fa";

const About = () => {
  return (
    <div className="w-full min-h-screen bg-white">
      <Header />
      <section className="flex items-center px-[1.5%] xl:px-[9%]">
        <div className="w-full">
          <h2 className="text-3xl font-bold text-center text-[#054A29] mt-5">About Us</h2>

          <p className="mt-8 text-black text-center text-lg">
            Our mission is to provide a seamless admission process for new and transferring students.
            This platform enables parents and guardians to submit applications conveniently. It ensures
            accurate and secure management of student records while reducing the need for manual paperwork.
            With user-friendly features, the system allows for real-time tracking of application statuses.
            By streamlining admissions, we aim to create a more efficient and accessible process for everyone involved.
          </p>

          <hr className="my-8 border-t-4 border-[#137547] w-full" />

          <h3 className="text-2xl font-semibold text-center text-[#137547] mt-8">4 Cores about Butong Elementary School</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <div className="bg-[#E5E7EB] p-6 rounded-lg shadow-md flex flex-col items-center text-center transform transition-transform duration-300 hover:scale-105 hover:bg-[#d3d6db]">
              <FaBookReader className="text-[#137547] text-5xl mb-4" />
              <h4 className="text-xl font-bold text-[#137547] mb-2">Education</h4>
              <p className="text-black">
                We focus on providing high-quality education for all students.
              </p>
            </div>
            <div className="bg-[#E5E7EB] p-6 rounded-lg shadow-md flex flex-col items-center text-center transform transition-transform duration-300 hover:scale-105 hover:bg-[#d3d6db]">
              <RiUserCommunityLine className="text-[#137547] text-5xl mb-4" />
              <h4 className="text-xl font-bold text-[#137547] mb-2">Community</h4>
              <p className="text-black">
                Our school fosters a strong sense of community and collaboration.
              </p>
            </div>
            <div className="bg-[#E5E7EB] p-6 rounded-lg shadow-md flex flex-col items-center text-center transform transition-transform duration-300 hover:scale-105 hover:bg-[#d3d6db]">
              <GiGrowth className="text-[#137547] text-5xl mb-4" />
              <h4 className="text-xl font-bold text-[#137547] mb-2">Growth</h4>
              <p className="text-black">
                We support the personal and academic growth of every student.
              </p>
            </div>
            <div className="bg-[#E5E7EB] p-6 rounded-lg shadow-md flex flex-col items-center text-center transform transition-transform duration-300 hover:scale-105 hover:bg-[#d3d6db]">
              <GiSmart className="text-[#137547] text-5xl mb-4" />
              <h4 className="text-xl font-bold text-[#137547] mb-2">Excellence</h4>
              <p className="text-black">
                We strive for excellence in all our academic and extracurricular activities.
              </p>
            </div>
          </div>

          <hr className="my-8 border-t-4 border-[#137547] w-full" /> {/* Green line with increased thickness */}

          <div className="mt-8">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d938.9017734487137!2d121.13694068568337!3d14.29037206137128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397d8e52e51042f%3A0x71c94c1978f516ec!2sButong%20Elementary%20School!5e1!3m2!1sen!2sph!4v1734780524957!5m2!1sen!2sph"
              width="100%"
              height="450"
              style={{ border: '4px solid black', borderRadius: '8px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade">
            </iframe>
          </div>

          {/* Grid Section Below Iframe */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8">
            {/* Left Column */}
            <div className="text-center">
              <h4 className="text-2xl font-semibold text-[#358600]">Where Located At?</h4>
              <p className="mt-4 text-lg text-black">74RP+2M5, Purok 3 Unnamed Rd, Cabuyao, 4025 Laguna</p>
            </div>

            {/* Right Column */}
            <div className="text-center">
              <h4 className="text-2xl font-semibold text-[#137547]">Socials</h4>
              <div className="flex justify-center gap-6 mt-4">
                {/* Email Icon */}
                <a href="mailto:108238@deped.gov.ph" target="_blank" rel="noopener noreferrer">
                  <MdEmail className="text-5xl text-[#137547] hover:scale-110 transition-transform" />
                </a>
                {/* Facebook Icon */}
                <a href="https://www.facebook.com/DepEdTayoBES108238" target="_blank" rel="noopener noreferrer">
                  <FaFacebookSquare className="text-5xl text-[#137547] hover:scale-110 transition-transform" />
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>
      <Footer />
    </div>
  );
};

export default About;
