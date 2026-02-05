import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { registrationSchema } from './schema.Registration';
 

const RegistrationBox = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(registrationSchema),
    mode: "onChange"
  });


  const inputStyle = (error) => `
    w-full bg-white/[0.03] border ${error ? 'border-red-500/50' : 'border-white/10'} 
    rounded-xl px-5 py-4 text-white placeholder-white/20 outline-none 
    focus:border-white/40 focus:bg-white/[0.07] transition-all duration-300 text-base
  `;


  const handlePhoneChange = (e) => {
    console.log("Original Input:", e.target.value);
    const val = e.target.value.replace(/\D/g, ''); 
    
    const limitedVal = val.slice(0, 10); 
    console.log("Digits Only:", val);
    setValue("phone", limitedVal, { shouldValidate: true });
  };

  return (
    <div className="w-full min-h-137.5 lg:min-h-150 flex flex-col justify-center 
                    bg-white/5 backdrop-blur-3xl p-8 lg:p-12 
                    rounded-2xl lg:rounded-[50px] border border-white/10 shadow-2xl">
      
      <h2 className="text-2xl lg:text-3xl font-serif text-white mb-8 text-center tracking-wide">
        Create Your Account
      </h2>

      <form onSubmit={handleSubmit((d) => console.log(d))} className="flex flex-col gap-5">
        
        {/* Full Name */}
        <div className="relative">
          <input {...register("fullName")} placeholder="Full Name" className={inputStyle(errors.fullName)} />
          {errors.fullName && <span className="absolute -bottom-5 left-2 text-red-400 text-[11px] italic">{errors.fullName.message}</span>}
        </div>

        {/* Email */}
        <div className="relative">
          <input {...register("email")} placeholder="Email Address" className={inputStyle(errors.email)} />
          {errors.email && <span className="absolute -bottom-5 left-2 text-red-400 text-[11px] italic">{errors.email.message}</span>}
        </div>

        {/* Phone */}
        <div className="relative">
          <input 
            {...register("phone")} 
            onChange={handlePhoneChange}
            placeholder="Phone Number (10 digits)" 
            className={inputStyle(errors.phone)} 
          />
          {errors.phone && <span className="absolute -bottom-5 left-2 text-red-400 text-[11px] italic">{errors.phone.message}</span>}
        </div>

        {/* Town and Country - Split Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <input {...register("city")} placeholder="City" className={inputStyle(errors.city)} />
            {errors.city && <span className="absolute -bottom-5 left-2 text-red-400 text-[11px] italic">{errors.city.message}</span>}
          </div>
          <div className="relative">
            <input {...register("country")} placeholder="Country" className={inputStyle(errors.country)} />
            {errors.country && <span className="absolute -bottom-5 left-2 text-red-400 text-[11px] italic">{errors.country.message}</span>}
          </div>
        </div>

        {/* Password */}
        <div className="relative">
          <input type="password" {...register("password")} placeholder="Password" className={inputStyle(errors.password)} />
          {errors.password && <span className="absolute -bottom-5 left-2 text-red-400 text-[11px] italic">{errors.password.message}</span>}
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <input type="password" {...register("confirmPassword")} placeholder="Confirm Password" className={inputStyle(errors.confirmPassword)} />
          {errors.confirmPassword && <span className="absolute -bottom-5 left-2 text-red-400 text-[11px] italic">{errors.confirmPassword.message}</span>}
        </div>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,1)" }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          className="w-full bg-white/90 text-black font-bold py-4 rounded-full mt-6 text-base tracking-wider shadow-lg transition-colors"
        >
          Register Now
        </motion.button>


        <div className="mt-2 text-center">
           <p className="text-white/40 text-sm">
             Already have an account?{' '}
             <button 
               type="button" 
               className="text-white font-medium hover:underline hover:text-white/80 transition-all"
               onClick={() => console.log("Navigate to Login")}
             >
               Login
             </button>
           </p>
        </div>
        
      </form>
    </div>
  );
};

export default RegistrationBox;