import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { CarPreloader } from "@/components/ui/LoadingCar"
import { useAuth } from "@/hooks/useAuth"
import axios from "axios"
import type { BookedCar } from "./types"
import { motion, AnimatePresence } from "framer-motion"

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function TripsPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming')
  const [bookedCars, setBookedCars] = useState<BookedCar[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { userId } = useAuth()
  const [expandedTripId, setExpandedTripId] = useState<number | null>(null);

  const fetchBookedCars = async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${backendUrl}api/book/${userId}`, {
        withCredentials: true
      });

      if (Array.isArray(response.data)) {
        setBookedCars(response.data);
      } else {
        setBookedCars([]);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(`Failed to fetch bookings: ${error.response?.status} ${error.response?.statusText}`);
      } else {
        setError('Failed to fetch your bookings');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isTripUpcoming = (dropoffDate: string) => {
    return new Date(dropoffDate) > new Date();
  };

  const getTripStatus = (pickupDate: string, dropoffDate: string) => {
    const now = new Date();
    const pickup = new Date(pickupDate);
    const dropoff = new Date(dropoffDate);

    if (now < pickup) return 'Confirmed';
    if (now >= pickup && now <= dropoff) return 'In progress';
    return 'Completed';
  };

  const filteredTrips = bookedCars.filter(booking => {
    const isUpcoming = isTripUpcoming(booking.dropoffDate);
    return activeTab === 'upcoming' ? isUpcoming : !isUpcoming;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleCancelTrip = (tripId: number) => {
    alert(`Trip ${tripId} cancellation feature will be implemented soon`);
  };

  useEffect(() => {
    if (userId) {
      fetchBookedCars();
    } else {
      setIsLoading(false);
    }
  }, [userId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#18191C] text-white font-sans">
        <header className="flex items-center justify-between px-8 py-4 border-b border-[#232428]">
          <Link to="/" className="font-bold font-mono text-lg hover:text-gray-300">
            DriveGo
          </Link>
          <nav className="flex gap-8 items-center">
            <Link to="/browse" className="hover:underline font-mono  ">Browse Cars</Link>
            <Link to="/trips" className="text-blue-400 font-mono ">My Trips</Link>
            <Link to="/saved" className="hover:underline font-mono s">Saved</Link>
            <div className="w-8 h-8 bg-orange-500 rounded-full" />
          </nav>
        </header>
        <div className="flex items-center justify-center min-h-[50vh]">
          <CarPreloader />
        </div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="min-h-screen bg-[#18191C] text-white font-sans">
        <header className="flex items-center justify-between px-8 py-4 border-b border-[#232428]">
          <Link to="/" className="font-bold text-lg hover:text-gray-300 font-mono ">
            DriveGo
          </Link>
          <nav className="flex gap-8 items-center">
            <Link to="/browse" className="hover:underline font-mono ">Browse Cars</Link>
            <Link to="/trips" className="text-blue-400 font-mono ">My Trips</Link>
            <Link to="/saved" className="hover:underline font-mono ">Saved</Link>
            <div className="w-8 h-8 bg-orange-500 rounded-full" />
          </nav>
        </header>
        <div className="max-w-6xl mx-auto px-8 py-8">
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold font-mono  text-white mb-2">
              Please log in to view your trips
            </h3>
            <p className="text-gray-400 font-mono  mb-6">
              You need to be logged in to see your booking history.
            </p>
            <Link to="/login">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Log In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div className="min-h-screen bg-[#18191C] text-white font-sans">
      <header className="flex items-center justify-between px-8 py-4 border-b border-[#232428]">
        <Link to="/" className="font-bold text-lg hover:text-gray-300 font-mono ">
          DriveGo
        </Link>
        <nav className="flex gap-8 items-center">
          <Link to="/browse" className="hover:underline font-mono ">Browse Cars</Link>
          <Link to="/trips" className="text-blue-400 font-mono ">My Trips</Link>
          <Link to="/saved" className="hover:underline font-mono ">Saved</Link>
          <div className="w-8 h-8 bg-orange-500 rounded-full" />
        </nav>
      </header>

      <motion.div
        className="max-w-6xl mx-auto px-8 py-8 min-h-[80vh] flex flex-col"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h1 className="text-4xl font-bold mb-8 font-mono ">My Trips</h1>

        {error && (
          <motion.div className="bg-red-500/20 text-red-400 p-4 rounded-lg mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {error}
            <Button 
              onClick={fetchBookedCars}
              className="ml-4 bg-red-600 font-mono  hover:bg-red-700"
              size="sm"
            >
              Retry
            </Button>
          </motion.div>
        )}

        <div className="flex mb-8 border-b border-[#232428]">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`pb-4 px-1 text-lg font-medium border-b-2 transition-colors font-mono  ${
              activeTab === 'upcoming'
                ? 'border-white text-white'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Upcoming ({bookedCars.filter(b => isTripUpcoming(b.dropoffDate)).length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`pb-4 px-1 ml-8  font-mono text-lg font-medium border-b-2 transition-colors ${
              activeTab === 'past'
                ? 'border-white text-white'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Past ({bookedCars.filter(b => !isTripUpcoming(b.dropoffDate)).length})
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {filteredTrips.length === 0 ? (
              <motion.div
                key="no-trips"
                className="text-center py-12 flex-1 flex flex-col justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4 }}
              >
                <div className="mb-6">
                  <div className="w-24 h-24 bg-[#232428] rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </div>
                  <h3 className="text-xl  font-mono font-semibold text-white mb-2">
                    No {activeTab} trips yet
                  </h3>
                  <p className="text-gray-400 font-mono  mb-6">
                    {activeTab === 'upcoming' 
                      ? "Ready to plan your next adventure? Browse our cars and book your trip!"
                      : "Your completed trips will appear here once you've finished them."
                    }
                  </p>
                  {activeTab === 'upcoming' && (
                    <Link to="/browse">
                      <Button className="bg-blue-600 font-mono  hover:bg-blue-700">
                        Browse Cars
                      </Button>
                    </Link>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8">
                {filteredTrips.map((booking, idx) => {
                  const status = getTripStatus(booking.pickupDate, booking.dropoffDate);
                  const isExpanded = expandedTripId === booking.id;
                  return (
                    <motion.div
                      key={booking.id}
                      className="relative min-h-[320px] flex items-stretch group"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 30 }}
                      transition={{ duration: 0.5, delay: idx * 0.08 }}
                    >
                      {/* Car image fills the card */}
                      <img
                        src={booking.car.image}
                        alt={`${booking.car.brand} ${booking.car.name}`}
                        className="absolute inset-0 w-full h-full object-cover object-center rounded-2xl"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&h=300&fit=crop';
                        }}
                      />
                      {/* Overlay: car name and info icon */}
                      <div className="absolute left-0 right-0 bottom-0 p-6 flex items-end justify-between z-10 pointer-events-none">
                        <div className="bg-black/60 px-4 py-2 rounded-xl font-mono text-lg font-semibold text-white shadow-lg pointer-events-auto">
                          {booking.car.brand} {booking.car.name}
                        </div>
                        <button
                          className="ml-4 bg-black/60 hover:bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg pointer-events-auto transition-colors"
                          aria-label={isExpanded ? 'Hide details' : 'Show details'}
                          onClick={() => setExpandedTripId(isExpanded ? null : booking.id)}
                          type="button"
                        >
                          {isExpanded ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z" /></svg>
                          )}
                        </button>
                      </div>
                      {/* Expandable details bubble */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            key="modal-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
                            onClick={() => setExpandedTripId(null)}
                          >
                            <motion.div
                              key="details"
                              initial={{ opacity: 0, scale: 0.9, y: 20 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.9, y: 20 }}
                              transition={{ duration: 0.3 }}
                              className="bg-[#232428]/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 max-w-md w-full border border-[#232428]/60 flex flex-col"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="flex justify-between items-center mb-4">
                                <span 
                                  className={`inline-block px-3 py-1 font-mono rounded-full text-sm font-medium ${
                                    status === 'In progress' 
                                      ? 'bg-yellow-600/20 text-yellow-400'
                                      : status === 'Confirmed'
                                      ? 'bg-green-600/20 text-green-400'
                                      : 'bg-gray-600/20 text-gray-400'
                                  }`}
                                >
                                  {status}
                                </span>
                                <button
                                  className="ml-2 bg-black/40 hover:bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md transition-colors"
                                  aria-label="Close details"
                                  onClick={() => setExpandedTripId(null)}
                                  type="button"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                              </div>
                              <h2 className="text-2xl font-bold text-white mb-4 font-mono">
                                {booking.car.brand} {booking.car.name}
                              </h2>
                              <div className="space-y-2 font-mono text-gray-300 mb-6">
                                <p>Pickup: {formatDate(booking.pickupDate)}</p>
                                <p>Return: {formatDate(booking.dropoffDate)}</p>
                                <p>Location: {booking.pickupLocation}</p>
                                <p className="text-green-400 font-mono font-semibold text-lg">
                                  Total: ${booking.totalPrice}
                                </p>
                              </div>
                              <div className="flex gap-2 mt-4">
                                {activeTab === 'upcoming' && status === 'Confirmed' && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleCancelTrip(booking.id)}
                                    className="bg-transparent font-mono border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                                  >
                                    Cancel Trip
                                  </Button>
                                )}
                                <Link to={`/car/${booking.car.id}`}>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-transparent font-mono border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                                  >
                                    View Car Details
                                  </Button>
                                </Link>
                              </div>
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}
