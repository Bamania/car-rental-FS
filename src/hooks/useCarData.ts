import { CarDataContext } from "@/pages/context/carData";
import { useContext } from "react";

export const useCarData =()=>{

  const carData=useContext(CarDataContext)
  if(carData===undefined){
    throw new Error ('Some Error occured')
  }

  return carData.data;
}