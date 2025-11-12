import { Restaurant } from "../types";
import { MapPin, Star, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick: () => void;
}

// Default restaurant images (fallback)
const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1626199901439-ec635faa01e8?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1664746789431-e009d1817cba?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1755589494214-3e48817a4c9e?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1703642227315-a768d3271193?w=400&h=300&fit=crop",
];

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onClick }) => {
  // Use restaurant image or fallback to default images based on ID
  const imageUrl = restaurant.imageUrl || DEFAULT_IMAGES[restaurant.id % DEFAULT_IMAGES.length];

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer group"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src = DEFAULT_IMAGES[0];
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Badge */}
        <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
          Popular
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
          {restaurant.name}
        </h3>
        {restaurant.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{restaurant.description}</p>
        )}
        
        <div className="space-y-2">
          {restaurant.address && (
            <div className="flex items-center text-gray-500 text-sm">
              <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="line-clamp-1">{restaurant.address}</span>
            </div>
          )}
          
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm font-semibold text-gray-900 ml-1">4.5</span>
              <span className="text-sm text-gray-400 ml-1">(200+)</span>
            </div>
            <div className="flex items-center text-gray-600 text-sm">
              <Clock className="h-4 w-4 mr-1" />
              <span>30-45 min</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RestaurantCard;
