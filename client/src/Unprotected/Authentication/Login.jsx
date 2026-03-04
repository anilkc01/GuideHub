import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from "../../api/axios";
import { useNavigate } from 'react-router-dom';
import { loginSchema } from './schema.Login';
import ForgotPassword from './ForgotPassword'; // Import the new component

const LoginBox = ({ onSwitchToRegister, onLoginSuccess }) => {
  const [stage, setStage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit", // Validation triggers only on button click
    defaultValues: { email: "", password: "", remember: false }
  });

  const inputStyle = (error) => `
    w-full bg-white/[0.03] border ${error ? "border-red-500/50" : "border-white/10"} 
    rounded-xl px-4 py-3 md:px-5 md:py-4 text-white placeholder-white/20 
    outline-none focus:border-white/40 focus:bg-white/[0.07] 
    transition-all duration-300 text-sm md:text-base
  `;

  const handleEmailNext = async () => {
    const isEmailValid = await trigger("email");
    if (!isEmailValid) return;

    setLoading(true);
    try {
      const email = getValues("email");
      await api.post("/auth/verify-email", { email });
      setStage(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Email verification failed");
    } finally {
      setLoading(false);
    }
  };

  const onFinalSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/verify-password", data);
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      toast.success(`Welcome back, ${user.fullName}!`);
      onLoginSuccess?.();
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Switch to Forgot Password View
  if (showForgot) {
    return (
      <ForgotPassword 
        initialEmail={getValues("email")} 
        onBack={() => setShowForgot(false)} 
      />
    );
  }

  return (
    <div className="w-full max-w-md mx-auto min-h-100 flex flex-col justify-center bg-white/5 backdrop-blur-3xl p-6 sm:p-10 lg:p-12 rounded-3xl lg:rounded-[50px] border border-white/10 shadow-2xl">
      
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif text-white mb-6 md:mb-8 text-center tracking-wide">
        {stage === 1 ? "Welcome Back" : "Enter Password"}
      </h2>

      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait">
          {stage === 1 ? (
            <motion.div
              key="email-stage"
              initial={{ x: 20, opacity: 0 }} 
              animate={{ x: 0, opacity: 1 }} 
              exit={{ x: -20, opacity: 0 }}
              className="flex flex-col gap-4 md:gap-6"
            >
              <div className="relative">
                <input 
                  {...register("email")}
                  type="email" 
                  placeholder="Email Address" 
                  maxLength={30} // Hard limit
                  className={inputStyle(errors.email)}
                  onKeyDown={(e) => e.key === 'Enter' && handleEmailNext()}
                />
                {errors.email && (
                  <span className="absolute -bottom-5 left-1 text-red-400 text-[10px] italic">
                    {errors.email.message}
                  </span>
                )}
              </div>
              <button 
                type="button"
                disabled={loading}
                onClick={handleEmailNext}
                className="w-full bg-white text-black font-bold py-3 md:py-4 rounded-full shadow-lg hover:bg-opacity-90 active:scale-[0.98] mt-2 transition-all"
              >
                {loading ? "Checking..." : "Next"}
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="pass-stage"
              initial={{ x: 20, opacity: 0 }} 
              animate={{ x: 0, opacity: 1 }} 
              exit={{ x: -20, opacity: 0 }}
              onSubmit={handleSubmit(onFinalSubmit)}
              className="flex flex-col gap-4 md:gap-6"
            >
              <div className="relative">
                <input 
                  {...register("password")}
                  type="password" 
                  placeholder="Password" 
                  className={inputStyle(errors.password)} 
                  autoFocus 
                />
                <div className="flex justify-end mt-1">
                  <button 
                    type="button"
                    onClick={() => setShowForgot(true)}
                    className="text-white/40 text-[10px] hover:text-white transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
                {errors.password && (
                  <span className="absolute -bottom-5 left-1 text-red-400 text-[10px] italic">
                    {errors.password.message}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 px-1">
                <div className="relative flex items-center">
                  <input 
                    {...register("remember")}
                    type="checkbox"
                    id="remember"
                    className="w-4 h-4 md:w-5 md:h-5 appearance-none border border-white/20 rounded bg-white/5 checked:bg-white transition-all cursor-pointer"
                  />
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                     <svg className="w-3 h-3 text-black opacity-0 check-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                  </div>
                </div>
                <label htmlFor="remember" className="text-white/60 text-xs md:text-sm cursor-pointer select-none hover:text-white transition-colors">
                  Remember me
                </label>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black font-bold py-3 md:py-4 rounded-full shadow-lg hover:bg-opacity-90 active:scale-[0.98]"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
              <button 
                type="button"
                onClick={() => setStage(1)}
                className="text-white/40 text-xs md:text-sm hover:text-white transition-colors"
              >
                Back to email
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-6 md:mt-8 text-center text-white/40 text-xs md:text-sm">
        New here?{' '}
        <button onClick={onSwitchToRegister} className="text-white font-medium underline underline-offset-4 hover:text-white/80">
          Create Account
        </button>
      </p>

      <style dangerouslySetInnerHTML={{ __html: `
        input:checked + div .check-svg { opacity: 1; }
      `}} />
    </div>
  );
};

export default LoginBox;