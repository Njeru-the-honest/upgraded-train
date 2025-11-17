import { useState, useEffect } from "react";
import { getRestaurants, getMenuByRestaurant } from "../services/api";
import { Restaurant, MenuItem } from "../types";
import RestaurantCard from "../components/RestaurantCard";
import MenuItemCard from "../components/MenuItemCard";
import HeroBanner from "../components/HeroBanner";
import RestaurantReviews from "../components/RestaurantReviews";
import { RestaurantCardSkeleton, MenuItemCardSkeleton } from "../components/Skeleton";
import { ArrowLeft, Search } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const CustomerDashboard = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const response = await getRestaurants();
      setRestaurants(response.data);
    } catch (error: any) {
      console.error("Failed to fetch restaurants:", error);
      toast.error("Failed to load restaurants");
    } finally {
      setLoading(false);
    }
  };

  const handleRestaurantClick = async (restaurant: Restaurant) => {
    try {
      setLoading(true);
      const response = await getMenuByRestaurant(restaurant.id);
      setMenuItems(response.data);
      setSelectedRestaurant(restaurant);
    } catch (error: any) {
      console.error("Failed to fetch menu:", error);
      toast.error("Failed to load menu");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setSelectedRestaurant(null);
    setMenuItems([]);
    setSearchTerm("");
  };

  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMenuItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {!selectedRestaurant && <HeroBanner />}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedRestaurant ? (
          <>
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Restaurants</span>
            </button>

            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h1 className="text-3xl font-bold text-gray-900">{selectedRestaurant.name}</h1>
              {selectedRestaurant.location && (
                <p className="text-gray-600 mt-2">📍 {selectedRestaurant.location}</p>
              )}
              {selectedRestaurant.contactInfo && (
                <p className="text-gray-600 mt-1">📞 {selectedRestaurant.contactInfo}</p>
              )}
            </div>

            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search menu items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Menu Items Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Menu</h2>
              <div className="grid gap-4">
                {loading ? (
                  <>
                    {[...Array(6)].map((_, index) => (
                      <MenuItemCardSkeleton key={index} />
                    ))}
                  </>
                ) : filteredMenuItems.length > 0 ? (
                  filteredMenuItems.map((item) => <MenuItemCard key={item.id} item={item} />)
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No menu items found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-8">
              <RestaurantReviews restaurantId={selectedRestaurant.id} />
            </div>
          </>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Featured Restaurants</h1>
              <p className="text-gray-600">Discover amazing food from top-rated local restaurants</p>
            </div>

            <div className="mb-8">
              <div className="relative max-w-2xl">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search restaurants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm"
                />
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {loading && restaurants.length === 0 ? (
                <>
                  {[...Array(6)].map((_, index) => (
                    <RestaurantCardSkeleton key={index} />
                  ))}
                </>
              ) : filteredRestaurants.length > 0 ? (
                filteredRestaurants.map((restaurant, index) => (
                  <motion.div
                    key={restaurant.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <RestaurantCard
                      restaurant={restaurant}
                      onClick={() => handleRestaurantClick(restaurant)}
                    />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500 text-lg">No restaurants found</p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;