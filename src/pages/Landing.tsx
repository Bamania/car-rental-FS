import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import sidecar from "@/assets/images/carSide.jpg"
import { data } from "@/mockdata/index"
import { Link ,useNavigate} from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import axios from "axios"
import { CarDataContext, useCarData } from "@/context/carData"

type Car = {
  brand: string
  name: string
  type: string
  price_per_day: number
  fuel_type: string
  image: string
  rating: number
}

export default function LandingPage() {
  const navigate = useNavigate()
  const data=useCarData();



  const featuredCars = data.slice(0, 3).map(car => ({
    id: `${car.brand.toLowerCase()}-${car.name.toLowerCase()}`.replace(/\s+/g, '-'),
    title: `${car.brand} ${car.name}`,
    desc: `${car.type} - $${car.price_per_day}/day - ${car.fuel_type}`,
    img: car.image,
  }))

  const topRated = data
    .filter(car => car.rating >= 4.6)
    .slice(0, 3)
    .map(car => ({
      id: `${car.brand.toLowerCase()}-${car.name.toLowerCase()}`.replace(/\s+/g, '-'),
      title: `${car.brand} ${car.name}`,
      desc: `Rating: ${car.rating}/5 - $${car.price_per_day}/day`,
      img: car.image,
    }))



  return (
    <div className="min-h-screen w-full bg-[#18191C] text-white">
      <header className="flex items-center justify-between px-8 py-4 border-b border-[#232428]">
        <span className="font-bold text-lg">DriveGo</span>
        <nav className="flex gap-8 items-center">
            <Link to="/browse">Browse</Link>
        <Link to="/booking">My Bookings</Link>
          <Button variant="outline" className="ml-4">Login/Signup</Button>
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Hero Section */}
        <section className="relative rounded-xl overflow-hidden mb-12">
          <img
            src={sidecar}
            alt="Experience the thrill"
            className="w-full h-64 md:h-80 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Experience the thrill of the open road
            </h1>
            <p className="text-lg text-neutral-200">
              Rent your dream car today and embark on an unforgettable journey.
            </p>
          </div>
        </section>

        {/* Featured Cars */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-5">Featured Cars</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">            {featuredCars.map((car) => (
             <Card 
               onClick={() => navigate(`/car/${car.id}`)} 
               key={car.title} 
               className="bg-[#232428] border-none rounded-xl overflow-hidden flex flex-col cursor-pointer hover:bg-[#2a2b30] transition-colors"
             >
                <CardHeader className="p-0">
                  <img
                    src={car.img}
                    alt={car.title}
                    className="w-full h-40 object-cover rounded-t-xl"
                  />
                </CardHeader>
                <CardContent className="p-4 flex-1 flex flex-col">
                  <CardTitle className="text-lg font-semibold mb-1">{car.title}</CardTitle>
                  <p className="text-sm text-gray-300">{car.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Top-Rated Listings */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-5">Top-Rated Listings</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">            {topRated.map((car) => (
              <Card 
                onClick={() => navigate(`/car/${car.id}`)} 
                key={car.title} 
                className="bg-[#232428] border-none rounded-xl overflow-hidden flex flex-col cursor-pointer hover:bg-[#2a2b30] transition-colors"
              >
                <CardHeader className="p-0">
                  <img
                    src={car.img}
                    alt={car.title}
                    className="w-full h-40 object-cover rounded-t-xl"
                  />
                </CardHeader>
                <CardContent className="p-4 flex-1 flex flex-col">
                  <CardTitle className="text-lg font-semibold mb-1">{car.title}</CardTitle>
                  <p className="text-sm text-gray-300">{car.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Why Choose DriveGo */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-5">Why Choose DriveGo?</h2>
          <p className="mb-8 text-gray-300">
            We are committed to providing a seamless and enjoyable car rental experience.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-[#232428] border-none rounded-xl p-6 flex flex-col">
              <CardHeader className="p-0 mb-2">
                <CardTitle className="text-base font-semibold">Wide Selection</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-sm text-gray-300">
                  Choose from a diverse range of vehicles to suit your needs.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-[#232428] border-none rounded-xl p-6 flex flex-col">
              <CardHeader className="p-0 mb-2">
                <CardTitle className="text-base font-semibold">Competitive Pricing</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-sm text-gray-300">
                  Enjoy the best rates and transparent pricing with no hidden fees.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-[#232428] border-none rounded-xl p-6 flex flex-col">
              <CardHeader className="p-0 mb-2">
                <CardTitle className="text-base font-semibold">24/7 Support</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-sm text-gray-300">
                  Our dedicated support team is available around the clock to assist you.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  )
}
