import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ButongLogo from '../../assets/ButongLogo.svg';

const Policies = () => {
    return (
        <div className='w-full min-h-screen bg-gradient-to-r from-gray-200 to-gray-400'>
            <Header />
            <div className='p-5 w-full'>
                <div className='bg-white max-w-5xl p-12 shadow rounded-lg mt-16 mx-auto max-sm:px-5'>
                    <img src={ButongLogo} alt="Butong Elementary School Logo" className='mx-auto mb-5 w-24 h-24' />
                    <h2 className='text-3xl uppercase font-bold mb-5 text-black max-sm:text-xl text-center border-b-2 border-black pb-2'>Privacy Policy, Terms of Service and Data Policy</h2>
                    <p className='text-base font-normal text-black mb-5'>
                        <h2 className='text-3xl uppercase font-bold mb-5 text-black max-sm:text-xl text-center pb-2'>LEGALITIES</h2>
                        <strong className='text-2xl text-green-600'>Privacy Policy</strong>
                        <br /><br />
                        <strong>Introduction</strong>
                        <br /><br />
                        Welcome to Butong Elementary School’s Admission System. We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, and safeguard your information in compliance with the Republic Act 10173, also known as the Data Privacy Act of 2012.
                        <br /><br />
                        <strong>Information We Collect</strong>
                        <br /><br />
                        Personal Information: Name, address, email address, contact number, date of birth, and other information provided during the application process.
                        <br /><br />
                        Academic Records: Previous school information and other relevant data for admission purposes.
                        <br /><br />
                        System Information: IP address, browser type, and usage data for system optimization and security.
                        <br /><br />
                        <strong>How We Use Your Information</strong>
                        <br /><br />
                        To process and verify admission applications.
                        <br /><br />
                        To communicate updates and notifications regarding your application.
                        <br /><br />
                        For statistical and research purposes to improve our services.
                        <br /><br />
                        To comply with legal and regulatory requirements.
                        <br /><br />
                        <strong>Data Retention</strong>
                        <br /><br />
                        Your personal data will only be retained as long as necessary to fulfill the purposes outlined in this policy unless a longer retention period is required by law.
                        <br /><br />
                        <strong>Data Security</strong>
                        <br /><br />
                        We implement appropriate technical and organizational measures to secure your personal information against unauthorized access, alteration, disclosure, or destruction.
                        <br /><br />
                        <strong>Your Rights</strong>
                        <br /><br />
                        Under the Data Privacy Act of 2012, you have the right to:
                        <br /><br />
                        Access the personal data we hold about you.
                        <br /><br />
                        Request corrections to any inaccuracies in your personal data.
                        <br /><br />
                        Withdraw consent for data processing.
                        <br /><br />
                        File a complaint with the National Privacy Commission (NPC).
                        <br /><br />
                        For inquiries or concerns, contact us at [Insert Contact Information].
                        <br /><br />
                        <strong className='text-2xl text-green-600'>Terms of Service</strong>
                        <br /><br />
                        <strong>Acceptance of Terms</strong>
                        <br /><br />
                        By accessing and using the Butong Elementary School Admission System, you agree to comply with these Terms of Service. If you do not agree, please refrain from using the system.
                        <br /><br />
                        <strong>User Responsibilities</strong>
                        <br /><br />
                        Accuracy of Information: Users must ensure that all information provided is accurate and up-to-date.
                        <br /><br />
                        Account Security: Keep your login credentials confidential. You are responsible for all activities under your account.
                        <br /><br />
                        Prohibited Activities: Users must not engage in activities that compromise the system’s security, violate laws, or infringe on the rights of others.
                        <br /><br />
                        <strong>System Access</strong>
                        <br /><br />
                        We reserve the right to modify or discontinue access to the system without prior notice for maintenance or other reasons.
                        <br /><br />
                        <strong>Limitation of Liability</strong>
                        <br /><br />
                        The school shall not be liable for any indirect, incidental, or consequential damages arising from the use of the system.
                        <br /><br />
                        <strong>Governing Law</strong>
                        <br /><br />
                        These terms shall be governed by and construed in accordance with the laws of the Philippines.
                        <br /><br />
                        <strong className='text-2xl text-green-600'>Data Policy</strong>
                        <br /><br />
                        <strong>Data Collection</strong>
                        <br /><br />
                        We collect personal data strictly for the purpose of managing the admission process. This includes but is not limited to:
                        <br /><br />
                        Application evaluation.
                        <br /><br />
                        Communication with applicants.
                        <br /><br />
                        Record-keeping for academic and legal purposes.
                        <br /><br />
                        <strong>Data Sharing</strong>
                        <br /><br />
                        Your data will only be shared with authorized personnel within the school and third parties when required by law or necessary for service delivery (e.g., email providers for notifications).
                        <br /><br />
                        <strong>Data Protection Officer</strong>
                        <br /><br />
                        We have appointed a Data Protection Officer (DPO) to oversee compliance with the Data Privacy Act of 2012. You may contact the DPO at [Insert Contact Information] for any data privacy concerns.
                        <br /><br />
                        <strong>Updates to Policies</strong>
                        <br /><br />
                        These policies may be updated periodically to reflect changes in laws, regulations, or our practices. Users will be notified of any significant changes.
                        <br /><br />
                        By using the Butong Elementary School Admission System, you acknowledge that you have read, understood, and agree to these policies.
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Policies;
