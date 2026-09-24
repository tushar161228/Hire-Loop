import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage } from '../ui/avatar'
import { LogOut, User2, Bookmark } from 'lucide-react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
    }

    const navLinkClass = ({ isActive }) =>
        `relative py-1 transition-colors after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:bg-[#6A38C2] after:transition-all ${
            isActive
                ? 'text-[#6A38C2] font-bold after:w-full'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white after:w-0'
        }`;

    return (
        <div className='bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm sticky top-0 z-20'>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-16 px-4'>
                <Link to="/" className='flex items-center gap-1'>
                    <h1 className='text-2xl font-extrabold tracking-tight dark:text-white'>Hire<span className='text-[#F83002]'>Loop</span></h1>
                </Link>
                <div className='flex items-center gap-8'>
                    <ul className='hidden md:flex font-medium items-center gap-6 text-sm'>
                        {
                            user && user.role === 'recruiter' ? (
                                <>
                                    <li><NavLink to="/admin/companies" className={navLinkClass}>Companies</NavLink></li>
                                    <li><NavLink to="/admin/jobs" className={navLinkClass}>Jobs</NavLink></li>
                                </>
                            ) : (
                                <>
                                    <li><NavLink to="/" end className={navLinkClass}>Home</NavLink></li>
                                    <li><NavLink to="/jobs" className={navLinkClass}>Jobs</NavLink></li>
                                    <li><NavLink to="/browse" className={navLinkClass}>Browse</NavLink></li>
                                </>
                            )
                        }
                    </ul>
                    <div className='flex items-center gap-3'>
                        {
                            !user ? (
                                <div className='flex items-center gap-2'>
                                    <Link to="/login"><Button variant="outline">Login</Button></Link>
                                    <Link to="/signup"><Button className="bg-[#6A38C2] hover:bg-[#5b30a6] shadow-sm">Signup</Button></Link>
                                </div>
                            ) : (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Avatar className="cursor-pointer h-9 w-9 ring-2 ring-transparent hover:ring-[#6A38C2] transition-all">
                                            <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} />
                                        </Avatar>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-72 p-0 overflow-hidden dark:bg-gray-900 dark:border-gray-700 shadow-xl">
                                        <div className='bg-gradient-to-r from-[#6A38C2] to-[#F83002] p-4'>
                                            <div className='flex items-center gap-3'>
                                                <Avatar className="h-11 w-11 ring-2 ring-white/70">
                                                    <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} />
                                                </Avatar>
                                                <div className='min-w-0'>
                                                    <h4 className='font-bold text-white truncate'>{user?.fullname}</h4>
                                                    <p className='text-xs text-white/80 truncate'>{user?.email}</p>
                                                </div>
                                            </div>
                                            <span className='inline-block mt-3 text-[10px] font-bold uppercase tracking-wide bg-white/20 text-white px-2 py-1 rounded-full'>
                                                {user?.role}
                                            </span>
                                        </div>
                                        <div className='p-2'>
                                            {
                                                user && user.role === 'student' && (
                                                    <>
                                                        <Link
                                                            to="/profile"
                                                            className='flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'
                                                        >
                                                            <User2 className='h-4 w-4 text-[#6A38C2]' />
                                                            View Profile
                                                        </Link>
                                                        <Link
                                                            to="/saved-jobs"
                                                            className='flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'
                                                        >
                                                            <Bookmark className='h-4 w-4 text-[#6A38C2]' />
                                                            Saved Jobs
                                                        </Link>
                                                    </>
                                                )
                                            }
                                            <button
                                                onClick={logoutHandler}
                                                className='flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-red-50 dark:hover:bg-gray-800 hover:text-red-600 transition-colors'
                                            >
                                                <LogOut className='h-4 w-4' />
                                                Logout
                                            </button>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar
