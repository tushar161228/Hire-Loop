import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job'
import { useSelector } from 'react-redux'
import { Bookmark } from 'lucide-react'
import useGetAllJobs from '@/hooks/useGetAllJobs'

const getSavedJobIds = (userId) => {
    try {
        return JSON.parse(localStorage.getItem(`savedJobs_${userId}`)) || [];
    } catch {
        return [];
    }
}

const SavedJobs = () => {
    useGetAllJobs();
    const { allJobs } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);
    const [savedJobs, setSavedJobs] = useState([]);

    useEffect(() => {
        if (!user?._id) return;
        const ids = getSavedJobIds(user._id);
        const filtered = allJobs.filter((job) => ids.includes(job._id));
        setSavedJobs(filtered);
    }, [allJobs, user?._id]);

    return (
        <div className='dark:bg-gray-950 min-h-screen transition-colors'>
            <Navbar />
            <div className='max-w-7xl mx-auto px-4 py-8'>
                <h1 className='font-extrabold text-2xl dark:text-white flex items-center gap-2 mb-6'>
                    <Bookmark className='h-6 w-6 text-[#6A38C2]' /> Saved Jobs
                </h1>
                {
                    savedJobs.length === 0 ? (
                        <div className='text-center py-20'>
                            <Bookmark className='h-10 w-10 text-gray-300 dark:text-gray-700 mx-auto mb-3' />
                            <p className='text-gray-500 dark:text-gray-400'>You haven't saved any jobs yet.</p>
                            <p className='text-gray-400 dark:text-gray-500 text-sm mt-1'>Click the bookmark icon on any job to save it here.</p>
                        </div>
                    ) : (
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                            {
                                savedJobs.map((job) => (
                                    <Job key={job._id} job={job} />
                                ))
                            }
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default SavedJobs
