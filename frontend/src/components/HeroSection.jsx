import React, { useState } from 'react'
import { Button } from './ui/button'
import { Search } from 'lucide-react'
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = () => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }

    return (
        <div className='text-center'>
            <div className='flex flex-col gap-5 my-10'>
                <span className='mx-auto px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-[#F83002] font-semibold'>No. 1 Job Hunt Website</span>
                <h1 className='text-5xl font-extrabold dark:text-white'>Explore Roles, Apply Fast & <br /> Land Your <span className='text-[#6A38C2]'>Next Big Opportunity</span></h1>
                <p className='text-gray-600 dark:text-gray-400'>Thousands of companies are hiring right now — find the role that fits you best.</p>
                <div className='flex w-[90%] sm:w-[60%] md:w-[40%] shadow-lg border border-gray-200 dark:border-gray-700 bg-white pl-3 rounded-full items-center gap-4 mx-auto'>
                    <input
                        type="text"
                        placeholder='Find your dream jobs'
                        onChange={(e) => setQuery(e.target.value)}
                        className='outline-none border-none w-full bg-white text-gray-900 placeholder-gray-500'
                    />
                    <Button onClick={searchJobHandler} className="rounded-r-full bg-[#6A38C2] hover:bg-[#5b30a6]">
                        <Search className='h-5 w-5' />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default HeroSection
