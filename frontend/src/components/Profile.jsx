import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen, MapPin, Linkedin, Github, Code2 } from 'lucide-react'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import AppliedJobTable from './AppliedJobTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector } from 'react-redux'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'

const Profile = () => {
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);

    return (
        <div className='dark:bg-gray-950 min-h-screen transition-colors'>
            <Navbar />
            <div className='max-w-4xl mx-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl my-5 overflow-hidden shadow-lg'>
                <div className='h-24 bg-gradient-to-r from-[#6A38C2] to-[#F83002]'></div>
                <div className='px-8 pb-8'>
                    <div className='flex justify-between items-start -mt-12'>
                        <div className='flex items-end gap-4'>
                            <Avatar className="h-24 w-24 ring-4 ring-white dark:ring-gray-800">
                                <AvatarImage src={user?.profile?.profilePhoto || "https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg"} alt="profile" />
                            </Avatar>
                        </div>
                        <Button onClick={() => setOpen(true)} className="mt-14 bg-[#6A38C2] hover:bg-[#5b30a6] font-bold shadow-md gap-2">
                            <Pen className='h-4 w-4' /> Edit Profile
                        </Button>
                    </div>

                    <div className='mt-3'>
                        <h1 className='font-extrabold text-2xl dark:text-white'>{user?.fullname}</h1>
                        <p className='text-gray-600 dark:text-gray-300 mt-1'>{user?.profile?.bio || "No bio added yet."}</p>
                        {
                            user?.profile?.location && (
                                <p className='flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mt-2'>
                                    <MapPin className='h-4 w-4' /> {user.profile.location}
                                </p>
                            )
                        }
                    </div>

                    <div className='flex flex-wrap gap-4 my-5'>
                        <div className='flex items-center gap-3 text-base font-medium dark:text-gray-200'>
                            <Mail className='h-5 w-5 text-[#6A38C2]' />
                            <span>{user?.email}</span>
                        </div>
                        <div className='flex items-center gap-3 text-base font-medium dark:text-gray-200'>
                            <Contact className='h-5 w-5 text-[#6A38C2]' />
                            <span>{user?.phoneNumber}</span>
                        </div>
                    </div>

                    {
                        (user?.profile?.linkedin || user?.profile?.github) && (
                            <div className='flex flex-wrap gap-3 mb-5'>
                                {
                                    user?.profile?.linkedin && (
                                        <a href={user.profile.linkedin} target="_blank" rel="noopener noreferrer"
                                            className='flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:underline'>
                                            <Linkedin className='h-4 w-4' /> LinkedIn
                                        </a>
                                    )
                                }
                                {
                                    user?.profile?.github && (
                                        <a href={user.profile.github} target="_blank" rel="noopener noreferrer"
                                            className='flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:underline'>
                                            <Github className='h-4 w-4' /> GitHub
                                        </a>
                                    )
                                }
                            </div>
                        )
                    }

                    <div className='my-5'>
                        <h1 className='font-bold text-lg flex items-center gap-2 dark:text-white mb-3'>
                            <Code2 className='h-5 w-5 text-[#6A38C2]' /> Skills
                        </h1>
                        <div className='flex items-center gap-2 flex-wrap'>
                            {
                                user?.profile?.skills?.length > 0
                                    ? user.profile.skills.map((item, index) => (
                                        <Badge key={index} className="text-sm font-bold px-3 py-1.5 bg-purple-50 dark:bg-purple-950 text-[#6A38C2] dark:text-purple-300" variant="ghost">
                                            {item}
                                        </Badge>
                                    ))
                                    : <span className='text-gray-400 text-sm'>No skills added yet</span>
                            }
                        </div>
                    </div>

                    <div className='grid w-full max-w-sm items-center gap-1.5'>
                        <Label className="text-base font-bold dark:text-white">Resume</Label>
                        {
                            user?.profile?.resume
                                ? <a target='_blank' rel="noopener noreferrer" href={user.profile.resume} className='text-blue-500 dark:text-blue-400 w-full font-medium hover:underline cursor-pointer'>{user.profile.resumeOriginalName}</a>
                                : <span className='text-gray-400 text-sm'>No resume uploaded</span>
                        }
                    </div>
                </div>
            </div>
            <div className='max-w-4xl mx-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-lg mb-10'>
                <h1 className='font-extrabold text-lg my-3 dark:text-white px-2'>Applied Jobs</h1>
                <AppliedJobTable />
            </div>
            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    )
}

export default Profile
