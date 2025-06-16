import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

// Mock trips data
const mockTrips = [
  {
    id: 1,
    carName: "Volkswagen Golf",
    carImage: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&h=300&fit=crop",
    pickup: "12:00 PM, Jul 20",
    return: "12:00 PM, Jul 22",
    status: "In progress",
    type: "upcoming"
  },
  {
    id: 2,
    carName: "Toyota Camry",
    carImage: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=300&fit=crop",
    pickup: "12:00 PM, Aug 10",
    return: "12:00 PM, Aug 12",
    status: "Confirmed",
    type: "upcoming"
  },
  {
    id: 3,
    carName: "Honda Civic",
    carImage: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop",
    pickup: "10:00 AM, May 15",
    return: "10:00 AM, May 18",
    status: "Completed",
    type: "past"
  },
  {
    id: 4,
    carName: "BMW X5",
    carImage: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop",
    pickup: "2:00 PM, Apr 22",
    return: "2:00 PM, Apr 25",
    status: "Completed",
    type: "past"
  }
]

export default function TripsPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming')

  const filteredTrips = mockTrips.filter(trip => trip.type === activeTab)

  const handleCancelTrip = (tripId: number) => {
    alert(`Trip ${tripId} has been cancelled`)
  }

  return (
    <div className="min-h-screen bg-[#18191C] text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-[#232428]">
        <Link to="/" className="font-bold text-lg hover:text-gray-300">
          DriveGo
        </Link>
        <nav className="flex gap-8 items-center">
          <Link to="/rent" className="hover:underline">Rent a car</Link>
          <Link to="/trips" className="text-blue-400">My trips</Link>
          <Link to="/help" className="hover:underline">Help</Link>
          <div className="w-8 h-8 bg-orange-500 rounded-full"></div>
        </nav>
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold">U</span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* Page Title */}
        <h1 className="text-4xl font-bold mb-8">Trips</h1>

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
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`pb-4 px-1 ml-8 text-lg font-medium border-b-2 transition-colors ${
              activeTab === 'past'
                ? 'border-white text-white'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Past
          </button>
        </div>

        {/* Trips List */}
        <div className="space-y-6">
          {filteredTrips.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              <p className="text-lg">No {activeTab} trips found</p>
            </div>
          ) : (
            filteredTrips.map((trip) => (
              <Card key={trip.id} className="bg-[#232428] border-none">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    {/* Trip Details */}
                    <div className="flex-1">
                      {/* Status Badge */}
                      <div className="mb-3">
                        <span 
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            trip.status === 'In progress' 
                              ? 'bg-yellow-600/20 text-yellow-400'
                              : trip.status === 'Confirmed'
                              ? 'bg-green-600/20 text-green-400'
                              : 'bg-gray-600/20 text-gray-400'
                          }`}
                        >
                          {trip.status}
                        </span>
                      </div>

                      {/* Car Name */}
                      <h2 className="text-2xl font-bold text-white mb-2">
                        {trip.carName}
                      </h2>

                      {/* Trip Times */}
                      <p className="text-gray-400 mb-4">
                        Pickup: {trip.pickup} • Return: {trip.return}
                      </p>

                      {/* Cancel Button (only for upcoming confirmed trips) */}
                      {activeTab === 'upcoming' && trip.status === 'Confirmed' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelTrip(trip.id)}
                          className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                        >
                          Cancel
                        </Button>
                      )}
                    </div>

                    {/* Car Image */}
                    <div className="ml-6 flex-shrink-0">
                      <img
                        src={trip.carImage}
                        alt={trip.carName}
                        className="w-80 h-48 object-cover rounded-lg"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Empty State for new users */}
        {filteredTrips.length === 0 && (
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
        )}
      </div>
    </div>
  )
}
