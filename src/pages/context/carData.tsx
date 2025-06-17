import type { Car } from "@/pages/types";
import axios from "axios";
import { createContext, useEffect, useState, type ReactNode } from "react";
const backendUrl = import.meta.env.VITE_BACKEND_URL;



type CarDataContextType = {
  data: Car[];
}

export const CarDataContext = createContext<CarDataContextType | undefined>(undefined);


export const CarDataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<Car[]>([]);
  const fetchFunction = async () => {
  
    
    const response = await axios.get(`${backendUrl}/api/cars`);
    console.log(response.data)
    setData(response.data)
  }
  useEffect(() => {
    fetchFunction()
  }, [])
  return (
    <CarDataContext.Provider value={{data} }>
      {children}
    </CarDataContext.Provider>
  );
};


//not separting the hook function to some other folder because its just one hook!
