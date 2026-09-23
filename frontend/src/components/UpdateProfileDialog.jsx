import React, { useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Avatar, AvatarImage } from './ui/avatar'
import { Loader2, User, Mail, Phone, FileText, Code2, Linkedin, Github, MapPin, Paperclip } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const fieldWrap = "flex items-center gap-2 mb-1.5 text-sm font-bold text-gray-700 dark:text-gray-200";
const inputClass = "text-base py-5 dark:bg-gray-900 dark:border-gray-600 dark:text-white";

const UpdateProfileDialog = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);

    const [input, setInput] = useState({
        fullname: user?.fullname || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        bio: user?.profile?.bio || "",
        skills: user?.profile?.skills?.join(", ") || "",
        location: user?.profile?.location || "",
        linkedin: user?.profile?.linkedin || "",
        github: user?.profile?.github || "",
        file: null,
    });
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file })
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("bio", input.bio);
        formData.append("skills", input.skills);
        formData.append("location", input.location);
        formData.append("linkedin", input.linkedin);
        formData.append("github", input.github);
        if (input.file) {
            formData.append("file", input.file);
        }
        try {
            setLoading(true);
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success(res.data.message);
                setOpen(false);
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[560px] p-0 overflow-hidden dark:bg-gray-900 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
                <div className='bg-gradient-to-r from-[#6A38C2] to-[#F83002] p-6'>
                    <DialogHeader>
                        <DialogTitle className="text-white text-2xl font-extrabold">Update Profile</DialogTitle>
                    </DialogHeader>
                    <div className='flex items-center gap-4 mt-4'>
                        <Avatar className="h-16 w-16 ring-4 ring-white/40">
                            <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} />
                        </Avatar>
                        <div>
                            <p className='text-white font-bold text-lg'>{user?.fullname}</p>
                            <p className='text-white/80 text-sm'>{user?.role === 'student' ? 'Job Seeker' : 'Recruiter'}</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={submitHandler} className='p-6'>
                    <div className='grid gap-5'>
                        <div>
                            <Label className={fieldWrap}><User className='h-4 w-4 text-[#6A38C2]' /> Full Name</Label>
                            <Input
                                name="fullname"
                                type="text"
                                value={input.fullname}
                                onChange={changeEventHandler}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <Label className={fieldWrap}><Mail className='h-4 w-4 text-[#6A38C2]' /> Email</Label>
                            <Input
                                name="email"
                                type="email"
                                value={input.email}
                                onChange={changeEventHandler}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <Label className={fieldWrap}><Phone className='h-4 w-4 text-[#6A38C2]' /> Phone Number</Label>
                            <Input
                                name="phoneNumber"
                                value={input.phoneNumber}
                                onChange={changeEventHandler}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <Label className={fieldWrap}><MapPin className='h-4 w-4 text-[#6A38C2]' /> Location</Label>
                            <Input
                                name="location"
                                placeholder="e.g. Bangalore, India"
                                value={input.location}
                                onChange={changeEventHandler}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <Label className={fieldWrap}><FileText className='h-4 w-4 text-[#6A38C2]' /> Bio</Label>
                            <Input
                                name="bio"
                                placeholder="A short line about yourself"
                                value={input.bio}
                                onChange={changeEventHandler}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <Label className={fieldWrap}><Code2 className='h-4 w-4 text-[#6A38C2]' /> Skills</Label>
                            <Input
                                name="skills"
                                placeholder="e.g. React, Node.js, MongoDB"
                                value={input.skills}
                                onChange={changeEventHandler}
                                className={inputClass}
                            />
                        </div>
                        <div className='grid grid-cols-2 gap-4'>
                            <div>
                                <Label className={fieldWrap}><Linkedin className='h-4 w-4 text-[#6A38C2]' /> LinkedIn</Label>
                                <Input
                                    name="linkedin"
                                    placeholder="Profile URL"
                                    value={input.linkedin}
                                    onChange={changeEventHandler}
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <Label className={fieldWrap}><Github className='h-4 w-4 text-[#6A38C2]' /> GitHub</Label>
                                <Input
                                    name="github"
                                    placeholder="Profile URL"
                                    value={input.github}
                                    onChange={changeEventHandler}
                                    className={inputClass}
                                />
                            </div>
                        </div>
                        <div>
                            <Label className={fieldWrap}><Paperclip className='h-4 w-4 text-[#6A38C2]' /> Resume (PDF)</Label>
                            <Input
                                type="file"
                                accept="application/pdf"
                                onChange={fileChangeHandler}
                                className="dark:text-gray-300 file:text-[#6A38C2] file:font-semibold"
                            />
                        </div>
                    </div>
                    <DialogFooter className="mt-6">
                        {
                            loading ? (
                                <Button className="w-full py-5 text-base font-bold bg-[#6A38C2]">
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait
                                </Button>
                            ) : (
                                <Button type="submit" className="w-full py-5 text-base font-bold bg-[#6A38C2] hover:bg-[#5b30a6] shadow-md">
                                    Save Changes
                                </Button>
                            )
                        }
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default UpdateProfileDialog
