import { useState, useCallback, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import { Icon, LatLng } from 'leaflet'
import { Button } from '@/components/ui/button'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in react-leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

// Default marker icon configuration
const DefaultIcon = new Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

interface LocationData {
  lat: number
  lng: number
  address: string
}

interface MapLocationPickerProps {
  isOpen: boolean
  onClose: () => void
  onLocationSelect: (location: LocationData) => void
  initialLocation?: LocationData
}

// Component to handle map clicks
function LocationMarker({ 
  position, 
  setPosition 
}: { 
  position: LatLng | null
  setPosition: (position: LatLng) => void 
}) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng)
    },
  })

  return position === null ? null : (
    <Marker position={position} icon={DefaultIcon} />
  )
}

export default function MapLocationPicker({ 
  isOpen, 
  onClose, 
  onLocationSelect, 
  initialLocation 
}: MapLocationPickerProps) {
  const [position, setPosition] = useState<LatLng | null>(
    initialLocation ? new LatLng(initialLocation.lat, initialLocation.lng) : null
  )
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)

  // Default center (you can change this to your city)
  const defaultCenter: [number, number] = [40.7128, -74.0060] // New York City

  // Reverse geocoding function
  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    setLoading(true)
    try {
      // Using OpenStreetMap Nominatim API for reverse geocoding (free)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      )
      const data = await response.json()
      
      if (data && data.display_name) {
        setAddress(data.display_name)
      } else {
        setAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`)
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error)
      setAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`)
    } finally {
      setLoading(false)
    }
  }, [])

  // Update address when position changes
  useEffect(() => {
    if (position) {
      reverseGeocode(position.lat, position.lng)
    }
  }, [position, reverseGeocode])

  const handleConfirm = () => {
    if (position) {
      onLocationSelect({
        lat: position.lat,
        lng: position.lng,
        address: address
      })
      onClose()
    }
  }

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPos = new LatLng(position.coords.latitude, position.coords.longitude)
          setPosition(newPos)
          setLoading(false)
        },
        (error) => {
          console.error('Error getting location:', error)
          setLoading(false)
          alert('Unable to get your current location. Please select manually on the map.')
        }
      )
    } else {
      alert('Geolocation is not supported by this browser.')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#18191C] border border-[#232428] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#232428]">
          <h3 className="text-xl font-semibold text-white">Select Pickup Location</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl"
          >
            ×
          </button>
        </div>

        {/* Map Container */}
        <div className="h-96 relative">
          <MapContainer
            center={position ? [position.lat, position.lng] : defaultCenter}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker position={position} setPosition={setPosition} />
          </MapContainer>
        </div>

        {/* Controls */}
        <div className="p-4 space-y-4">
          {/* Current Location Button */}
          <Button
            onClick={handleGetCurrentLocation}
            variant="outline"
            className="w-full bg-[#2a2d32] border-[#3a3d42] text-white hover:bg-[#3a3d42]"
            disabled={loading}
          >
            {loading ? 'Getting location...' : 'Use Current Location'}
          </Button>

          {/* Selected Address Display */}
          {position && (
            <div className="bg-[#2a2d32] border border-[#3a3d42] rounded-lg p-3">
              <p className="text-sm text-gray-400 mb-1">Selected Location:</p>
              <p className="text-white text-sm">
                {loading ? 'Getting address...' : address}
              </p>
            </div>
          )}

          <p className="text-gray-400 text-sm text-center">
            Tap on the map to select your pickup location
          </p>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 bg-transparent border-[#3a3d42] text-white hover:bg-[#2a2d32]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!position || loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Confirm Location
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
