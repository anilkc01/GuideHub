import React, { useEffect, useState } from "react";
import api from "../../../api/axios";
import TripCard from "./TripCard";
import { Loader2, Mountain } from "lucide-react";

const MyTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTrips = async () => {
    try {
      const response = await api.get("/trips/mytrips");
      setTrips(response.data);
    } catch (error) {
      console.error("Error fetching trips:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-zinc-500 gap-2">
        <Loader2 className="animate-spin" size={24} />
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-zinc-600 gap-2 opacity-50">
        <Mountain size={32} strokeWidth={1.5} />
        <p className="text-sm font-bold tracking-tight">No trips confirmed yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-100 overflow-y-auto pr-2 custom-scrollbar">
      {trips.map((trip) => (
        <TripCard key={trip.id} trip={trip} />
      ))}
    </div>
  );
};

export default MyTrips;