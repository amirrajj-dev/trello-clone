"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema, SignUpType } from "@/validations/auth/register.validation";
import { useSignup } from "@/hooks/mutations/signup";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import Logo from "@/components/common/logo/Logo";
import Link from "next/link";

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpType>({
    resolver: zodResolver(schema),
  });
  const { mutateAsync: signup, isPending: isLoading } = useSignup();
  const router = useRouter();
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const onSubmit = async (data: SignUpType) => {
    try {
      await signup(data);
      toast.success("Account created successfully!");
      setTimeout(() => {
        router.push("/");
      }, 5000);
    } catch (error: any) {
        console.log(error);
      toast.error(error.message || "Failed to sign up" , {duration : 100000});
    }
  };

  return (
    <div className="min-h-screen flex flex-col gap-3 p-2 items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Logo size="text-3xl" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="card w-full max-w-md bg-base-200 shadow-xl"
      >
        <div className="card-body">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="card-title text-2xl font-bold text-center mx-auto text-transparent bg-clip-text bg-gradient-to-tr from-primary to-accent"
          >
            Sign Up
          </motion.h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col gap-1">
              <motion.label
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 1.1 }}
                className="label"
              >
                <span className="label-text">Name</span>
              </motion.label>
              <motion.div
                className="relative"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="input focus:outline-none w-full pl-10"
                  {...register("name")}
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-base-content/50 z-10" />
              </motion.div>
              {errors.name && (
                <span className="text-error text-sm">
                  {errors.name.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <motion.label
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 1.4 }}
                className="label"
              >
                <span className="label-text">Email</span>
              </motion.label>
              <motion.div
                className="relative"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.5 }}
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="input focus:outline-none w-full pl-10"
                  {...register("email")}
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-base-content/50 z-10" />
              </motion.div>
              {errors.email && (
                <span className="text-error text-sm">
                  {errors.email.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <motion.label
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 1.7 }}
                className="label"
              >
                <span className="label-text">Password</span>
              </motion.label>
              <motion.div
                className="relative"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.8 }}
              >
                <input
                  type={`${isPasswordVisible ? "text" : "password"}`}
                  placeholder="Enter your password"
                  className="input focus:outline-none w-full pl-10"
                  {...register("password")}
                />
                {isPasswordVisible ? (
                  <EyeOff
                    className="size-5 absolute top-1/2 right-3 z-10 -translate-y-1/2 text-base-content/50"
                    onClick={() => setIsPasswordVisible(false)}
                  />
                ) : (
                  <Eye
                    className="size-5 absolute top-1/2 right-3 z-10 -translate-y-1/2 text-base-content/50"
                    onClick={() => setIsPasswordVisible(true)}
                  />
                )}
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-base-content/50 z-10" />
              </motion.div>
              {errors.password && (
                <span className="text-error text-sm">
                  {errors.password.message}
                </span>
              )}
            </div>
            <div className="form-control mt-6">
              <motion.button
                type="submit"
                className="btn bg-gradient-to-r from-primary to-accent text-base-300 rounded-md disabled:cursor-not-allowed w-full"
                disabled={isSubmitting || isLoading}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 2 }}
                whileTap={{ scale: 0.95 }}
              >
                {isSubmitting || isLoading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Sign Up"
                )}
              </motion.button>
            </div>
          </form>
          <div className="text-center mt-4">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 2.2 }}
              className="text-sm flex items-center justify-center gap-2"
            >
              <span>Already have an account? </span>
              <Link
                href="/signin"
                className="link bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent"
              >
                SignIn
              </Link>
            </motion.p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;
