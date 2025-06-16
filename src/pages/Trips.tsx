import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CarPreloader } from "@/components/ui/LoadingCar"
import { useAuth } from "@/hooks/useAuth"
import axios from "axios"
import type { BookedCar } from "./types"

const backendUrl = import.meta.env.VITE_BACKEND_URL;



export default function TripsPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming')
  const [bookedCars, setBookedCars] = useState<BookedCar[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { userId } = useAuth()

  const fetchBookedCars = async () => {
    if (!userId) {
      console.log('No user ID available');
      setIsLoading(false);
      return;
    }
    
    console.log('Fetching booked cars for user:', userId);
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${backendUrl}/api/book/${userId}`, {
        withCredentials: true
      });
      console.log("API response:", response.data);
      console.log("Response status:", response.status);
      
      if (Array.isArray(response.data)) {
        setBookedCars(response.data);
        console.log("Set booked cars:", response.data.length, "items");
      } else {
        console.warn("API response is not an array:", response.data);
        setBookedCars([]);
      }
    } catch (error) {
      console.error('Error fetching booked cars:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response status:', error.response?.status);
        console.error('Response data:', error.response?.data);
        setError(`Failed to fetch bookings: ${error.response?.status} ${error.response?.statusText}`);
      } else {
        setError('Failed to fetch your bookings');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper function to determine if a trip is upcoming or past
  const isTripUpcoming = (dropoffDate: string) => {
    return new Date(dropoffDate) > new Date();
  };
  
  // Helper function to determine trip status
  const getTripStatus = (pickupDate: string, dropoffDate: string) => {
    const now = new Date();
    const pickup = new Date(pickupDate);
    const dropoff = new Date(dropoffDate);
    
    if (now < pickup) return 'Confirmed';
    if (now >= pickup && now <= dropoff) return 'In progress';
    return 'Completed';
  };
  
  // Filter trips based on active tab
  const filteredTrips = bookedCars.filter(booking => {
    const isUpcoming = isTripUpcoming(booking.dropoffDate);
    return activeTab === 'upcoming' ? isUpcoming : !isUpcoming;
  });
  
  // Format date for display
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
    // TODO: Implement cancel trip API call
    alert(`Trip ${tripId} cancellation feature will be implemented soon`);
  };
  
  
  useEffect(() => {
    console.log('useEffect triggered, user:', userId);
    if (userId) {
      fetchBookedCars();
    } else {
      setIsLoading(false);
    }
  }, [userId]); // Add dependency on userId

  // Add loading state check before rendering
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#18191C] text-white">
        {/* Header */}
        <header className="flex items-center justify-between px-8 py-4 border-b border-[#232428]">
          <Link to="/" className="font-bold text-lg hover:text-gray-300">
            DriveGo
          </Link>
          <nav className="flex gap-8 items-center">
            <Link to="/browse" className="hover:underline">Browse Cars</Link>
            <Link to="/trips" className="text-blue-400">My Trips</Link>
            <Link to="/saved" className="hover:underline">Saved</Link>
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              {/* <span className="text-sm font-bold">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </span> */}
            </div>
          </nav>
        </header>
        <div className="flex items-center justify-center min-h-[50vh]">
          <CarPreloader />
        </div>
      </div>
    );
  }

  // Add debug info when not logged in
  if (!userId) {
    return (
      <div className="min-h-screen bg-[#18191C] text-white">
        {/* Header */}
        <header className="flex items-center justify-between px-8 py-4 border-b border-[#232428]">
          <Link to="/" className="font-bold text-lg hover:text-gray-300">
            DriveGo
          </Link>
          <nav className="flex gap-8 items-center">
            <Link to="/browse" className="hover:underline">Browse Cars</Link>
            <Link to="/trips" className="text-blue-400">My Trips</Link>
            <Link to="/saved" className="hover:underline">Saved</Link>
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold">U</span>
            </div>
          </nav>
        </header>
        <div className="max-w-6xl mx-auto px-8 py-8">
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-white mb-2">
              Please log in to view your trips
            </h3>
            <p className="text-gray-400 mb-6">
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
    <div className="min-h-screen bg-[#18191C] text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-[#232428]">
        <Link to="/" className="font-bold text-lg hover:text-gray-300">
          DriveGo
        </Link>
        <nav className="flex gap-8 items-center">
          <Link to="/browse" className="hover:underline">Browse Cars</Link>
          <Link to="/trips" className="text-blue-400">My Trips</Link>
          <Link to="/saved" className="hover:underline">Saved</Link>
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            {/* <span className="text-sm font-bold">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </span> */}
          </div>
        </nav>
      </header>

      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* Page Title */}
        <h1 className="text-4xl font-bold mb-8">My Trips</h1>

        {/* Debug Info (remove in production) */}
        <div className="mb-4 p-2 bg-gray-800 rounded text-xs">
          <p>Debug - User ID: {userId}</p>
          <p>Debug - Booked Cars Count: {bookedCars.length}</p>
          <p>Debug - Loading: {isLoading.toString()}</p>
          <p>Debug - Error: {error || 'None'}</p>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-500/20 text-red-400 p-4 rounded-lg mb-6">
            {error}
            <Button 
              onClick={fetchBookedCars}
              className="ml-4 bg-red-600 hover:bg-red-700"
              size="sm"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex mb-8 border-b border-[#232428]">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`pb-4 px-1 text-lg font-medium border-b-2 transition-colors ${
              activeTab === 'upcoming'
                ? 'border-white text-white'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Upcoming ({bookedCars.filter(b => isTripUpcoming(b.dropoffDate)).length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`pb-4 px-1 ml-8 text-lg font-medium border-b-2 transition-colors ${
              activeTab === 'past'
                ? 'border-white text-white'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Past ({bookedCars.filter(b => !isTripUpcoming(b.dropoffDate)).length})
          </button>
        </div>

        {/* Trips List */}
        <div className="space-y-6">
          {filteredTrips.length === 0 ? (
            <div className="text-center py-12">
              <div className="mb-6">
                <div className="w-24 h-24 bg-[#232428] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  No {activeTab} trips yet
                </h3>
                <p className="text-gray-400 mb-6">
                  {activeTab === 'upcoming' 
                    ? "Ready to plan your next adventure? Browse our cars and book your trip!"
                    : "Your completed trips will appear here once you've finished them."
                  }
                </p>
                {activeTab === 'upcoming' && (
                  <Link to="/browse">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Browse Cars
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ) : (
            filteredTrips.map((booking) => {
              const status = getTripStatus(booking.pickupDate, booking.dropoffDate);
              
              return (
                <Card key={booking.id} className="bg-[#232428] border-none">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      {/* Trip Details */}
                      <div className="flex-1">
                        {/* Status Badge */}
                        <div className="mb-3">
                          <span 
                            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                              status === 'In progress' 
                                ? 'bg-yellow-600/20 text-yellow-400'
                                : status === 'Confirmed'
                                ? 'bg-green-600/20 text-green-400'
                                : 'bg-gray-600/20 text-gray-400'
                            }`}
                          >
                            {status}
                          </span>
                        </div>

                        {/* Car Name */}
                        <h2 className="text-2xl font-bold text-white mb-2">
                          {booking.car.brand} {booking.car.name}
                        </h2>

                        {/* Trip Details */}
                        <div className="space-y-1 text-gray-400 mb-4">
                          <p>Pickup: {formatDate(booking.pickupDate)}</p>
                          <p>Return: {formatDate(booking.dropoffDate)}</p>
                          <p>Location: {booking.pickupLocation}</p>
                          <p className="text-green-400 font-semibold">
                            Total: ${booking.totalPrice}
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          {activeTab === 'upcoming' && status === 'Confirmed' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancelTrip(booking.id)}
                              className="bg-transparent border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                            >
                              Cancel Trip
                            </Button>
                          )}
                          
                          <Link to={`/car/${booking.car.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                            >
                              View Car Details
                            </Button>
                          </Link>
                        </div>
                      </div>

                      {/* Car Image */}
                      <div className="ml-6 flex-shrink-0">
                        <img
                          src={booking.car.image}
                          alt={`${booking.car.brand} ${booking.car.name}`}
                          className="w-80 h-48 object-cover rounded-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&h=300&fit=crop';
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  )
}
