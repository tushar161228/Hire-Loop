import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useSelector } from 'react-redux'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Loader2 } from 'lucide-react'

const EditJob = () => {
    const params = useParams();
    const jobId = params.id;
    const navigate = useNavigate();

    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "",
        experience: "",
        position: 0,
        companyId: ""
    });
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const { companies } = useSelector(store => store.company);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const selectChangeHandler = (value) => {
        const selectedCompany = companies.find((company) => company.name.toLowerCase() === value);
        setInput({ ...input, companyId: selectedCompany._id });
    };

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true });
                if (res.data.success) {
                    const job = res.data.job;
                    setInput({
                        title: job.title || "",
                        description: job.description || "",
                        requirements: job.requirements?.join(",") || "",
                        salary: job.salary || "",
                        location: job.location || "",
                        jobType: job.jobType || "",
                        experience: job.experienceLevel || "",
                        position: job.position || 0,
                        companyId: job.company?._id || ""
                    });
                }
            } catch (error) {
                console.log(error);
                toast.error(error?.response?.data?.message || "Failed to load job");
            } finally {
                setFetching(false);
            }
        }
        fetchJob();
    }, [jobId]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.put(`${JOB_API_END_POINT}/update/${jobId}`, input, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/jobs");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    const currentCompanyName = companies.find(c => c._id === input.companyId)?.name;

    if (fetching) {
        return (
            <div className='dark:bg-gray-950 min-h-screen'>
                <Navbar />
                <div className='flex items-center justify-center h-[60vh]'>
                    <Loader2 className='h-6 w-6 animate-spin text-[#6A38C2]' />
                </div>
            </div>
        )
    }

    return (
        <div className='dark:bg-gray-950 min-h-screen transition-colors'>
            <Navbar />
            <div className='max-w-4xl mx-auto my-8 px-4'>
                <button
                    onClick={() => navigate('/admin/jobs')}
                    className='flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors'
                >
                    <ArrowLeft className='h-4 w-4' /> Back to jobs
                </button>
                <form onSubmit={submitHandler} className='p-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-2xl'>
                    <h1 className='font-extrabold text-2xl mb-6 dark:text-white'>Edit Job</h1>
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <Label className="font-bold dark:text-gray-200">Title</Label>
                            <Input
                                type="text"
                                name="title"
                                value={input.title}
                                onChange={changeEventHandler}
                                className="my-1 dark:bg-gray-900 dark:border-gray-600 dark:text-white"
                            />
                        </div>
                        <div>
                            <Label className="font-bold dark:text-gray-200">Description</Label>
                            <Input
                                type="text"
                                name="description"
                                value={input.description}
                                onChange={changeEventHandler}
                                className="my-1 dark:bg-gray-900 dark:border-gray-600 dark:text-white"
                            />
                        </div>
                        <div>
                            <Label className="font-bold dark:text-gray-200">Requirements</Label>
                            <Input
                                type="text"
                                name="requirements"
                                value={input.requirements}
                                onChange={changeEventHandler}
                                className="my-1 dark:bg-gray-900 dark:border-gray-600 dark:text-white"
                            />
                        </div>
                        <div>
                            <Label className="font-bold dark:text-gray-200">Salary (LPA)</Label>
                            <Input
                                type="text"
                                name="salary"
                                value={input.salary}
                                onChange={changeEventHandler}
                                className="my-1 dark:bg-gray-900 dark:border-gray-600 dark:text-white"
                            />
                        </div>
                        <div>
                            <Label className="font-bold dark:text-gray-200">Location</Label>
                            <Input
                                type="text"
                                name="location"
                                value={input.location}
                                onChange={changeEventHandler}
                                className="my-1 dark:bg-gray-900 dark:border-gray-600 dark:text-white"
                            />
                        </div>
                        <div>
                            <Label className="font-bold dark:text-gray-200">Job Type</Label>
                            <Input
                                type="text"
                                name="jobType"
                                value={input.jobType}
                                onChange={changeEventHandler}
                                className="my-1 dark:bg-gray-900 dark:border-gray-600 dark:text-white"
                            />
                        </div>
                        <div>
                            <Label className="font-bold dark:text-gray-200">Experience Level (yrs)</Label>
                            <Input
                                type="text"
                                name="experience"
                                value={input.experience}
                                onChange={changeEventHandler}
                                className="my-1 dark:bg-gray-900 dark:border-gray-600 dark:text-white"
                            />
                        </div>
                        <div>
                            <Label className="font-bold dark:text-gray-200">No of Positions</Label>
                            <Input
                                type="number"
                                name="position"
                                value={input.position}
                                onChange={changeEventHandler}
                                className="my-1 dark:bg-gray-900 dark:border-gray-600 dark:text-white"
                            />
                        </div>
                        {
                            companies.length > 0 && (
                                <div>
                                    <Label className="font-bold dark:text-gray-200 block mb-1">Company</Label>
                                    <Select onValueChange={selectChangeHandler} defaultValue={currentCompanyName?.toLowerCase()}>
                                        <SelectTrigger className="w-full dark:bg-gray-900 dark:border-gray-600 dark:text-white">
                                            <SelectValue placeholder={currentCompanyName || "Select a Company"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {
                                                    companies.map((company) => (
                                                        <SelectItem key={company._id} value={company?.name?.toLowerCase()}>{company.name}</SelectItem>
                                                    ))
                                                }
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )
                        }
                    </div>
                    {
                        loading ? (
                            <Button className="w-full my-6 bg-[#6A38C2] font-bold">
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Saving
                            </Button>
                        ) : (
                            <Button type="submit" className="w-full my-6 bg-[#6A38C2] hover:bg-[#5b30a6] font-bold shadow-md">
                                Save Changes
                            </Button>
                        )
                    }
                </form>
            </div>
        </div>
    )
}

export default EditJob
