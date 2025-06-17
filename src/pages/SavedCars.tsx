import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { data } from "@/mockdata/index"
import { motion, AnimatePresence } from "framer-motion"

// Mock saved cars data using actual car data
const savedCarsData = [
  {
    id: 1,
    carData: data.find(car => car.brand === "Toyota" && car.name === "Corolla Altis"),
    savedDate: "2024-06-10"
  },
  {
    id: 2, 
    carData: data.find(car => car.brand === "Honda" && car.name === "Civic"),
    savedDate: "2024-06-08"
  },
  {
    id: 3,
    carData: data.find(car => car.brand === "Ford" && car.name === "Mustang GT"),
    savedDate: "2024-06-05"
  }
].filter(item => item.carData)

export default function SavedCarsPage() {
  const navigate = useNavigate()
  const [savedCars, setSavedCars] = useState(savedCarsData)
  const [expandedCarId, setExpandedCarId] = useState<number | null>(null)

  const handleBookNow = (carId: string) => {
    navigate(`/car/${carId}`)
  }

  const handleRemoveSaved = (savedCarId: number) => {
    setSavedCars(prev => prev.filter(car => car.id !== savedCarId))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  return (
    <motion.div 
      className="min-h-screen bg-[#18191C] text-white font-mono"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-[#232428]">
        <Link to="/" className="font-bold text-lg hover:text-gray-300 font-mono">
          DriveGo
        </Link>
        <nav className="flex gap-8 items-center font-mono">
          <Link to="/browse" className="hover:underline font-mono">Rent</Link>
          <Link to="/buy" className="hover:underline font-mono">Buy</Link>
          <Link to="/sell" className="hover:underline font-mono">Sell</Link>
          <Link to="/finance" className="hover:underline font-mono">Finance</Link>
          <Link to="/insurance" className="hover:underline font-mono">Insurance</Link>
        </nav>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="bg-[#2a2d32] text-white px-4 py-2 rounded-lg text-sm w-64 pl-10 font-mono placeholder:font-mono"
            />
            <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button className="p-2 hover:bg-[#2a2d32] rounded-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h12V7H4v12z" />
            </svg>
          </button>
          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold font-mono">U</span>
          </div>
        </div>
      </header>

      <motion.div 
        className="max-w-6xl mx-auto px-8 py-8 min-h-[80vh] flex flex-col"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        {/* Page Title */}
        <h1 className="text-4xl font-bold mb-8 font-mono">Saved cars</h1>

        {/* Saved Cars List */}
        <div className="flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {savedCars.length === 0 ? (
              <motion.div
                key="no-saved-cars"
                className="text-center py-16 flex-1 flex flex-col justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4 }}
              >
                <div className="w-24 h-24 bg-[#232428] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 font-mono">No saved cars yet</h3>
                <p className="text-gray-400 mb-6 font-mono">Start browsing and save cars you're interested in!</p>
                <Link to="/browse">
                  <Button className="bg-blue-600 hover:bg-blue-700 font-mono">
                    Browse Cars
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8">
                {savedCars.map((savedCar, idx) => {
                  if (!savedCar.carData) return null
                  
                  const car = savedCar.carData
                  const carSlug = `${car.brand.toLowerCase()}-${car.name.toLowerCase()}`.replace(/\s+/g, '-')
                  const isExpanded = expandedCarId === savedCar.id
                  
                  return (
                    <motion.div
                      key={savedCar.id}
                      className="relative min-h-[320px] flex items-stretch group"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 30 }}
                      transition={{ duration: 0.5, delay: idx * 0.08 }}
                    >
                      {/* Car image fills the card */}
                      <img
                        src={car.image}
                        alt={`${car.brand} ${car.name}`}
                        className="absolute inset-0 w-full h-full object-cover object-center rounded-2xl"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&h=300&fit=crop';
                        }}
                      />
                      {/* Overlay: car name and info icon */}
                      <div className="absolute left-0 right-0 bottom-0 p-6 flex items-end justify-between z-10 pointer-events-none">
                        <div className="bg-black/60 px-4 py-2 rounded-xl font-mono text-lg font-semibold text-white shadow-lg pointer-events-auto">
                          {car.brand} {car.name}
                        </div>
                        <div className="flex gap-2 pointer-events-auto">
                          <button
                            className="bg-black/60 hover:bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-colors"
                            aria-label={isExpanded ? 'Hide details' : 'Show details'}
                            onClick={() => setExpandedCarId(isExpanded ? null : savedCar.id)}
                            type="button"
                          >
                            {isExpanded ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z" /></svg>
                            )}
                          </button>
                          <button
                            className="bg-black/60 hover:bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-colors"
                            aria-label="Remove from saved"
                            onClick={() => handleRemoveSaved(savedCar.id)}
                            type="button"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </div>
                      {/* Expandable details modal */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            key="modal-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
                            onClick={() => setExpandedCarId(null)}
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
                                <span className="inline-block px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm font-medium font-mono">
                                  Saved
                                </span>
                                <button
                                  className="ml-2 bg-black/40 hover:bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md transition-colors"
                                  aria-label="Close details"
                                  onClick={() => setExpandedCarId(null)}
                                  type="button"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                              </div>
                              <h2 className="text-2xl font-bold text-white mb-4 font-mono">
                                {car.brand} {car.name}
                              </h2>
                              <div className="space-y-2 font-mono text-gray-300 mb-6">
                                <p>Type: {car.type}</p>
                                <p>Transmission: {car.transmission}</p>
                                <p>Fuel: {car.fuel_type}</p>
                                <p>Rating: {car.rating} stars</p>
                                <p>Price: ${car.price_per_day}/day</p>
                                <p className="text-blue-400 font-mono font-semibold">
                                  Saved on: {formatDate(savedCar.savedDate)}
                                </p>
                              </div>
                              <div className="flex gap-2 mt-4">
                                <Button
                                  onClick={() => handleBookNow(carSlug)}
                                  className="bg-blue-600 hover:bg-blue-700 text-white font-mono"
                                >
                                  Book Now
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => handleRemoveSaved(savedCar.id)}
                                  className="bg-transparent font-mono border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                                >
                                  Remove
                                </Button>
                              </div>
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Add more cars suggestion */}
        {savedCars.length > 0 && (
          <motion.div 
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <p className="text-gray-400 mb-4 font-mono">Looking for more options?</p>
            <Link to="/browse">
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white font-mono">
                Browse More Cars
              </Button>
            </Link>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}
