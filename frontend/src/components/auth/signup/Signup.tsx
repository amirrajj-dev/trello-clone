"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema, SignUpType } from "@/validations/auth/register.validation";
import { useSignup } from "@/hooks/mutations/signup";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, User, UserPlus, Sparkles, ArrowRight, Check } from "lucide-react";
import Logo from "@/components/common/logo/Logo";
import Link from "next/link";

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<SignUpType>({
    resolver: zodResolver(schema),
  });
  const { mutateAsync: signup, isPending: isLoading } = useSignup();
  const router = useRouter();
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState(false);

  const passwordValue = watch("password", "");

  const onSubmit = async (data: SignUpType) => {
    try {
      await signup(data);
      toast.success("🎉 Welcome! Account created successfully!");
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
    }
  };

  // Password strength indicators
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(passwordValue);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-base-100 via-primary/5 to-base-300 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-secondary/10 via-transparent to-transparent"></div>
      
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-4">
            <motion.div
              whileHover={{ scale: 1.05, rotate: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Logo size="text-4xl" />
            </motion.div>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-base-content/60 text-lg"
          >
            Join thousands of productive teams
          </motion.p>
        </motion.div>

        {/* Sign Up Card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="bg-base-100/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-base-300/50 overflow-hidden"
        >
          <div className="p-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl mb-4"
              >
                <UserPlus size={32} className="text-primary" />
              </motion.div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Create Account
              </h2>
              <p className="text-base-content/60 mt-2">Start your productivity journey today</p>
            </motion.div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <label className="flex items-center gap-2 text-sm font-medium text-base-content">
                  <User size={16} className="text-primary" />
                  Full Name
                </label>
                <motion.div 
                  className="relative"
                  whileHover={{ scale: 1.02 }}
                  whileFocus={{ scale: 1.02 }}
                >
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    className="input input-bordered w-full bg-base-200 border-base-300 rounded-xl pl-12 pr-4 h-14 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                    {...register("name")}
                  />
                  <User className="absolute z-10 left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-base-content/50" />
                </motion.div>
                <AnimatePresence>
                  {errors.name && (
                    <motion.span
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-error text-sm flex items-center gap-1"
                    >
                      <Sparkles size={12} />
                      {errors.name.message}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <label className="flex items-center gap-2 text-sm font-medium text-base-content">
                  <Mail size={16} className="text-secondary" />
                  Email Address
                </label>
                <motion.div 
                  className="relative"
                  whileHover={{ scale: 1.02 }}
                  whileFocus={{ scale: 1.02 }}
                >
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="input input-bordered w-full bg-base-200 border-base-300 rounded-xl pl-12 pr-4 h-14 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                    {...register("email")}
                  />
                  <Mail className="absolute z-10 left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-base-content/50" />
                </motion.div>
                <AnimatePresence>
                  {errors.email && (
                    <motion.span
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-error text-sm flex items-center gap-1"
                    >
                      <Sparkles size={12} />
                      {errors.email.message}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-3"
              >
                <label className="flex items-center gap-2 text-sm font-medium text-base-content">
                  <Lock size={16} className="text-accent" />
                  Password
                </label>
                <motion.div 
                  className="relative"
                  whileHover={{ scale: 1.02 }}
                  whileFocus={{ scale: 1.02 }}
                >
                  <input
                    type={isPasswordVisible ? "text" : "password"}
                    placeholder="Create a strong password"
                    className="input input-bordered w-full bg-base-200 border-base-300 rounded-xl pl-12 pr-12 h-14 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                    {...register("password")}
                  />
                  <Lock className="absolute z-10 left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-base-content/50" />
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-base-content/50 hover:text-base-content transition-colors"
                  >
                    {isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                  </motion.button>
                </motion.div>

                {/* Password Strength Indicator */}
                {passwordValue && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    <div className="flex gap-1 h-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`flex-1 rounded-full transition-all duration-300 ${
                            level <= passwordStrength
                              ? level === 1 ? "bg-error" :
                                level === 2 ? "bg-warning" :
                                level === 3 ? "bg-info" :
                                "bg-success"
                              : "bg-base-300"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        <Check size={10} className={passwordValue.length >= 8 ? "text-success" : "text-base-content/30"} />
                        <span className={passwordValue.length >= 8 ? "text-success" : "text-base-content/50"}>8+ characters</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Check size={10} className={/[A-Z]/.test(passwordValue) ? "text-success" : "text-base-content/30"} />
                        <span className={/[A-Z]/.test(passwordValue) ? "text-success" : "text-base-content/50"}>Uppercase</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Check size={10} className={/[0-9]/.test(passwordValue) ? "text-success" : "text-base-content/30"} />
                        <span className={/[0-9]/.test(passwordValue) ? "text-success" : "text-base-content/50"}>Number</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Check size={10} className={/[^A-Za-z0-9]/.test(passwordValue) ? "text-success" : "text-base-content/30"} />
                        <span className={/[^A-Za-z0-9]/.test(passwordValue) ? "text-success" : "text-base-content/50"}>Special char</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                <AnimatePresence>
                  {errors.password && (
                    <motion.span
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-error text-sm flex items-center gap-1"
                    >
                      <Sparkles size={12} />
                      {errors.password.message}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting || isLoading}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="btn btn-primary w-full rounded-xl bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-content h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileTap={{ scale: 0.98 }}
              >
                <AnimatePresence mode="wait">
                  {isSubmitting || isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <div className="loading loading-spinner loading-sm"></div>
                      Creating Account...
                    </motion.div>
                  ) : (
                    <motion.div
                      key="signup"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <UserPlus size={20} />
                      Create Account
                      <motion.div
                        animate={{ x: isHovered ? 5 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ArrowRight size={16} />
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "200%" }}
                  transition={{ duration: 0.8 }}
                />
              </motion.button>
            </form>

            {/* Sign In Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center mt-6 pt-6 border-t border-base-300/50"
            >
              <p className="text-base-content/60 text-sm">
                Already have an account?{' '}
                <Link
                  href="/signin"
                  className="link link-hover bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-semibold hover:from-primary/80 hover:to-accent/80 transition-all duration-200 inline-flex items-center gap-1"
                >
                  Sign In
                  <ArrowRight size={14} />
                </Link>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;