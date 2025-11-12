import { useContext } from "react";
import { MenuItem } from "../types";
import { CartContext } from "../context/CartContext";
import { Plus, Flame } from "lucide-react";
import { motion } from "framer-motion";

interface MenuItemCardProps {
  item: MenuItem;
}

// Default food images
const DEFAULT_FOOD_IMAGES = [
  "https://images.unsplash.com/photo-1711633648895-f5df0336ff55?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1711633648859-1eac3e5969b9?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1711633648879-63c5f7b7def4?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1671731478749-047201d3278e?w=300&h=300&fit=crop",
];

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item }) => {
  const { addToCart } = useContext(CartContext);
  const imageUrl = item.imageUrl || DEFAULT_FOOD_IMAGES[item.id % DEFAULT_FOOD_IMAGES.length];

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <div className="flex gap-4 p-4">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h4 className="text-lg font-bold text-gray-900">{item.name}</h4>
            {Math.random() > 0.5 && (
              <div className="flex items-center bg-red-50 px-2 py-1 rounded-full">
                <Flame className="h-3 w-3 text-red-500 mr-1" />
                <span className="text-xs font-semibold text-red-600">Spicy</span>
              </div>
            )}
          </div>
          
          {item.description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
          )}
          
          <div className="flex items-center justify-between mt-4">
            <div>
              <span className="text-2xl font-bold text-orange-600">${item.price.toFixed(2)}</span>
              <span className="text-sm text-gray-400 ml-2 line-through">${(item.price * 1.2).toFixed(2)}</span>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => addToCart(item)}
              disabled={item.available === false}
              className="flex items-center gap-2 bg-orange-600 text-white px-5 py-2.5 rounded-lg hover:bg-orange-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold shadow-md"
            >
              <Plus className="h-4 w-4" />
              <span>Add</span>
            </motion.button>
          </div>
          
          {item.available === false && (
            <span className="text-red-500 text-xs mt-2 block font-semibold">Currently unavailable</span>
          )}
        </div>
        
        <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
          <img
            src={imageUrl}
            alt={item.name}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.currentTarget.src = DEFAULT_FOOD_IMAGES[0];
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default MenuItemCard;
