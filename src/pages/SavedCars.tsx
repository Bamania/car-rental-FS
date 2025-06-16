import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { data } from "@/mockdata/index"

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
].filter(item => item.carData) // Remove any undefined entries

export default function SavedCarsPage() {
  const navigate = useNavigate()
  const [savedCars, setSavedCars] = useState(savedCarsData)

  const handleBookNow = (carId: string) => {
    navigate(`/car/${carId}`)
  }

  const handleRemoveSaved = (savedCarId: number) => {
    setSavedCars(prev => prev.filter(car => car.id !== savedCarId))
  }

  return (
    <div className="min-h-screen bg-[#18191C] text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-[#232428]">
        <Link to="/" className="font-bold text-lg hover:text-gray-300">
          DriveGo
        </Link>
        <nav className="flex gap-8 items-center">
          <Link to="/browse" className="hover:underline">Rent</Link>
          <Link to="/buy" className="hover:underline">Buy</Link>
          <Link to="/sell" className="hover:underline">Sell</Link>
          <Link to="/finance" className="hover:underline">Finance</Link>
          <Link to="/insurance" className="hover:underline">Insurance</Link>
        </nav>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="bg-[#2a2d32] text-white px-4 py-2 rounded-lg text-sm w-64 pl-10"
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
            <span className="text-sm font-bold">U</span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* Page Title */}
        <h1 className="text-4xl font-bold mb-8">Saved cars</h1>

        {/* Saved Cars List */}
        {savedCars.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-[#232428] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No saved cars yet</h3>
            <p className="text-gray-400 mb-6">Start browsing and save cars you're interested in!</p>
            <Link to="/browse">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Browse Cars
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {savedCars.map((savedCar) => {
              if (!savedCar.carData) return null
              
              const car = savedCar.carData
              const carSlug = `${car.brand.toLowerCase()}-${car.name.toLowerCase()}`.replace(/\s+/g, '-')
              
              return (
                <Card key={savedCar.id} className="bg-[#232428] border-none">
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between">
                      {/* Car Details */}
                      <div className="flex-1 p-8">
                        {/* Saved Badge */}
                        <div className="mb-3">
                          <span className="inline-block px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm font-medium">
                            Saved
                          </span>
                        </div>

                        {/* Car Name */}
                        <h2 className="text-2xl font-bold text-white mb-2">
                          {new Date().getFullYear()} {car.brand} {car.name}
                        </h2>

                        {/* Car Specs */}
                        <p className="text-gray-400 mb-6">
                          {car.type} • Seats 5 • {car.transmission}
                        </p>

                        <div className="flex items-center gap-4">
                          {/* Book Now Button */}
                          <Button
                            onClick={() => handleBookNow(carSlug)}
                            className="bg-[#3a3d42] hover:bg-[#4a4d52] text-white border border-[#4a4d52]"
                          >
                            Book now
                          </Button>

                          {/* Remove from Saved */}
                          <button
                            onClick={() => handleRemoveSaved(savedCar.id)}
                            className="text-gray-400 hover:text-red-400 text-sm transition-colors"
                          >
                            Remove from saved
                          </button>
                        </div>
                      </div>

                      {/* Car Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={car.image}
                          alt={`${car.brand} ${car.name}`}
                          className="w-96 h-64 object-cover rounded-r-lg"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Add more cars suggestion */}
        {savedCars.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-gray-400 mb-4">Looking for more options?</p>
            <Link to="/browse">
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white">
                Browse More Cars
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
