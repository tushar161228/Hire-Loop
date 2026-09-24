import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Bookmark } from 'lucide-react'
import { Avatar, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'

const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;
    return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
}

const getSavedJobs = (userId) => {
    try {
        return JSON.parse(localStorage.getItem(`savedJobs_${userId}`)) || [];
    } catch {
        return [];
    }
}

const Job = ({ job }) => {
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        if (!user?._id) return;
        const saved = getSavedJobs(user._id);
        setIsSaved(saved.includes(job?._id));
    }, [job?._id, user?._id]);

    const toggleSave = (e) => {
        e.stopPropagation();
        if (!user?._id) {
            toast.error("Please login to save jobs");
            return;
        }
        const saved = getSavedJobs(user._id);
        let updated;
        if (saved.includes(job?._id)) {
            updated = saved.filter((id) => id !== job._id);
            toast.success("Removed from saved jobs");
        } else {
            updated = [...saved, job._id];
            toast.success("Job saved");
        }
        localStorage.setItem(`savedJobs_${user._id}`, JSON.stringify(updated));
        setIsSaved(updated.includes(job?._id));
    }

    return (
        <div className='p-5 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-200 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700'>
            <div className='flex items-center justify-between'>
                <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>{daysAgoFunction(job?.createdAt) === 0 ? "Today" : `${daysAgoFunction(job?.createdAt)} days ago`}</p>
                <Button
                    onClick={toggleSave}
                    variant="outline"
                    className={`rounded-full ${isSaved ? 'border-[#6A38C2]' : ''}`}
                    size="icon"
                >
                    <Bookmark className={isSaved ? 'fill-[#6A38C2] text-[#6A38C2]' : 'text-gray-500 dark:text-gray-400'} />
                </Button>
            </div>

            <div className='flex items-center gap-2 my-2'>
                <Button className="p-6" variant="outline" size="icon">
                    <Avatar>
                        <AvatarImage src={job?.company?.logo} />
                    </Avatar>
                </Button>
                <div>
                    <h1 className='font-semibold text-lg dark:text-white'>{job?.company?.name}</h1>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>India</p>
                </div>
            </div>

            <div>
                <h1 className='font-bold text-lg my-2 dark:text-white'>{job?.title}</h1>
                <p className='text-sm text-gray-600 dark:text-gray-400 line-clamp-2'>{job?.description}</p>
            </div>
            <div className='flex items-center gap-2 mt-4 flex-wrap'>
                <Badge className={'text-blue-700 font-bold bg-blue-50'} variant="ghost">{job?.position} Positions</Badge>
                <Badge className={'text-[#F83002] font-bold bg-red-50'} variant="ghost">{job?.jobType}</Badge>
                <Badge className={'text-[#7209b7] font-bold bg-purple-50'} variant="ghost">{job?.salary}LPA</Badge>
            </div>
            <div className='flex items-center gap-4 mt-4'>
                <Button onClick={() => navigate(`/description/${job?._id}`)} variant="outline" className="dark:border-gray-600 dark:text-white">Details</Button>
                <Button
                    onClick={toggleSave}
                    className={`shadow-sm ${isSaved ? 'bg-gray-400 hover:bg-gray-500' : 'bg-[#7209b7] hover:bg-[#5f32ad]'}`}
                >
                    {isSaved ? 'Saved' : 'Save For Later'}
                </Button>
            </div>
        </div>
    )
}

export default Job
