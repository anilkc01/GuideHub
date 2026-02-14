import React, { useEffect, useState } from "react";
import api from "../../../api/axios";
import ActivePlanCard from "./ActivePlanCard";
import { Loader2, Inbox } from "lucide-react";

const MyActivePlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPlans = async () => {
    try {
      const response = await api.get("/plans/my-plans");
      // Filter for only 'open' status if you want strictly active ones
      setPlans(response.data);
    } catch (error) {
      console.error("Error fetching plans:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-zinc-500 gap-2">
        <Loader2 className="animate-spin" size={24} />
        <span className="text-xs font-bold uppercase tracking-widest">Loading Plans...</span>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-zinc-600 gap-2 opacity-50">
        <Inbox size={32} strokeWidth={1.5} />
        <p className="text-sm font-bold">No active plans yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-100 overflow-y-auto pr-2 custom-scrollbar">
      {plans.map((plan) => (
        <ActivePlanCard key={plan.id} plan={plan} />
      ))}
    </div>
  );
};

export default MyActivePlans;