import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { Building2 } from 'lucide-react'

const LatestJobCards = ({ job }) => {
    const navigate = useNavigate();
    return (
        <div
            onClick={() => navigate(`/description/${job._id}`)}
            className='p-5 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-200 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 cursor-pointer'
        >
            <div className='flex items-center gap-3'>
                <div className='h-10 w-10 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 flex items-center justify-center overflow-hidden shrink-0'>
                    {
                        job?.company?.logo ? (
                            <img src={job.company.logo} alt={job?.company?.name} className='h-full w-full object-cover' />
                        ) : (
                            <Building2 className='h-4 w-4 text-gray-400' />
                        )
                    }
                </div>
                <div>
                    <h1 className='font-semibold text-lg dark:text-white'>{job?.company?.name}</h1>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>India</p>
                </div>
            </div>
            <div className='mt-3'>
                <h1 className='font-bold text-lg my-1 dark:text-white'>{job?.title}</h1>
                <p className='text-sm text-gray-600 dark:text-gray-400 line-clamp-2'>{job?.description}</p>
            </div>
            <div className='flex items-center gap-2 mt-4 flex-wrap'>
                <Badge className={'text-blue-700 font-bold bg-blue-50'} variant="ghost">{job?.position} Positions</Badge>
                <Badge className={'text-[#F83002] font-bold bg-red-50'} variant="ghost">{job?.jobType}</Badge>
                <Badge className={'text-[#7209b7] font-bold bg-purple-50'} variant="ghost">{job?.salary}LPA</Badge>
            </div>
        </div>
    )
}

export default LatestJobCards
