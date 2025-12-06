import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function Navbar() {
    const { currentUser, logout } = useAuth();
    const { getCartItemsCount } = useCart();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Failed to log out:', error);
        }
    };

    return (
        <nav className="bg-gray-800 shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    {/* Logo/Brand */}
                    <Link 
                        to="/" 
                        className="text-white text-xl font-bold hover:text-gray-200 transition-colors duration-200"
                    >
                        Restaurant App
                    </Link>
                    
                    {/* Navigation Links */}
                    <div className="flex items-center space-x-4">
                        {/* Menu Link */}
                        <Link 
                            to="/" 
                            className="text-gray-300 hover:text-white transition-colors duration-200 px-3 py-2 rounded-md"
                        >
                            Menu
                        </Link>

                        {/* Cart Link with Badge */}
                        <Link 
                            to="/cart" 
                            className="relative text-gray-300 hover:text-white transition-colors duration-200 px-3 py-2 rounded-md flex items-center"
                        >
                            <svg 
                                className="w-6 h-6 mr-1" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M9 19h9" 
                                />
                            </svg>
                            Cart
                            {getCartItemsCount() > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {getCartItemsCount()}
                                </span>
                            )}
                        </Link>

                        {/* Authentication Section */}
                        {currentUser ? (
                            <div className="flex items-center space-x-3">
                                <span className="text-gray-300 text-sm">
                                    Welcome, {currentUser.email}
                                </span>
                                <button 
                                    onClick={handleLogout}
                                    className="bg-transparent border border-gray-300 text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md transition-colors duration-200"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex space-x-2">
                                <Link 
                                    to="/login"
                                    className="bg-transparent border border-gray-300 text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md transition-colors duration-200"
                                >
                                    Login
                                </Link>
                                <Link 
                                    to="/signup"
                                    className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md transition-colors duration-200"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar; 