import { useState, useEffect, useCallback } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
// import { data } from "@/mockdata/index"
import type { FilterState } from "./types"
import { useCarData } from "@/hooks/useCarData"



export default function BrowsePage() {
  const navigate = useNavigate()
  const [displayedItems, setDisplayedItems] = useState(12) // Start with 12 items
  const [isLoading, setIsLoading] = useState(false)
  const [savedCars, setSavedCars] = useState<number[]>([]) // Track saved car IDs
  const data = useCarData();
  
  const [filters, setFilters] = useState<FilterState>({
    carType: [],
    fuelType: [],
    transmission: [],
    rating: [],
    priceRange: [0, 300]
  })

  const itemsPerLoad = 8 // Items to load per scroll

  const filteredData = data.filter(car => {
    const matchesCarType = filters.carType.length === 0 || filters.carType.includes(car.type)
    const matchesFuelType = filters.fuelType.length === 0 || filters.fuelType.includes(car.fuel_type)
    const matchesTransmission = filters.transmission.length === 0 || filters.transmission.includes(car.transmission)
    const matchesRating = filters.rating.length === 0 || filters.rating.some(rating => car.rating >= rating)
    const matchesPrice = car.price_per_day >= filters.priceRange[0] && car.price_per_day <= filters.priceRange[1]
    
    return matchesCarType && matchesFuelType && matchesTransmission && matchesRating && matchesPrice
  })

  // Get currently displayed data
  const displayedData = filteredData.slice(0, displayedItems)
  const hasMore = displayedItems < filteredData.length

  // Infinite scroll logic
  const loadMoreItems = useCallback(() => {
    if (isLoading || !hasMore) return
    
    setIsLoading(true)
    // Simulate loading delay for better UX
    setTimeout(() => {
      setDisplayedItems(prev => prev + itemsPerLoad)
      setIsLoading(false)
    }, 500)
  }, [isLoading, hasMore, itemsPerLoad])

  // Scroll event handler
  const handleScroll = useCallback(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight

    // Load more when user scrolls to 80% of the page
    if (scrollTop + windowHeight >= documentHeight * 0.8) {
      loadMoreItems()
    }
  }, [loadMoreItems])

  // Add scroll listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // Reset displayed items when filters change
  useEffect(() => {
    setDisplayedItems(12) // Reset to initial count
  }, [filters])

  const handleFilterChange = (filterType: keyof FilterState, value: string | number | [number, number]) => {
    setFilters(prev => {
      if (filterType === 'priceRange') {
        return { ...prev, [filterType]: value as [number, number] }
      }
      
      const currentValues = prev[filterType] as (string | number)[]
      const newValues = currentValues.includes(value as string | number)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value as string | number]
        return { ...prev, [filterType]: newValues }
    })
    // Filters will reset displayedItems via useEffect
  }

  const handleSaveCar = (carId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setSavedCars(prev => 
      prev.includes(carId) 
        ? prev.filter(id => id !== carId)
        : [...prev, carId]
    )
  }

  return (
    <div className="min-h-screen bg-[#18191C] text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-[#232428]">
        <Link to="/" className="font-bold text-lg hover:text-gray-300">
          AutoZen
        </Link>
        <nav className="flex gap-8 items-center">
          <span className="text-blue-400">Ride</span>
          <Link to="/rent" className="hover:underline">Rent</Link>
          <Link to="/eat" className="hover:underline">Eat</Link>
          <Link to="/charter" className="hover:underline">Charter</Link>
        </nav>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="bg-[#2a2d32] text-white px-4 py-2 rounded-lg text-sm w-64"
            />
          </div>
          
          
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Filters */}
        <aside className="w-64 p-6 bg-[#1a1b1f] border-r border-[#232428]">
          <h2 className="text-xl font-semibold mb-6">Filter</h2>
          
          {/* Car Type Filter */}
          <div className="mb-6">
            <h3 className="font-medium mb-3">Car Type</h3>
            <div className="space-y-2">
              {['SUV', 'Sedan', 'Truck', 'Van', 'Hatchback', 'Coupe'].map(type => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-400"
                    checked={filters.carType.includes(type)}
                    onChange={() => handleFilterChange('carType', type)}
                  />
                  <span className="text-sm">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Fuel Type Filter */}
          <div className="mb-6">
            <h3 className="font-medium mb-3">Fuel Type</h3>
            <div className="space-y-2">
              {['Petrol', 'Diesel', 'Electric', 'Hybrid'].map(fuel => (
                <label key={fuel} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-400"
                    checked={filters.fuelType.includes(fuel)}
                    onChange={() => handleFilterChange('fuelType', fuel)}
                  />
                  <span className="text-sm">{fuel}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Transmission Filter */}
          <div className="mb-6">
            <h3 className="font-medium mb-3">Transmission</h3>
            <div className="space-y-2">
              {['Automatic', 'Manual'].map(trans => (
                <label key={trans} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-400"
                    checked={filters.transmission.includes(trans)}
                    onChange={() => handleFilterChange('transmission', trans)}
                  />
                  <span className="text-sm">{trans}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rating Filter */}
          <div className="mb-6">
            <h3 className="font-medium mb-3">Rating</h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map(rating => (
                <label key={rating} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-400"
                    checked={filters.rating.includes(rating)}
                    onChange={() => handleFilterChange('rating', rating)}
                  />
                  <span className="text-sm">{rating} stars</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <h3 className="font-medium mb-3">Price Range</h3>
            <div className="text-sm text-gray-400 mb-2">Price per day</div>
            <input
              type="range"
              min="0"
              max="300"
              value={filters.priceRange[1]}
              onChange={(e) => handleFilterChange('priceRange', [0, parseInt(e.target.value)])}
              className="w-full accent-blue-500"
            />
            <div className="text-sm text-gray-400 mt-1">
              $0 - ${filters.priceRange[1]}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">          <h1 className="text-2xl font-semibold mb-6">Available Cars ({filteredData.length} results)</h1>
            {/* Cars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {displayedData.map((car, index) => {
              const carId = car.id 
              console.log("Carid", carId)
              return (
              <Card 
                  key={`${car.name}-${index}`} 
                  className="bg-[#232428] border-none rounded-lg overflow-hidden cursor-pointer hover:bg-[#2a2d32] transition-colors"
                  onClick={() => navigate(`/car/${carId}`)}
                >                  
                <div className="relative">
                    <img
                      src={car.image}
                      alt={`${car.brand} ${car.name}`}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-black/50 px-2 py-1 rounded text-xs">
                      {car.rating} stars
                    </div>
                    {/* Save/Heart Button */}
                    <button
                      onClick={(e) => handleSaveCar(carId!, e)}
                      className="absolute top-2 right-2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                    >
                      <svg 
                        className={`w-5 h-5 ${savedCars.includes(carId!) ? 'text-red-500 fill-current' : 'text-white'}`}
                        fill={savedCars.includes(carId!) ? "currentColor" : "none"}
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-white text-lg mb-1">{car.brand} {car.name}</h3>
                    <p className="text-gray-400 text-sm mb-2">{car.type}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-white font-semibold">${car.price_per_day}/day</span>                      <Button 
                        size="sm" 
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/car/${carId}`)
                        }}
                      >
                        Rent
                      </Button>
                    </div>
                    <p className="text-white">
                    {car.description}
                      
                    </p>
                  </CardContent>
                </Card>
              )
            })}          </div>

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-400">Loading more cars...</span>
            </div>
          )}

          {/* End of results indicator */}
          {!hasMore && displayedData.length > 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400">You've seen all available cars!</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setDisplayedItems(12)}
              >
                Back to Top
              </Button>
            </div>
          )}

          {/* No results */}
          {filteredData.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-[#232428] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.291-1.1-5.291-2.709M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No cars found</h3>
              <p className="text-gray-400 mb-6">Try adjusting your filters to see more results</p>
              <Button 
                onClick={() => {
                  setFilters({
                    carType: [],
                    fuelType: [],
                    transmission: [],
                    rating: [],
                    priceRange: [0, 300]
                  })
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
