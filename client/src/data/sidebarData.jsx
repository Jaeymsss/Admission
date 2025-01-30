import { HiOutlineClock, HiOutlineUserGroup, HiOutlineIdentification, HiOutlineCog8Tooth } from "react-icons/hi2";

export const sidebarData = [
    {
        id: 1,
        title: 'Schedule',
        url: '/schedule',
        icon: <HiOutlineClock size={20}/>,
    },
    {
        id: 2,
        title: 'Profile',
        url: '/profile',
        icon: <HiOutlineIdentification size={20}/>,
    },
    {
        id: 3,
        title: 'Student Applicant',
        url: '/student',
        icon: <HiOutlineUserGroup size={20}/>,
    },
    {
        id: 4,
        title: 'Settings',
        url: '/settings',
        icon: <HiOutlineCog8Tooth size={20}/>,
    },
];