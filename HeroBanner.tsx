import { motion } from "framer-motion";
import { Search, ChevronRight } from "lucide-react";

const HeroBanner = () => {
  return (
    <div className="relative bg-gradient-to-r from-orange-500 to-orange-600 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Delicious Food
              <span className="block text-orange-100">Delivered Fast</span>
            </h1>
            <p className="text-xl text-orange-50 mb-8 leading-relaxed">
              Order from your favorite local restaurants and get fresh, hot meals delivered right to your doorstep.
            </p>

            {/* Search Bar */}
            <div className="bg-white rounded-full shadow-2xl p-2 flex items-center max-w-md">
              <Search className="ml-4 text-gray-400" size={24} />
              <input
                type="text"
                placeholder="Search restaurants or dishes..."
                className="flex-1 px-4 py-3 outline-none text-gray-700"
              />
              <button className="bg-orange-600 text-white px-6 py-3 rounded-full hover:bg-orange-700 transition-colors flex items-center font-semibold">
                Search
                <ChevronRight size={20} className="ml-1" />
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-12">
              <div>
                <div className="text-3xl font-bold text-white">500+</div>
                <div className="text-orange-100 text-sm">Restaurants</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">10K+</div>
                <div className="text-orange-100 text-sm">Happy Customers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">30min</div>
                <div className="text-orange-100 text-sm">Avg Delivery</div>
              </div>
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden md:block"
          >
            <div className="relative z-10">
              <img
                src="https://images.unsplash.com/photo-1711633648859-1eac3e5969b9?w=600&h=400&fit=crop"
                alt="Delicious food"
                className="rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
              />
            </div>
            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 z-20"
            >
              <div className="flex items-center gap-2">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <span className="text-2xl">🍔</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Fast Delivery</div>
                  <div className="text-sm text-gray-500">Under 30 mins</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 z-20"
            >
              <div className="flex items-center gap-2">
                <div className="bg-green-100 p-2 rounded-lg">
                  <span className="text-2xl">⭐</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Top Rated</div>
                  <div className="text-sm text-gray-500">4.8/5.0</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
