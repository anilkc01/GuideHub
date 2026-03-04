import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from "../../api/axios";
import { forgotSchema } from './schema.forgot';

const ForgotPassword = ({ initialEmail, onBack }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, trigger, getValues, formState: { errors } } = useForm({
    resolver: zodResolver(forgotSchema),
    mode: "onSubmit",
    defaultValues: { email: initialEmail || "" }
  });

  const inputStyle = (error) => `w-full bg-white/[0.03] border ${error ? "border-red-500/50" : "border-white/10"} rounded-xl px-4 py-3 text-white outline-none focus:border-white/40 transition-all text-sm md:text-base`;

  const handleRequestOtp = async () => {
    const isEmailValid = await trigger("email");
    if (!isEmailValid) return;

    setLoading(true);
    try {
      
      await api.post("/auth/get-otp", { email: getValues("email") });
      toast.success("Reset code sent!");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send code");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const isOtpValid = await trigger("otp");
    if (!isOtpValid) return;

    setLoading(true);
    try {
      
      await api.post("/auth/verify-otp", { 
        email: getValues("email"), 
        otp: getValues("otp") 
      });
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const onResetSubmit = async (data) => {
    setLoading(true);
    try {
     
      await api.post("/auth/reset-password", data);
      toast.success("Password updated! Please login.");
      onBack();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col justify-center bg-white/5 backdrop-blur-3xl p-6 sm:p-10 lg:p-12 rounded-3xl lg:rounded-[50px] border border-white/10 shadow-2xl">
      <h2 className="text-xl sm:text-2xl font-serif text-white mb-6 text-center">
        {step === 1 ? "Reset Password" : step === 2 ? "Verify Identity" : "New Credentials"}
      </h2>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="flex flex-col gap-4">
          
          {step === 1 && (
            <>
              <div className="relative">
                <input {...register("email")} placeholder="Email Address" maxLength={30} className={inputStyle(errors.email)} />
                {errors.email && <span className="text-red-400 text-[10px] italic">{errors.email.message}</span>}
              </div>
              <button onClick={handleRequestOtp} disabled={loading} className="w-full bg-white text-black font-bold py-3 rounded-full mt-2">
                {loading ? "Sending..." : "Send Reset Code"}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <p className="text-white/40 text-center text-[10px] sm:text-xs">Enter code sent to {getValues("email")}</p>
              <div className="relative">
                <input {...register("otp")} placeholder="000000" maxLength={6} className={`${inputStyle(errors.otp)} text-center tracking-[0.5em] text-lg font-bold`} />
                {errors.otp && <span className="text-red-400 text-[10px] italic">{errors.otp.message}</span>}
              </div>
              <button onClick={handleVerifyOtp} disabled={loading} className="w-full bg-white text-black font-bold py-3 rounded-full mt-2">
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit(onResetSubmit)} className="flex flex-col gap-4">
              <div className="relative">
                <input type="password" {...register("password")} placeholder="New Password" className={inputStyle(errors.password)} />
                {errors.password && <span className="text-red-400 text-[10px] italic">{errors.password.message}</span>}
              </div>
              <div className="relative">
                <input type="password" {...register("confirmPassword")} placeholder="Confirm New Password" className={inputStyle(errors.confirmPassword)} />
                {errors.confirmPassword && <span className="text-red-400 text-[10px] italic">{errors.confirmPassword.message}</span>}
              </div>
              <button type="submit" disabled={loading} className="w-full bg-white text-black font-bold py-3 rounded-full mt-2">
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          )}

          <button onClick={onBack} className="text-white/40 text-[10px] sm:text-xs mt-4 hover:text-white transition-colors">
            ← Return to Login
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ForgotPassword;