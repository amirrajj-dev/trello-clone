'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { schema, SignInType } from '@/validations/auth/login.validation';
import { useLogin } from '@/hooks/mutations/login';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, LogIn, Sparkles, ArrowRight } from 'lucide-react';
import Logo from '@/components/common/logo/Logo';
import Link from 'next/link';

const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInType>({
    resolver: zodResolver(schema),
  });
  const { mutateAsync: login, isPending: isLoading } = useLogin();
  const router = useRouter();
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState(false);

  const onSubmit = async (data: SignInType) => {
    try {
      await login(data);
      toast.success('🎉 Welcome back! Logged in successfully!');
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-base-100 via-primary/5 to-base-300 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
      
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
              whileHover={{ scale: 1.05, rotate: 5 }}
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
            Welcome back to your workspace
          </motion.p>
        </motion.div>

        {/* Login Card */}
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
                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl mb-4"
              >
                <LogIn size={32} className="text-primary" />
              </motion.div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Sign In
              </h2>
              <p className="text-base-content/60 mt-2">Access your account and continue your work</p>
            </motion.div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <label className="flex items-center gap-2 text-sm font-medium text-base-content">
                  <Mail size={16} className="text-primary" />
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
                    {...register('email')}
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
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <label className="flex items-center gap-2 text-sm font-medium text-base-content">
                  <Lock size={16} className="text-secondary" />
                  Password
                </label>
                <motion.div 
                  className="relative"
                  whileHover={{ scale: 1.02 }}
                  whileFocus={{ scale: 1.02 }}
                >
                  <input
                    type={isPasswordVisible ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className="input input-bordered w-full bg-base-200 border-base-300 rounded-xl pl-12 pr-12 h-14 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                    {...register('password')}
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
                className="btn btn-primary w-full rounded-xl bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-content h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
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
                      Signing In...
                    </motion.div>
                  ) : (
                    <motion.div
                      key="signin"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <LogIn size={20} />
                      Sign In
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

            {/* Sign Up Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-center mt-6 pt-6 border-t border-base-300/50"
            >
              <p className="text-base-content/60 text-sm">
                Don't have an account?{' '}
                <Link
                  href="/signup"
                  className="link link-hover bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-semibold hover:from-primary/80 hover:to-secondary/80 transition-all duration-200 inline-flex items-center gap-1"
                >
                  Sign Up
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

export default SignIn;