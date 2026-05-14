import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import authService from "@/services/auth";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { AxiosError } from "axios";
import { AuthResponseType } from "@/services/auth/types";
import XSvg from "@/components/svgs/X";
import { MdPassword } from "react-icons/md";
import { useEffect } from "react";

const formSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: authService.ResetPassword,
    onSuccess: (response) => {
      toast.success(response.data.message);
      navigate("/login");
    },
    onError: (error: AxiosError<AuthResponseType>) => {
      const message =
        error.response?.data?.message ??
        "Something went wrong! Please try again.";
      toast.error(message);
    },
  });

  useEffect(() => {
    if (!token) {
      navigate("/forgot-password", { replace: true });
    }
  }, [token, navigate]);

  if (!token) return null;

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!token) {
      toast.error("Invalid or expired token");
      return;
    }
    mutate({ password: values.password, token });
  }

  return (
    <div className="flex h-screen max-w-screen-xl mx-auto">
      <div className="items-center justify-center flex-1 hidden lg:flex">
        <XSvg className="lg:w-2/3 fill-white" />
      </div>
      <div className="flex flex-col items-center justify-center flex-1">
        <form
          className="flex flex-col w-full max-w-sm gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <XSvg className="w-24 lg:hidden fill-white" />
          <h1 className="text-3xl font-bold text-center text-white">
            Reset your password
          </h1>
          <p className="text-sm text-center text-gray-400">
            Enter your new password below.
          </p>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-white rounded input input-bordered">
              <MdPassword />
              <input
                type="password"
                className="bg-transparent grow focus:outline-none"
                placeholder="New Password"
                {...form.register("password")}
              />
            </div>
            <p className="text-xs text-red-500">
              {form.formState.errors.password?.message}
            </p>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-white rounded input input-bordered">
              <MdPassword />
              <input
                type="password"
                className="bg-transparent grow focus:outline-none"
                placeholder="Confirm Password"
                {...form.register("confirmPassword")}
              />
            </div>
            <p className="text-xs text-red-500">
              {form.formState.errors.confirmPassword?.message}
            </p>
          </div>

          <button
            type="submit"
            className="w-full text-white rounded-full btn btn-primary"
            disabled={isPending}
          >
            {isPending ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <a href="/login" className="text-primary hover:underline">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
