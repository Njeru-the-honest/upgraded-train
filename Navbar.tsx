import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { CartContext } from "../context/CartContext";
import { ShoppingCart, User, LogOut, LayoutDashboard, Shield } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useContext(UserContext);
  const { getTotalItems } = useContext(CartContext);  // Make sure this line is here
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-2 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              FoodDelivery
            </span>
          </Link>

          {/* Navigation Items */}
          <div className="flex items-center space-x-6">
            {user ? (
              <>
                {/* Admin Dashboard Link - Only show for admins */}
                {user.role === "ADMIN" && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-2 text-gray-700 hover:text-orange-600 transition-colors"
                  >
                    <Shield className="h-5 w-5" />
                    <span className="font-medium">Admin Panel</span>
                  </Link>
                )}

                {/* Customer Dashboard Link - Only show for customers */}
                {user.role === "CUSTOMER" && (
                  <>
                    <Link
                      to="/dashboard"
                      className="flex items-center space-x-2 text-gray-700 hover:text-orange-600 transition-colors"
                    >
                      <LayoutDashboard className="h-5 w-5" />
                      <span className="font-medium">Dashboard</span>
                    </Link>

                    {/* Cart */}
                    <Link
                      to="/cart"
                      className="relative flex items-center space-x-2 text-gray-700 hover:text-orange-600 transition-colors"
                    >
                      <ShoppingCart className="h-6 w-6" />
                      {getTotalItems() > 0 && (
                        <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                          {getTotalItems()}
                        </span>
                      )}
                    </Link>
                  </>
                )}

                {/* User Menu */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-gray-700">
                    <div className="bg-orange-100 p-2 rounded-full">
                      <User className="h-5 w-5 text-orange-600" />
                    </div>
                    <div className="hidden md:block">
                      <p className="text-sm font-semibold">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.role}</p>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden md:inline">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/auth"
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;