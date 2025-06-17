import { useParams, Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import BookingModal from "@/components/BookingModal"
import { useCarData } from "@/hooks/useCarData"
// Mock reviews data
const mockReviews = [
  {
    id: 1,
    name: "Sophia Carter",
    date: "Jun 18, 2023",
    rating: 5,
    comment: "The Toyota Camry was perfect for our family trip. Spacious, comfortable, and very fuel-efficient. Highly recommend!",
    likes: 12,
    dislikes: 2,
    avatar: "SC"
  },
  {
    id: 2,
    name: "Ethan Bennett",
    date: "Jun 22, 2023",
    rating: 4,
    comment: "Overall, a good experience. The car was clean and drove well, but there were a few minor scratches on the exterior.",
    likes: 8,
    dislikes: 1,
    avatar: "EB"
  }
]

export default function CarDetailsPage() {
  const data=useCarData()
 const { id } = useParams() 
  const navigate = useNavigate()
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  
  
 const car = data.find(car => car.id!.toString() === id)

  if (!car) {
    return (
      <div className="min-h-screen bg-[#18191C] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Car Not Found</h1>
          <Button onClick={() => navigate('/browse')}>Back to Browse</Button>
        </div>
      </div>
    )
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-600'}`}>
        ★
      </span>
    ))
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
          <Link to="/ride" className="hover:underline">Ride</Link>
          <Link to="/hotels" className="hover:underline">Hotels</Link>
          <Link to="/list" className="hover:underline">List your car</Link>
        </nav>
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold">U</span>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="px-8 py-4 text-sm text-gray-400">
        <Link to="/browse" className="hover:text-white">All cars</Link>
        <span className="mx-2">/</span>
        <span className="text-white">{car.brand} {car.name}</span>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-6">
        {/* Car Image */}
        <div className="mb-8">
          <img
            src={car.image}
            alt={`${car.brand} ${car.name}`}
            className="w-full h-96 object-cover rounded-lg bg-gradient-to-b from-gray-300 to-gray-500"
          />
        </div>

        {/* Car Title and Location */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">
            {new Date().getFullYear()} {car.brand} {car.name}
          </h1>
          <p className="text-gray-400">Available in San Francisco, CA</p>
        </div>

        {/* About this car */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">About this car</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-gray-400 text-sm mb-1">Fuel</p>
              <p className="font-medium">{car.fuel_type}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Transmission</p>
              <p className="font-medium">{car.transmission}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Rating</p>
              <p className="font-medium">{car.rating}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Seats</p>
              <p className="font-medium">5</p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-6">Reviews</h2>
          <div className="space-y-6">
            {mockReviews.map(review => (
              <Card key={review.id} className="bg-[#232428] border-none">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold">{review.avatar}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{review.name}</h3>
                        <span className="text-gray-400 text-sm">{review.date}</span>
                      </div>
                      <div className="flex items-center gap-1 mb-3">
                        {renderStars(review.rating)}
                      </div>
                      <p className="text-gray-300 mb-4">{review.comment}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <button className="flex items-center gap-1 hover:text-white">
                          <span>👍</span>
                          <span>{review.likes}</span>
                        </button>
                        <button className="flex items-center gap-1 hover:text-white">
                          <span>👎</span>
                          <span>{review.dislikes}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>        {/* Book Now Button */}
        <div className="fixed bottom-8 right-8">
          <Button 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg font-semibold rounded-lg shadow-lg"
            onClick={() => setIsBookingModalOpen(true)}
          >
            Book Now
          </Button>
        </div>

        {/* Booking Modal */}
        <BookingModal 
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          car={car}
        /> 
      </div>
    </div>
  )
}
