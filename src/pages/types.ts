export interface  Car  {
    id?: number;
    brand: string;
    name: string;
    type: string;
    price_per_day: number;
  fuel_type: string;
  transmission:string,
  image: string;
  rating: number;
  description:string
}
export interface FilterState {
  carType: string[]
  fuelType: string[]
  transmission: string[]
  rating: number[]
  priceRange: [number, number]
}
export interface BookedCar {
  id: number;
  pickupDate: string;
  dropoffDate: string;
  pickupLocation: string;
  totalPrice: number;
  createdAt: string;
  car: {
    id: number;
    brand: string;
    name: string;
    image: string;
    price_per_day: number;
  };
}
export interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  car: {
    brand: string
    name: string
    price_per_day: number
  }
}