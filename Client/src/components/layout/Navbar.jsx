import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { itemCount } = useCart(); 

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">

        {/* Brand */}
        <Link to="/" className="text-base font-semibold text-gray-900 tracking-tight">
          Supermarket
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {user.role === 'admin' ? (
                <>
                  <Link to="/admin" className="text-sm text-gray-600 hover:text-gray-900 transition">
                    Dashboard
                  </Link>
                  <Link to="/admin/products" className="text-sm text-gray-600 hover:text-gray-900 transition">
                    Products
                  </Link>
                  <Link to="/admin/orders" className="text-sm text-gray-600 hover:text-gray-900 transition">
                    Orders
                  </Link>
                  <Link to="/admin/categories" className="text-sm text-gray-600 hover:text-gray-900 transition">
                    Categories
                  </Link>
                </>
              ) : (
                <>
                  {/* Cart with badge */}
                  <Link to="/cart" className="relative text-sm text-gray-600 hover:text-gray-900 transition">
                    Cart
                    {itemCount > 0 && (
                      <span className="absolute -top-2 -right-4 w-4 h-4 bg-gray-900 text-white
                                       text-xs rounded-full flex items-center justify-center leading-none">
                        {itemCount > 9 ? '9+' : itemCount}
                      </span>
                    )}
                  </Link>
                  <Link to="/orders" className="text-sm text-gray-600 hover:text-gray-900 transition">
                    Orders
                  </Link>
                  <Link to="/profile" className="text-sm text-gray-600 hover:text-gray-900 transition">
                    Profile
                  </Link>
                </>
              )}
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-gray-900 transition"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900 transition">
                Sign in
              </Link>
              <Link
                to="/register"
                className="text-sm px-3 py-1.5 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}