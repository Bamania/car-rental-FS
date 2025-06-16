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