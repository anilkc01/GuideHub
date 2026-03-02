import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { registrationSchema } from "./schema.Registration";
import toast, { Toaster } from "react-hot-toast";
import api from "../../api/axios";

// Helper Component for Image Previews in Rectangles
const ImagePreview = ({ file, label, onChange, id, aspect = "aspect-video" }) => {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    // Free memory when component unmounts
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return (
    <div className={`flex flex-col gap-2 flex-1 ${aspect === 'aspect-square' ? 'items-center' : ''}`}>
      <label className="text-white/40 text-[9px] uppercase font-black ml-1 tracking-widest">
        {label}
      </label>
      <div
        onClick={() => document.getElementById(id).click()}
        className={`relative ${aspect} w-full rounded-2xl border-2 border-dashed border-white/10 overflow-hidden bg-white/5 flex flex-col items-center justify-center hover:border-emerald-500/40 transition-all cursor-pointer group`}
      >
        {preview ? (
          <img src={preview} className="w-full h-full object-cover" alt="Preview" />
        ) : (
          <div className="flex flex-col items-center gap-1 opacity-20 group-hover:opacity-50 transition-opacity p-4 text-center">
            <span className="text-xl">+</span>
            <span className="text-[8px] font-bold uppercase tracking-tighter">Upload {label}</span>
          </div>
        )}
        <input
          id={id}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={(e) => onChange(e.target.files[0])}
        />
      </div>
    </div>
  );
};

const RegistrationBox = ({ onSwitchToLogin, role = "trekker" }) => {
  const [step, setStep] = useState(1); // 1: Form, 2: Guide Docs, 3: OTP
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(null);

  // Additional state for Guide specifics - Updated with dpImage
  const [guideData, setGuideData] = useState({
    licenseNo: "",
    licenseImage: null,
    citizenshipImage: null,
    dpImage: null,
  });

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registrationSchema),
    mode: "onChange",
  });

  const inputStyle = (error) => `
    w-full bg-white/[0.03] border ${error ? "border-red-500/50" : "border-white/10"} 
    rounded-lg sm:rounded-xl px-4 py-3 sm:px-5 sm:py-4 
    text-white placeholder-white/20 outline-none 
    focus:border-white/40 focus:bg-white/[0.07] transition-all duration-300 text-sm sm:text-base
  `;

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, "");
    setValue("phone", val.slice(0, 10), { shouldValidate: true });
  };

  // Step 1 Submit
  const onRegisterSubmit = async (data) => {
    setFormData(data);
    if (role === "guide") {
      setStep(2);
    } else {
      handleRequestOtp(data.email);
    }
  };

  // Helper to trigger OTP
  const handleRequestOtp = async (email) => {
    setLoading(true);
    try {
      await api.post("/auth/get-otp", { email });
      setStep(3);
      toast.success("OTP sent to your email!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Step 2 Submit (Guide Only) - Validating 3 images now
  const handleGuideSubmit = () => {
    if (
      !guideData.licenseNo ||
      !guideData.licenseImage ||
      !guideData.citizenshipImage ||
      !guideData.dpImage
    ) {
      return toast.error("Please fill all details and upload all 3 images");
    }
    handleRequestOtp(formData.email);
  };

  // Step 3: Verify & Chain Register + Register-Guide
  const handleVerifyOtp = async () => {
    const otp = getValues("otp");
    if (!otp) return toast.error("Please enter the OTP");

    setLoading(true);
    try {
      // i. Verify OTP
      await api.post("/auth/verify-otp", { email: formData.email, otp });

      // ii. Register Base User
      const { confirmPassword, city, country, ...restOfData } = formData;
      const registrationData = {
        ...restOfData,
        address: `${city}, ${country}`,
        role: role,
      };

      const regRes = await api.post("/auth/register", registrationData);

      // iii & iv. Register Guide specific details if role is guide
      if (role === "guide") {
        const userId = regRes.data.user.id;
        const gData = new FormData();
        gData.append("userId", userId);
        gData.append("licenseNo", guideData.licenseNo);
        gData.append("licenseImage", guideData.licenseImage);
        gData.append("citizenshipImage", guideData.citizenshipImage);
        gData.append("dpImage", guideData.dpImage); // Send DP to Guide registration endpoint

        await api.post("/auth/register-guide", gData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      toast.success("Account created successfully!");
      setTimeout(() => onSwitchToLogin(), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm sm:max-w-md lg:max-w-full min-h-fit lg:min-h-150 flex flex-col justify-center bg-white/5 backdrop-blur-3xl p-6 sm:p-8 lg:p-12 rounded-2xl lg:rounded-[50px] border border-white/10 shadow-2xl mx-auto">
      {role === "guide" && (
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1 w-10 rounded-full transition-all duration-500 ${
                step >= s ? "bg-white" : "bg-white/10"
              }`}
            />
          ))}
        </div>
      )}
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif text-white mb-6 lg:mb-8 text-center tracking-wide">
        {step === 1
          ? "Create Your Account"
          : step === 2
            ? "Guide Details"
            : "Verify Email"}
      </h2>

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.form
            key="step1"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            onSubmit={handleSubmit(onRegisterSubmit)}
            className="flex flex-col gap-4 sm:gap-5"
          >
            <div className="relative">
              <input
                {...register("fullName")}
                placeholder="Full Name"
                className={inputStyle(errors.fullName)}
              />
              {errors.fullName && (
                <span className="absolute -bottom-4 left-1 text-red-400 text-[9px] sm:text-[11px] italic leading-none">
                  {errors.fullName.message}
                </span>
              )}
            </div>

            <div className="relative">
              <input
                {...register("email")}
                placeholder="Email Address"
                className={inputStyle(errors.email)}
              />
              {errors.email && (
                <span className="absolute -bottom-4 left-1 text-red-400 text-[9px] sm:text-[11px] italic leading-none">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="relative">
                <input
                  {...register("phone")}
                  onChange={handlePhoneChange}
                  placeholder="Phone"
                  className={inputStyle(errors.phone)}
                />
                {errors.phone && (
                  <span className="absolute -bottom-4 left-1 text-red-400 text-[9px] sm:text-[11px] italic leading-none">
                    {errors.phone.message}
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type="date"
                  {...register("dob")}
                  className={`${inputStyle(errors.dob)} appearance-none uppercase`}
                />
                {errors.dob && (
                  <span className="absolute -bottom-4 left-1 text-red-400 text-[9px] sm:text-[11px] italic leading-none">
                    {errors.dob.message}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="relative">
                <input
                  {...register("city")}
                  placeholder="City"
                  className={inputStyle(errors.city)}
                />
                {errors.city && (
                  <span className="absolute -bottom-4 left-1 text-red-400 text-[9px] sm:text-[11px] italic">
                    {errors.city.message}
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  {...register("country")}
                  placeholder="Country"
                  className={inputStyle(errors.country)}
                />
                {errors.country && (
                  <span className="absolute -bottom-4 left-1 text-red-400 text-[9px] sm:text-[11px] italic">
                    {errors.country.message}
                  </span>
                )}
              </div>
            </div>

            <div className="relative">
              <input
                type="password"
                {...register("password")}
                placeholder="Password"
                className={inputStyle(errors.password)}
              />
              {errors.password && (
                <span className="absolute -bottom-4 left-1 text-red-400 text-[9px] sm:text-[11px] italic">
                  {errors.password.message}
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type="password"
                {...register("confirmPassword")}
                placeholder="Confirm Password"
                className={inputStyle(errors.confirmPassword)}
              />
              {errors.confirmPassword && (
                <span className="absolute -bottom-4 left-1 text-red-400 text-[9px] sm:text-[11px] italic">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-bold py-3 sm:py-4 rounded-full mt-4 text-sm sm:text-base tracking-wider shadow-lg"
            >
              {loading ? "Sending..." : "Register Now"}
            </motion.button>
          </motion.form>
        ) : step === 2 ? (
          <motion.div
            key="step-guide"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="flex flex-col gap-4"
          >
            <input
            label="License Number"
              placeholder="License Number"
              className={inputStyle()}
              onChange={(e) =>
                setGuideData({ ...guideData, licenseNo: e.target.value })
              }
            />

            {/* Rectangle Previews Section */}
            <div className="flex flex-col gap-4">
              {/* Added aspect="aspect-square" here for DP */}
              <div className="flex justify-center w-full">
                <div className="w-40 sm:w-48"> 
                    <ImagePreview
                        id="dp-upload"
                        label="Profile Picture (DP)"
                        file={guideData.dpImage}
                        aspect="aspect-square"
                        onChange={(file) => setGuideData({ ...guideData, dpImage: file })}
                    />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <ImagePreview
                  id="lic-upload"
                  label="License Image"
                  file={guideData.licenseImage}
                  onChange={(file) => setGuideData({ ...guideData, licenseImage: file })}
                />
                <ImagePreview
                  id="cit-upload"
                  label="Citizenship"
                  file={guideData.citizenshipImage}
                  onChange={(file) => setGuideData({ ...guideData, citizenshipImage: file })}
                />
              </div>
            </div>

            <motion.button
              onClick={handleGuideSubmit}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full bg-white text-black font-bold py-3 sm:py-4 rounded-full mt-2 shadow-lg"
            >
              Continue
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="flex flex-col gap-5"
          >
            <p className="text-white/60 text-center text-sm">
              Enter the code sent to your email.
            </p>
            <div className="relative">
              <input
                {...register("otp")}
                placeholder="000000"
                className={`${inputStyle()} text-center tracking-[0.5em] text-lg`}
              />
            </div>
            <motion.button
              onClick={handleVerifyOtp}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full bg-white text-black font-bold py-3 sm:py-4 rounded-full text-sm sm:text-base shadow-lg"
            >
              {loading ? "Verifying..." : "Verify & Complete"}
            </motion.button>
            <button
              onClick={() => setStep(role === "guide" ? 2 : 1)}
              className="text-white/40 text-xs hover:underline"
            >
              Back
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6 text-center">
        <p className="text-white/40 text-[12px] sm:text-sm">
          Already have an account?{" "}
          <button
            type="button"
            className="text-white font-medium hover:underline"
            onClick={onSwitchToLogin}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegistrationBox;