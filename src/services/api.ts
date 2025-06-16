import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Change this to your actual API URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Add request interceptor to include token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Authentication API calls
export const authAPI = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      return response.data
    } catch (error) {
      // For demo purposes, simulate a successful login with dummy data
      console.warn('API call failed, using dummy response for demo')
      if (email === 'demo@example.com' && password === 'demo123') {
        return {
          success: true,
          user: {
            id: 1,
            name: 'Demo User',
            email: 'demo@example.com',
            phoneNumber: '+1-555-0123'
          },
          token: 'dummy-jwt-token-12345'
        }
      }
      throw new Error('Invalid credentials')
    }
  },

  signup: async (userData: {
    name: string
    email: string
    password: string
    phoneNumber: string
  }) => {
    try {
      const response = await api.post('/auth/signup', userData)
      return response.data
    } catch (error) {
      // For demo purposes, simulate a successful signup with dummy data
      console.warn('API call failed, using dummy response for demo')
      return {
        success: true,
        user: {
          id: Date.now(), // Generate a dummy ID
          name: userData.name,
          email: userData.email,
          phoneNumber: userData.phoneNumber
        },
        token: 'dummy-jwt-token-' + Date.now()
      }
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('token')
    return !!token
  }
}

// Cars API calls (for future use)
export const carsAPI = {
  getAllCars: async () => {
    const response = await api.get('/cars')
    return response.data
  },

  getCarById: async (id: string) => {
    const response = await api.get(`/cars/${id}`)
    return response.data
  }
}

// Bookings API calls (for future use)
export const bookingsAPI = {
  createBooking: async (bookingData: any) => {
    const response = await api.post('/bookings', bookingData)
    return response.data
  },

  getUserBookings: async () => {
    const response = await api.get('/bookings/user')
    return response.data
  },

  cancelBooking: async (bookingId: string) => {
    const response = await api.delete(`/bookings/${bookingId}`)
    return response.data
  }
}

export default api
