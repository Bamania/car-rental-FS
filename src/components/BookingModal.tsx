import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import MapLocationPicker from "./MapLocationPicker"
import axios from "axios"
import { useParams } from "react-router-dom"
import type { BookingModalProps } from "@/pages/types"
import { useAuth } from "@/hooks/useAuth"
import { motion, AnimatePresence } from "framer-motion"
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function BookingModal({ isOpen, onClose, car }: BookingModalProps) {
  const navigate = useNavigate()
  const [days, setDays] = useState(1)
  const [isAvailabilityChecked, setIsAvailabilityChecked] = useState(false)
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false)
  const [isCarAvailable, setIsCarAvailable] = useState(false)
  const { name, email } = useAuth()
  const { id } = useParams()

  const subtotal = car.price_per_day * days
  const taxes = Math.round(subtotal * 0.1)
  const total = subtotal + taxes

  const [formData, setFormData] = useState({
    carId: parseInt(id!),
    pickupDate: '',
    dropoffDate: '',
    pickupLocation: '',
    totalPrice: total
  })

  const [isMapOpen, setIsMapOpen] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    if (field === 'pickupDate' || field === 'dropoffDate') {
      setIsAvailabilityChecked(false)
      setIsCarAvailable(false)

      const pickup = field === 'pickupDate' ? value : formData.pickupDate
      const dropoff = field === 'dropoffDate' ? value : formData.dropoffDate

      if (pickup && dropoff) {
        const pickupDate = new Date(pickup)
        const dropoffDate = new Date(dropoff)
        const diffTime = Math.abs(dropoffDate.getTime() - pickupDate.getTime())
        const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
        setDays(diffDays)
      }
    }
  }

  const handleLocationSelect = (location: { lat: number; lng: number; address: string }) => {
    setFormData(prev => ({
      ...prev,
      pickupLocation: location.address
    }))
    setIsMapOpen(false)
  }

  const handleCheckAvailability = async () => {
    setIsCheckingAvailability(true)
    try {
      const response = await axios.post(`${backendUrl}/api/check-availability`, {
        carId: parseInt(id!),
        pickupDate: formData.pickupDate,
        dropoffDate: formData.dropoffDate
      }, {
        withCredentials: true
      })

      const available = response.data.available
      setIsCarAvailable(available)
      setIsAvailabilityChecked(true)

      if (!available) {
        const errorMessage = response.data.errors?.length > 0
          ? response.data.errors.join('\n')
          : 'Car is not available for the selected dates.'
        alert(`Sorry, this car is not available:\n\n${errorMessage}\n\nPlease choose different dates.`)
      } else {
        alert('Great! This car is available for your selected dates. You can now proceed with booking.')
      }
    } catch (error) {
      console.error('Error checking availability:', error)
      alert('Error checking availability. Please try again.')
      setIsAvailabilityChecked(false)
      setIsCarAvailable(false)
    } finally {
      setIsCheckingAvailability(false)
    }
  }

  const handleConfirmBooking = async () => {
    try {
      const response = await axios.post(`${backendUrl}/api/book`, {
        formData
      }, {
        withCredentials: true
      });

      if (response.data.success) {
        alert(`Booking confirmed for ${car.brand} ${car.name}!\nTotal: $${total}\nRedirecting to trips page...`)
        onClose()
        setTimeout(() => {
          navigate('/trips')
        }, 1000)
      }
    } catch (error: any) {
      console.error('Booking error:', error)

      if (error.response?.status === 409) {
        alert('Sorry, this car was just booked by another user. Please check availability again.')
        setIsAvailabilityChecked(false)
        setIsCarAvailable(false)
      } else if (error.response?.status === 400 && error.response?.data?.errors) {
        const errorMessages = error.response.data.errors.join('\n')
        alert(`Booking failed:\n${errorMessages}`)
        setIsAvailabilityChecked(false)
        setIsCarAvailable(false)
      } else {
        alert('Booking failed. Please try again.')
      }
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 font-mono"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        style={{ backdropFilter: 'blur(6px)' }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 30 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          <Card className="bg-[#232428]/80 border border-[#232428] shadow-2xl rounded-2xl backdrop-blur-xl overflow-hidden">
            <CardContent className="p-0">
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#232428] bg-[#232428]/70">
                <h2 className="text-2xl font-bold text-white font-mono">Your trip</h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white text-2xl font-mono rounded-full w-10 h-10 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              {/* Modal Body */}
              <div className="space-y-5 px-6 py-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2 font-mono">
                      Pick-up
                    </label>
                    <input
                      type="date"
                      value={formData.pickupDate}
                      onChange={(e) => handleInputChange('pickupDate', e.target.value)}
                      className="w-full bg-[#18191C]/80 border border-[#3a3d42] rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2 font-mono">
                      Drop-off
                    </label>
                    <input
                      type="date"
                      value={formData.dropoffDate}
                      onChange={(e) => handleInputChange('dropoffDate', e.target.value)}
                      className="w-full bg-[#18191C]/80 border border-[#3a3d42] rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div className="relative flex flex-col">
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-white text-sm font-medium font-mono">
                      Pick-up location
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsMapOpen(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors font-mono shadow-md"
                      style={{ zIndex: 2 }}
                    >
                      📍 Map
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter pickup location"
                    value={formData.pickupLocation}
                    onChange={(e) => handleInputChange('pickupLocation', e.target.value)}
                    className="w-full bg-[#18191C]/80 border border-[#3a3d42] rounded-lg px-3 py-2 pr-12 text-white font-mono placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2 font-mono">
                      Name
                    </label>
                    <input
                      type="text"
                      value={name!}
                      className="w-full bg-[#18191C]/80 border border-[#3a3d42] rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500 transition-all"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2 font-mono">
                      Email address
                    </label>
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      value={email!}
                      className="w-full bg-[#18191C]/80 border border-[#3a3d42] rounded-lg px-3 py-2 text-white font-mono placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all"
                      readOnly
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-white mb-4 font-mono">Price summary</h3>
                  <div className="space-y-3 font-mono">
                    <div className="flex justify-between text-gray-300">
                      <span>Subtotal ({days} {days === 1 ? 'day' : 'days'})</span>
                      <span>${subtotal}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Taxes & fees</span>
                      <span>${taxes}</span>
                    </div>
                    <div className="border-t border-[#3a3d42] pt-3">
                      <div className="flex justify-between text-white font-semibold text-lg font-mono">
                        <span>Total</span>
                        <span>${total}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleCheckAvailability}
                  className="w-full bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-semibold py-3 mt-6 font-mono shadow-lg transition-all"
                  disabled={!formData.pickupDate || !formData.dropoffDate || !formData.pickupLocation || isCheckingAvailability}
                >
                  {isCheckingAvailability ? 'Checking...' : 'Check Availability'}
                </Button>

                {isAvailabilityChecked && isCarAvailable && (
                  <Button
                    onClick={handleConfirmBooking}
                    className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-3 mt-2 font-mono shadow-lg transition-all"
                  >
                    Confirm booking
                  </Button>
                )}

                {isAvailabilityChecked && !isCarAvailable && (
                  <div className="w-full bg-red-600/20 border border-red-600 text-red-400 text-center py-3 mt-2 rounded-lg font-mono">
                    This car is not available for the selected dates
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <MapLocationPicker
          isOpen={isMapOpen}
          onClose={() => setIsMapOpen(false)}
          onLocationSelect={handleLocationSelect}
        />
      </motion.div>
    </AnimatePresence>
  )
}
