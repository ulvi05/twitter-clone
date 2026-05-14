import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import authService from "@/services/auth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { AuthResponseType } from "@/services/auth/types";
import { MdOutlineMail } from "react-icons/md";
import XSvg from "@/components/svgs/X";

const formSchema = z.object({
  email: z.string().email("Lütfen geçerli bir e-posta girin").min(2).max(50),
});

const ForgotPassword = () => {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: authService.ForgotPassword,
    onSuccess: (response) => {
      toast.success(response.data.message);
      form.reset();
      navigate("/login");
    },
    onError: (error: AxiosError<AuthResponseType>) => {
      const message =
        error.response?.data.message ??
        "Something went wrong! Please try again";
      toast.error(message);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values);
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
            Forgot your password?
          </h1>
          <p className="text-sm text-center text-gray-400">
            Enter your email address and we will send you a password reset link.
          </p>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-white rounded input input-bordered">
              <MdOutlineMail />
              <input
                type="email"
                className="bg-transparent grow focus:outline-none"
                placeholder="Email"
                {...form.register("email")}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full text-white rounded-full btn btn-primary"
            disabled={isPending}
          >
            {isPending ? "Sending..." : "Send Mail"}
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

export default ForgotPassword;
