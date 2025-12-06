import { useEffect, useState } from 'react';
import {ref, onValue, get} from "firebase/database";
import { database } from '../config/firebase';
import { useCart } from '../context/CartContext';

function Menu() {
    const [menu, setMenu] = useState([]);
    const { addToCart } = useCart();

    function loadMenuFromFB() {
        console.log("Loading menu with notifications");

        // Read menu on real-time way (listen to changes)
        const menuRef = ref(database, "menu");
        onValue(menuRef, (snapshot) => {
            const data = snapshot.val();
            console.log("data", data);
            
            // parse data from obj -> array and add unique ids
            const keys = Object.keys(data);
            const menuItems = keys.map((key, index) => ({
                ...data[key], 
                id: key, // Use the Firebase key as ID
                index: index // fallback index if needed
            }));
            console.log("menuItems", menuItems);
            setMenu(menuItems);
        });
    }

    const handleAddToCart = (product) => {
        if (!product.outStock) {
            addToCart(product);
            // You could add a toast notification here
            console.log(`Added ${product.title} to cart`);
        }
    };

    useEffect(function() {
        loadMenuFromFB();
        // loadOnce();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
                Our Menu
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {menu.map(prod => (
                    <div 
                        key={prod.id || prod.index} 
                        className={`bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${
                            prod.outStock ? 'opacity-75' : 'hover:scale-105'
                        }`}
                    >
                        {/* Card Header */}
                        <div className="p-6">
                            {prod.outStock && (
                                <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full inline-block mb-3">
                                    Out of Stock
                                </div>
                            )}
                            
                            {/* Product Title */}
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                {prod.title}
                            </h3>
                            
                            {/* Product Description */}
                            <p className="text-gray-600 mb-4 line-clamp-3">
                                {prod.description}
                            </p>
                            
                            {/* Category Badge */}
                            <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mb-4">
                                {prod.category}
                            </span>
                        </div>
                        
                        {/* Card Footer */}
                        <div className="px-6 pb-6">
                            <div className="flex items-center justify-between">
                                {/* Price */}
                                <span className="text-2xl font-bold text-green-600">
                                    {prod.price}
                                </span>
                                
                                {/* Add to Cart Button */}
                                <button
                                    onClick={() => handleAddToCart(prod)}
                                    disabled={prod.outStock}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                                        prod.outStock 
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                            : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                                    }`}
                                >
                                    {prod.outStock ? 'Unavailable' : 'Add to Cart'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {menu.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-500 text-lg">Loading menu items...</div>
                </div>
            )}
        </div>
    );
}

export default Menu;