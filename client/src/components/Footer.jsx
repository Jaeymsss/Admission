const Footer = () => {
    return (
        <footer className="bg-[#054A29] text-white py-4 mt-8">
            <div className="container mx-auto text-center px-4 sm:px-6 lg:px-8">
                <p className="text-sm sm:text-base md:text-lg">
                    &copy; {new Date().getFullYear()} Butong Elementary School. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
