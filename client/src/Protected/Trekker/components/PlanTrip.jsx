import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { trekPlanSchema } from "./schema.PlanTrip"; 
import { X, Plus, Trash2, AlertCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../../api/axios"; // Assuming you have an API utility for making requests

const PlanTrekForm = ({ isOpen, onClose, onSubmitSuccess, initialData = null }) => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(trekPlanSchema),
    mode: "onChange",
    defaultValues: initialData || {
      title: "",
      location: "",
      timePlanned: "",
      estBudget: "",
      description: "",
      itinerary: [{ day: 1, activity: "" }],
    },
  });

  // Handle Form Reset / Pre-fill on open
  useEffect(() => {
    if (isOpen) {
      reset(initialData || {
        title: "",
        location: "",
        timePlanned: "",
        estBudget: "",
        description: "",
        itinerary: [{ day: 1, activity: "" }],
      });
    }
  }, [isOpen, initialData, reset]);

  const { fields, append, remove } = useFieldArray({ control, name: "itinerary" });
  const descriptionValue = watch("description", "");

  const inputStyle = (error) => `
    w-full bg-white/[0.05] border ${error ? "border-red-500/80" : "border-white/20"} 
    rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none 
    focus:border-white/50 focus:bg-white/[0.09] transition-all duration-300 
    text-sm font-bold
  `;

  const ErrorMsg = ({ message }) => (
    <motion.span 
      initial={{ opacity: 0, y: -5 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="flex items-center gap-1 text-red-400 text-[11px] font-bold mt-1 ml-1"
    >
      <AlertCircle size={10} /> {message}
    </motion.span>
  );

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      let response;
      if (initialData?.id) {
        // UPDATE Existing Plan
        response = await api.put(`/plans/${initialData.id}`, data);
        toast.success("Trek plan updated!");
      } else {
        // CREATE New Plan
        response = await api.post("/plans", data);
        toast.success("Trek plan posted!");
        onClose();
      }

      onSubmitSuccess(response.data.plan);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save trek plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={!loading ? onClose : null} 
            className="absolute inset-0 bg-black/80 backdrop-blur-xs" 
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-[#0a0a0a] p-6 sm:p-10 rounded-[40px] border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
          >
            <button 
              onClick={onClose}
              disabled={loading}
              className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors p-2 disabled:opacity-0"
            >
              <X size={24} />
            </button>

            <div className="mb-8">
              <h2 className="text-3xl font-serif text-white font-bold tracking-tight">
                {initialData ? "Edit Your Plan" : "Plan Your Journey"}
              </h2>
              <p className="text-white/50 text-sm font-bold">
                {initialData ? "Refine your trek details." : "Set your requirements for guides."}
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col">
                  <label className="text-[11px] uppercase tracking-widest text-white/80 font-black mb-2 ml-1">Title</label>
                  <input {...register("title")} maxLength={50} className={inputStyle(errors.title)} placeholder="e.g. Annapurna Base Camp" />
                  {errors.title && <ErrorMsg message={errors.title.message} />}
                </div>

                <div className="flex flex-col">
                  <label className="text-[11px] uppercase tracking-widest text-white/80 font-black mb-2 ml-1">Location</label>
                  <input {...register("location")} maxLength={50} className={inputStyle(errors.location)} placeholder="e.g. Kaski, Nepal" />
                  {errors.location && <ErrorMsg message={errors.location.message} />}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col">
                  <label className="text-[11px] uppercase tracking-widest text-white/80 font-black mb-2 ml-1">Planned Date</label>
                  <input type="date" {...register("timePlanned")} className={inputStyle(errors.timePlanned)} />
                  {errors.timePlanned && <ErrorMsg message="Required" />}
                </div>
                <div className="flex flex-col">
                  <label className="text-[11px] uppercase tracking-widest text-white/80 font-black mb-2 ml-1">Budget (USD)</label>
                  <input 
                    type="number" 
                    {...register("estBudget", { valueAsNumber: true })} 
                    className={inputStyle(errors.estBudget)} 
                    onInput={(e) => e.target.value = e.target.value.slice(0, 6)}
                  />
                  {errors.estBudget && <ErrorMsg message={errors.estBudget.message} />}
                </div>
              </div>

              <div className="bg-white/2 border border-white/10 p-5 rounded-3xl">
                <label className="block text-[11px] uppercase tracking-widest text-white/80 font-black mb-4 ml-1">Itinerary</label>
                <div className="max-h-55 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex flex-col">
                      <div className="flex gap-3 items-center">
                        <span className="text-[10px] font-black text-white/30 w-6">D{index + 1}</span>
                        <input {...register(`itinerary.${index}.activity`)} maxLength={200} className={inputStyle(errors.itinerary?.[index]?.activity)} />
                        {fields.length > 1 && (
                          <button type="button" onClick={() => remove(index)} className="text-white/20 hover:text-red-400"><Trash2 size={18} /></button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => append({ day: fields.length + 1, activity: "" })} className="mt-4 flex items-center gap-2 text-[10px] bg-white/10 text-white px-4 py-2 rounded-full font-black border border-white/5">
                  <Plus size={12} /> Add Day
                </button>
              </div>

              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-2 px-1">
                  <label className="text-[11px] uppercase tracking-widest text-white/80 font-black">Description</label>
                  <span className="text-[10px] font-bold text-white/20">{descriptionValue.length}/500</span>
                </div>
                <textarea {...register("description")} maxLength={500} rows="3" className={`${inputStyle(errors.description)} resize-none`} />
                {errors.description && <ErrorMsg message={errors.description.message} />}
              </div>

              <motion.button 
                whileHover={{ scale: 1.01 }} 
                whileTap={{ scale: 0.99 }} 
                type="submit" 
                disabled={loading}
                className="w-full bg-white text-black font-black py-4 rounded-full mt-4 tracking-widest shadow-xl text-sm uppercase flex justify-center items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Processing...
                  </>
                ) : (
                  initialData ? "Update Trek Plan" : "Launch Trek Plan"
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PlanTrekForm;