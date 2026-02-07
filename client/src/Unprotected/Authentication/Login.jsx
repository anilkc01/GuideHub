import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import api from "../../api/axios";

const LoginBox = ({ onSwitchToRegister }) => {
  const [stage, setStage] = useState(1); // 1: Email, 2: Password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputStyle = "w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/20 outline-none focus:border-white/40 focus:bg-white/[0.07] transition-all duration-300 text-base";

  // Step 1: Verify Email
  const handleEmailNext = async () => {
    if (!email.includes('@')) return toast.error("Please enter a valid email");
    
    setLoading(true);
    try {
      await api.post("/auth/verify-email", { email });
      setStage(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Email verification failed");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify Password & Final Login
  const handleLogin = async () => {
    if (!password) return toast.error("Please enter your password");

    setLoading(true);
    try {
      const res = await api.post("/auth/verify-password", { email, password, remember });
      
      const { token, user } = res.data;

      // Save to LocalStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success(`Welcome back, ${user.fullName}!`);
      
      // Redirect or refresh state here
      setTimeout(() => {
        window.location.href = "/dashboard"; // or use navigate()
      }, 1500);

    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-100 flex flex-col justify-center bg-white/5 backdrop-blur-3xl p-8 lg:p-12 rounded-2xl lg:rounded-[50px] border border-white/10 shadow-2xl">
      <Toaster />
      <h2 className="text-2xl lg:text-3xl font-serif text-white mb-8 text-center tracking-wide">
        {stage === 1 ? "Welcome Back" : "Enter Password"}
      </h2>

      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait">
          {stage === 1 ? (
            <motion.div
              key="email-stage"
              initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}
              className="flex flex-col gap-6"
            >
              <input 
                type="email" 
                placeholder="Email Address" 
                className={inputStyle}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleEmailNext()}
              />
              <button 
                disabled={loading}
                onClick={handleEmailNext}
                className="w-full bg-white text-black font-bold py-4 rounded-full shadow-lg disabled:opacity-50"
              >
                {loading ? "Checking..." : "Next"}
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="pass-stage"
              initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}
              className="flex flex-col gap-6"
            >
              <input 
                type="password" 
                placeholder="Password" 
                className={inputStyle} 
                autoFocus 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />

              <div className="flex items-center gap-3 px-2">
                <div className="relative flex items-center cursor-pointer">
                  <input 
                    type="checkbox"
                    id="remember"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="w-5 h-5 appearance-none border border-white/20 rounded bg-white/5 checked:bg-white checked:border-white transition-all cursor-pointer"
                  />
                  {remember && (
                    <svg className="absolute w-3 h-3 text-black pointer-events-none left-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <label htmlFor="remember" className="text-white/60 text-sm cursor-pointer select-none hover:text-white transition-colors">
                  Remember me
                </label>
              </div>

              <button 
                disabled={loading}
                onClick={handleLogin}
                className="w-full bg-white text-black font-bold py-4 rounded-full shadow-lg disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
              <button 
                onClick={() => setStage(1)}
                className="text-white/40 text-sm hover:text-white"
              >
                Back to email
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-8 text-center text-white/40 text-sm">
        New here?{' '}
        <button onClick={onSwitchToRegister} className="text-white font-medium underline">
          Create Account
        </button>
      </p>
    </div>
  );
};

export default LoginBox;