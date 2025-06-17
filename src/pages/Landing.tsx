import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import sidecar from "@/assets/images/carSide.jpg"

import { useNavigate} from "react-router-dom"

import { useCarData } from "@/hooks/useCarData"
import Navbar from "@/components/Navbar"
import { motion, useScroll, useTransform, useInView } from "motion/react"
import { useRef } from "react"


export default function LandingPage() {

  const navigate = useNavigate()
  const data=useCarData();

  // Parallax scroll effect
  const { scrollY } = useScroll()
  const heroImageY = useTransform(scrollY, [0, 800], [0, 300])
  const heroTextY = useTransform(scrollY, [0, 800], [0, 150])

  // Refs for scroll animations
  const featuredRef = useRef(null)
  const topRatedRef = useRef(null)
  const whyChooseRef = useRef(null)

  // InView hooks
  const featuredInView = useInView(featuredRef, { once: true, margin: "-100px" })
  const topRatedInView = useInView(topRatedRef, { once: true, margin: "-100px" })
  const whyChooseInView = useInView(whyChooseRef, { once: true, margin: "-100px" })



  const featuredCars = data.slice(0, 3).map(car => ({
    id:car.id,
    title: `${car.brand} ${car.name}`,
    desc: `${car.description}`,
    img: car.image,
  }))

  const topRated = data
    .filter(car => car.rating >= 4.6)
    .slice(0, 3)
    .map(car => ({
    id:car.id,
      title: `${car.brand} ${car.name}`,
    desc: `${car.description}`,
      img: car.image,
    }))


  return (
    <div className="min-h-screen w-full bg-[#18191C] text-white">

        <Navbar /><motion.section 
          className="relative w-full h-screen overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8,delay: 0.5  }}
        >
          <motion.img
            src={sidecar}
            alt="Experience the thrill"
            className="w-full h-full object-cover"
            style={{ y: heroImageY }}
          />
          <motion.div 
            className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8"
            style={{ y: heroTextY }}
          >
            <motion.h1 
              className="text-3xl md:text-4xl font-mono mb-2"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Experience the thrill of the open road
            </motion.h1>
            <motion.p 
              className="text-lg font-mono text-neutral-200"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Rent your dream car today and embark on an unforgettable journey.
            </motion.p>
          </motion.div>
        </motion.section>
      <main className="max-w-5xl mx-auto px-6 py-10">
               {/* Featured Cars */}
        <motion.section 
          className="mb-12"
          ref={featuredRef}
          initial={{ opacity: 0, y: 60 }}
          animate={featuredInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2 
            className="text-4xl text-white font-mono mb-5"
            initial={{ opacity: 0, x: -50 }}
            animate={featuredInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Featured Cars
          </motion.h2>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.15
                }
              }
            }}
            initial="hidden"
            animate={featuredInView ? "visible" : "hidden"}
          >
            {featuredCars.map((car) => (
              <motion.div
                key={car.title}
                variants={{
                  hidden: { opacity: 0, y: 40, scale: 0.9 },
                  visible: { opacity: 1, y: 0, scale: 1 }
                }}
                transition={{ duration: 0.5 }}
                whileHover={{ 
                  scale: 1.03, 
                  transition: { duration: 0.2 } 
                }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  onClick={() => navigate(`/car/${car.id}`)} 
                  className="bg-[#18191C] border-none shadow-none overflow-hidden flex flex-col cursor-pointer transition-colors"
                >
                  <CardHeader className="p-0">
                    <motion.img
                      src={car.img}
                      alt={car.title}
                      className="w-full h-full object-cover rounded-t-xl"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    />
                  </CardHeader>
                  <CardContent className="p-4 flex-1 flex flex-col">
                    <CardTitle className="text-lg font-mono text-white mb-1">{car.title}</CardTitle>
                    <p className="text-sm font-mono text-gray-300">{car.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>        {/* Top-Rated Listings */}
        <motion.section 
          className="mb-12"
          ref={topRatedRef}
          initial={{ opacity: 0, y: 60 }}
          animate={topRatedInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2 
            className="text-4xl font-mono mb-5"
            initial={{ opacity: 0, x: 50 }}
            animate={topRatedInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Top-Rated Listings
          </motion.h2>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
            initial="hidden"
            animate={topRatedInView ? "visible" : "hidden"}
          >
            {topRated.map((car) => (
              <motion.div
                key={car.title}
                variants={{
                  hidden: { opacity: 0, scale: 0.8, rotateX: 45 },
                  visible: { opacity: 1, scale: 1, rotateX: 0 }
                }}
                transition={{ duration: 0.6 }}
                whileHover={{ 
                  scale: 1.05, 
                  rotateY: 5,
                  transition: { duration: 0.2 } 
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Card 
                  onClick={() => navigate(`/car/${car.id}`)} 
                  className="bg-[#18191C] border-none shadow-none overflow-hidden flex flex-col cursor-pointer transition-colors"
                >
                  <CardHeader className="p-0">
                    <motion.img
                      src={car.img}
                      alt={car.title}
                      className="w-full h-40 object-cover rounded-t-xl"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.4 }}
                    />
                  </CardHeader>
                  <CardContent className="p-4 flex-1 flex flex-col">
                    <CardTitle className="text-lg font-mono text-white mb-1">{car.title}</CardTitle>
                    <p className="text-sm font-mono text-gray-300">{car.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>        {/* Why Choose DriveGo */}
        <motion.section 
          className="mb-10"
          ref={whyChooseRef}
          initial={{ opacity: 0, y: 80 }}
          animate={whyChooseInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 80 }}
          transition={{ duration: 0.7 }}
        >
          <motion.h2 
            className="text-2xl font-mono mb-5"
            initial={{ opacity: 0, y: 30 }}
            animate={whyChooseInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Why Choose DriveGo?
          </motion.h2>
          <motion.p 
            className="mb-8 font-mono text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={whyChooseInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            We are committed to providing a seamless and enjoyable car rental experience.
          </motion.p>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.25
                }
              }
            }}
            initial="hidden"
            animate={whyChooseInView ? "visible" : "hidden"}
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, x: -60, rotateY: -45 },
                visible: { opacity: 1, x: 0, rotateY: 0 }
              }}
              transition={{ duration: 0.7 }}
              whileHover={{ 
                scale: 1.05, 
                rotateY: 5,
                transition: { duration: 0.3 } 
              }}
            >
              <Card className="bg-[#232428] border-none rounded-xl p-6 flex flex-col">
                <CardHeader className="p-0 mb-2">
                  <CardTitle className="text-white  font-mono">Wide Selection</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-sm font-mono text-gray-300">
                    Choose from a diverse and super range of vehicles to suit your needs.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 60, scale: 0.8 },
                visible: { opacity: 1, y: 0, scale: 1 }
              }}
              transition={{ duration: 0.7 }}
              whileHover={{ 
                scale: 1.05, 
                y: -5,
                transition: { duration: 0.3 } 
              }}
            >
              <Card className="bg-[#232428] border-none rounded-xl p-6 flex flex-col">
                <CardHeader className="p-0 mb-2">
                  <CardTitle className="text-white font-mono">Competitive Pricing</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-sm font-mono text-gray-300">
                    Enjoy the best rates and transparent pricing with no hidden fees.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              variants={{
                hidden: { opacity: 0, x: 60, rotateY: 45 },
                visible: { opacity: 1, x: 0, rotateY: 0 }
              }}
              transition={{ duration: 0.7 }}
              whileHover={{ 
                scale: 1.05, 
                rotateY: -5,
                transition: { duration: 0.3 } 
              }}
            >
              <Card className="bg-[#232428] border-none rounded-xl p-6 flex flex-col">
                <CardHeader className="p-0 mb-2">
                  <CardTitle className="text-white font-mono">24/7 Support</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-sm font-mono text-gray-300">
                    Our dedicated support team is available around the clock to assist you.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </motion.section>
       
      </main>
    </div>
  )
}
