# Car Rental Application

A full-stack car rental platform built with modern web technologies, featuring user authentication, car browsing, booking management.

##  Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Framer Motion** - Animations
- **React Leaflet** - Interactive maps
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

### Deployment
- **Vercel** - Frontend hosting
- **Render** - Backend hosting
- **PostgreSQL** - Database (Render managed)

## Live Demo link

- **Frontend:** [https://car-rental-fs.vercel.app/]
- **Backend API:** [https://car-rental-be-mmm4.onrender.com]

## �� Features

### Bonus Features
  -Added interactive maps to pick up the location !



## 🗄️ Database Schema

### Users Table
```sql
model User {
  id          Int     @id @default(autoincrement())
  name        String  
  email       String  @unique
  password    String 
  phoneNumber String
  bookings    BookingInfo[]
}
```

### Cars Table
```sql
model CarInfo {
  id            Int     @id @default(autoincrement())
  name          String
  brand         String
  image         String
  type          String
  price_per_day Float
  rating        Float
  description   String  @default("no description available")
  fuel_type     String
  transmission  String
  bookings      BookingInfo[]
}
```

### Bookings Table
```sql
model BookingInfo {
  id             Int      @id @default(autoincrement())
  carId          Int
  userId         Int
  user           User     @relation(fields: [userId], references: [id])
  car            CarInfo  @relation(fields: [carId], references: [id])
  pickupDate     String
  dropoffDate    String
  pickupLocation String
  totalPrice     Float
  createdAt      DateTime @default(now())
}
```

## 🛠️ Local Development Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database

### Frontend Setup
```bash
# Clone the repository
git clone [your-repo-url]
cd car-rental

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Add your backend URL to .env
VITE_BACKEND_URL=http://localhost:3001

# Start development server
npm run dev
```

### Backend Setup
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure environment variables
DATABASE_URL="postgresql://username:password@localhost:5432/car_rental"
JWT_SECRET="your-secret-key"
FRONTEND_URL="http://localhost:5173"

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npx prisma migrate dev

# Seed the database (optional)
npm run seed

# Start development server
npm run dev
```
