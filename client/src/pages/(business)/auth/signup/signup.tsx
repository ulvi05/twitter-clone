import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

import { MdOutlineMail, MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import XSvg from "@/components/svgs/X";
import { FaUser } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import authService from "@/services/auth";
import { AxiosError } from "axios";
import { AuthResponseType } from "@/services/auth/types";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";

const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(15, "Username must be at most 15 characters")
    .regex(
      /^[a-z0-9]+$/,
      "Username must only contain lowercase letters and numbers"
    ),
  fullName: z
    .string()
    .min(3, "Full name must be at least 3 characters")
    .regex(/^[A-Za-z\s]+$/, "Full name must only contain letters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must be at most 20 characters"),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

const SignUp = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: authService.register,
    onSuccess: (response) => {
      toast.success(response.data.message);
      navigate("/login");
      reset();
    },
    onError: (error: AxiosError<AuthResponseType>) => {
      console.log(error.response?.data.message);
      const message =
        error.response?.data.message ??
        "Something went wrong! Please try again";
      toast.error(message);
    },
  });

  const onSubmit = (values: SignUpFormValues) => {
    mutate(values);
  };

  return (
    <div className="flex h-screen max-w-screen-xl px-10 mx-auto">
      <Helmet>
        <title>X. Here's what happened / X</title>
      </Helmet>
      <div className="items-center justify-center flex-1 hidden lg:flex">
        <XSvg className=" lg:w-2/3 fill-white" />
      </div>
      <div className="flex flex-col items-center justify-center flex-1">
        <form
          className="flex flex-col gap-4 mx-auto lg:w-2/3 md:mx-20"
          onSubmit={handleSubmit(onSubmit)}
        >
          <XSvg className="w-24 lg:hidden fill-white" />
          <h1 className="text-[#E7E9EA] font-extrabold text-3xl lg:text-6xl mt-5 mb-5 w-full">
            Happening now
          </h1>
          <h1 className="text-3xl font-extrabold text-[#E7E9EA]">
            Join today.
          </h1>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 rounded input input-bordered">
                <MdOutlineMail />
                <input
                  type="email"
                  className="grow"
                  placeholder="Email"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <span className="text-xs text-red-500">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col flex-1">
                <div className="flex items-center gap-2 rounded input input-bordered">
                  <FaUser />
                  <input
                    type="text"
                    className="grow"
                    placeholder="Username"
                    {...register("username")}
                  />
                </div>
                {errors.username && (
                  <span className="mt-1 text-xs text-red-500">
                    {errors.username.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col flex-1">
                <div className="flex items-center gap-2 rounded input input-bordered">
                  <MdDriveFileRenameOutline />
                  <input
                    type="text"
                    className="grow"
                    placeholder="Full Name"
                    {...register("fullName")}
                  />
                </div>
                {errors.fullName && (
                  <span className="mt-1 text-xs text-red-500">
                    {errors.fullName.message}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2 rounded input input-bordered">
                <MdPassword />
                <input
                  type="password"
                  className="grow"
                  placeholder="Password"
                  {...register("password")}
                />
              </div>
              {errors.password && (
                <span className="text-xs text-red-500">
                  {errors.password.message}
                </span>
              )}
            </div>

            <button
              className="text-white rounded-full btn btn-primary"
              disabled={isPending}
            >
              Sign up
            </button>
          </div>
        </form>

        <div className="flex flex-col gap-2 mt-4 lg:w-2/3">
          <p className="text-lg text-white">Already have an account?</p>
          <Link to="/login">
            <button className="w-full text-white rounded-full btn btn-primary btn-outline">
              Sign in
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
