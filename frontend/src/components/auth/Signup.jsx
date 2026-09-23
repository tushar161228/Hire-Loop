import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";

const Signup = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    file: "",
  });

  const { loading, user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const changeFileHandler = (e) => {
    setInput({
      ...input,
      file: e.target.files?.[0],
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (input.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    const formData = new FormData();

    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("password", input.password);
    formData.append("role", input.role);

    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      dispatch(setLoading(true));

      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);

      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div>
      <Navbar />

      <div className="flex items-center justify-center min-h-[85vh] px-4">
        <form
          onSubmit={submitHandler}
          className="w-full max-w-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl rounded-2xl p-8 my-10"
        >
          <h1 className="font-extrabold text-2xl mb-6 text-center dark:text-white">
            Create Your Account
          </h1>

          {/* FULL NAME */}
          <div className="my-3">
            <Label className="font-bold">Full Name</Label>

            <Input
              type="text"
              value={input.fullname}
              name="fullname"
              onChange={changeEventHandler}
              placeholder="John Doe"
              className="dark:bg-gray-900 dark:border-gray-600 dark:text-white mt-1"
            />
          </div>

          {/* EMAIL */}
          <div className="my-3">
            <Label className="font-bold">Email</Label>

            <Input
              type="email"
              value={input.email}
              name="email"
              onChange={changeEventHandler}
              placeholder="you@example.com"
              className="dark:bg-gray-900 dark:border-gray-600 dark:text-white mt-1"
            />
          </div>

          {/* PHONE NUMBER */}
          <div className="my-3">
            <Label className="font-bold">Phone Number</Label>

            <Input
              type="text"
              value={input.phoneNumber}
              name="phoneNumber"
              onChange={changeEventHandler}
              placeholder="8080808080"
              className="dark:bg-gray-900 dark:border-gray-600 dark:text-white mt-1"
            />
          </div>

          {/* PASSWORD */}
          <div className="my-3">
            <Label className="font-bold">Password</Label>

            <Input
              type="password"
              value={input.password}
              name="password"
              onChange={changeEventHandler}
              placeholder="Create a password"
              minLength={6}
              className="dark:bg-gray-900 dark:border-gray-600 dark:text-white mt-1"
            />
            <p className="text-xs text-gray-400 mt-1">Minimum 6 characters</p>
          </div>

          {/* ROLE + PROFILE */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <RadioGroup className="flex items-center gap-4 my-5">
              {/* STUDENT */}
              <div className="flex items-center space-x-2">
                <Input
                  type="radio"
                  name="role"
                  value="student"
                  checked={input.role === "student"}
                  onChange={changeEventHandler}
                  className="cursor-pointer accent-[#6A38C2] w-4 h-4"
                />

                <Label htmlFor="r1" className="font-semibold">
                  Student
                </Label>
              </div>

              {/* RECRUITER */}
              <div className="flex items-center space-x-2">
                <Input
                  type="radio"
                  name="role"
                  value="recruiter"
                  checked={input.role === "recruiter"}
                  onChange={changeEventHandler}
                  className="cursor-pointer accent-[#6A38C2] w-4 h-4"
                />

                <Label htmlFor="r2" className="font-semibold">
                  Recruiter
                </Label>
              </div>
            </RadioGroup>

            {/* PROFILE */}
            <div className="flex items-center gap-2">
              <Label className="font-bold">Profile</Label>

              <Input
                accept="image/*"
                type="file"
                onChange={changeFileHandler}
                className="cursor-pointer dark:text-gray-300"
              />
            </div>
          </div>

          {/* SIGNUP BUTTON */}
          {loading ? (
            <Button className="w-full my-4 bg-[#6A38C2] hover:bg-[#5b30a6] font-bold">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full my-4 bg-[#6A38C2] hover:bg-[#5b30a6] font-bold shadow-md"
            >
              Signup
            </Button>
          )}

          <span className="text-sm dark:text-gray-300">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#6A38C2] font-semibold hover:underline"
            >
              Login
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Signup;
