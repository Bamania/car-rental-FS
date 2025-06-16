import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  car: {
    brand: string
    name: string
    price_per_day: number
  }
}

export default function BookingModal({ isOpen, onClose, car }: BookingModalProps) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    pickupDate: '',
    dropoffDate: '',
    pickupLocation: '',
    firstName: '',
    phoneNumber: '',
    emailAddress: ''
  })

  const [days, setDays] = useState(1)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Calculate days if dates are provided
    if (field === 'pickupDate' || field === 'dropoffDate') {
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

  const subtotal = car.price_per_day * days
  const taxes = Math.round(subtotal * 0.1) // 10% tax
  const total = subtotal + taxes
  const handleConfirmBooking = () => {
    // Handle booking confirmation logic here
    alert(`Booking confirmed for ${car.brand} ${car.name}!\nTotal: $${total}\nRedirecting to trips page...`)
    onClose()
    // Navigate to trips page to show the new booking
    setTimeout(() => {
      navigate('/trips')
    }, 1000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="bg-[#18191C] border-[#232428] max-w-md w-full max-h-[90vh] overflow-y-auto">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Your trip</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white text-xl"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            {/* Pick-up and Drop-off dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Pick-up
                </label>
                <input
                  type="date"
                  value={formData.pickupDate}
                  onChange={(e) => handleInputChange('pickupDate', e.target.value)}
                  className="w-full bg-[#2a2d32] border border-[#3a3d42] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Drop-off
                </label>
                <input
                  type="date"
                  value={formData.dropoffDate}
                  onChange={(e) => handleInputChange('dropoffDate', e.target.value)}
                  className="w-full bg-[#2a2d32] border border-[#3a3d42] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Pick-up location */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Pick-up location
              </label>
              <input
                type="text"
                placeholder="Enter pickup location"
                value={formData.pickupLocation}
                onChange={(e) => handleInputChange('pickupLocation', e.target.value)}
                className="w-full bg-[#2a2d32] border border-[#3a3d42] rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* First name */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                First name
              </label>
              <input
                type="text"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="w-full bg-[#2a2d32] border border-[#3a3d42] rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Phone number */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Phone number
              </label>
              <input
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                className="w-full bg-[#2a2d32] border border-[#3a3d42] rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Email address */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Email address
              </label>
              <input
                type="email"
                placeholder="Enter your email address"
                value={formData.emailAddress}
                onChange={(e) => handleInputChange('emailAddress', e.target.value)}
                className="w-full bg-[#2a2d32] border border-[#3a3d42] rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Price summary */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-white mb-4">Price summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal ({days} {days === 1 ? 'day' : 'days'})</span>
                  <span>${subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Taxes & fees</span>
                  <span>${taxes}</span>
                </div>
                <div className="border-t border-[#3a3d42] pt-3">
                  <div className="flex justify-between text-white font-semibold text-lg">
                    <span>Total</span>
                    <span>${total}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Confirm booking button */}
            <Button 
              onClick={handleConfirmBooking}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 mt-6"
              disabled={!formData.pickupDate || !formData.dropoffDate || !formData.firstName || !formData.emailAddress}
            >
              Confirm booking
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
