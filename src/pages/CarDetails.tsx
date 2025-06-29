import { useParams, Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"

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

const tabList = [
  { key: 'details', label: 'Details' },
  { key: 'reviews', label: 'Reviews' }
]

export default function CarDetailsPage() {
  const {data} = useCarData()
  const { id } = useParams()
  const navigate = useNavigate()
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details')

  const car = data.find(car => car.id!.toString() === id)

  if (!car) {
    return (
      <div className="min-h-screen bg-[#18191C] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 font-mono">Car Not Found</h1>
          <Button onClick={() => navigate('/browse')} className="font-mono">Back to Browse</Button>
        </div>
      </div>
    )
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-lg font-mono ${i < rating ? 'text-yellow-400' : 'text-gray-600'}`}>
        ★
      </span>
    ))
  }

  return (
    <motion.div className="min-h-screen bg-[#18191C] text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-[#232428]">
        <Link to="/" className="font-bold text-lg hover:text-gray-300 font-mono">
          DriveGo
        </Link>
        <nav className="flex gap-8 items-center font-mono">
          <Link to="/rent" className="hover:underline font-mono">Rent a car</Link>
          <Link to="/ride" className="hover:underline font-mono">Ride</Link>
          <Link to="/hotels" className="hover:underline font-mono">Hotels</Link>
          <Link to="/list" className="hover:underline font-mono">List your car</Link>
        </nav>
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold font-mono">U</span>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="px-8 py-4 text-sm text-gray-400 font-mono">
        <Link to="/browse" className="hover:text-white font-mono">All cars</Link>
        <span className="mx-2 font-mono">/</span>
        <span className="text-white font-mono">{car.brand} {car.name}</span>
      </div>

      {/* Hero Car Image with Book Now overlay */}
      <motion.div
        className="relative w-full h-screen flex items-end justify-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <motion.img
          src={car.image}
          alt={`${car.brand} ${car.name}`}
          className="absolute inset-0 w-full h-full object-cover object-center"
          initial={{ scale: 1.04, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
        />
        {/* Overlay gradient for readability */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
        {/* Book Now Button Centered at Bottom */}
        <motion.div
          className="relative z-10 mb-12 flex flex-col items-center w-full"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 px-10 py-4 text-lg font-semibold rounded-xl shadow-2xl font-mono"
            onClick={() => setIsBookingModalOpen(true)}
          >
            Book Now
          </Button>
          <div className="mt-4 text-white text-center font-mono text-xl font-bold drop-shadow-lg">
            {new Date().getFullYear()} {car.brand} {car.name}
          </div>
          <div className="text-gray-300 text-center font-mono text-md mt-1">
            Available in San Francisco, CA
          </div>
        </motion.div>
      </motion.div>

      {/* Tabs Section */}
      <motion.div
        className="max-w-3xl mx-auto mt-10 px-4 md:px-0 relative z-20"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
      >
        {/* Tabs Header */}
        <div className="flex border-b border-[#232428] mb-6 gap-2">
          {tabList.map(tab => (
            <button
              key={tab.key}
              className={`relative px-6 py-2 font-mono text-lg transition-colors duration-200 focus:outline-none
                ${activeTab === tab.key ? 'text-blue-400' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setActiveTab(tab.key as 'details' | 'reviews')}
            >
              {tab.label}
              {activeTab === tab.key && (
                <motion.div
                  layoutId="tab-underline"
                  className="absolute left-0 right-0 -bottom-1 h-1 rounded bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600"
                  style={{ zIndex: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
        {/* Tabs Content */}
        <div className="min-h-[220px]">
          <AnimatePresence mode="wait">
            {activeTab === 'details' && (
              <motion.div
                key="details"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4 }}
                className="bg-[#232428]/95 rounded-2xl shadow-xl p-8"
              >
                <h2 className="text-xl font-semibold mb-4 font-mono">About this car</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-gray-400 text-sm mb-1 font-mono">Fuel</p>
                    <p className="font-medium font-mono">{car.fuel_type}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1 font-mono">Transmission</p>
                    <p className="font-medium font-mono">{car.transmission}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1 font-mono">Rating</p>
                    <p className="font-medium font-mono flex items-center gap-1">{car.rating} {renderStars(car.rating)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1 font-mono">Seats</p>
                    <p className="font-medium font-mono">5</p>
                  </div>
                </div>
              </motion.div>
            )}
            {activeTab === 'reviews' && (
              <motion.div
                key="reviews"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4 }}
                className="bg-[#232428]/95 rounded-2xl shadow-xl p-8"
              >
                <h2 className="text-xl font-semibold mb-6 font-mono">Reviews</h2>
                <div className="space-y-6">
                  {mockReviews.map(review => (
                    <Card key={review.id} className="bg-[#232428] border-none">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold font-mono">{review.avatar}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold font-mono">{review.name}</h3>
                              <span className="text-gray-400 text-sm font-mono">{review.date}</span>
                            </div>
                            <div className="flex items-center gap-1 mb-3">
                              {renderStars(review.rating)}
                            </div>
                            <p className="text-gray-300 mb-4 font-mono">{review.comment}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-400 font-mono">
                              <button className="flex items-center gap-1 hover:text-white font-mono">
                                <span className="font-mono">👍</span>
                                <span className="font-mono">{review.likes}</span>
                              </button>
                              <button className="flex items-center gap-1 hover:text-white font-mono">
                                <span className="font-mono">👎</span>
                                <span className="font-mono">{review.dislikes}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        car={car}
      />
    </motion.div>
  )
}
