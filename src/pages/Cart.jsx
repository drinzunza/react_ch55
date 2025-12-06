import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../config/firebase';
import { useState } from 'react';

function Cart() {
    const { 
        items, 
        removeFromCart, 
        updateQuantity, 
        clearCart, 
        getCartTotal, 
        getCartItemsCount 
    } = useCart();
    
    const { currentUser } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);

    const handleQuantityChange = (productId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(productId);
        } else {
            updateQuantity(productId, newQuantity);
        }
    };

    const formatPrice = (price) => {
        if (typeof price === 'string') {
            return parseFloat(price.replace('$', ''));
        }
        return price;
    };

    const handleCheckout = async () => {
        if (!currentUser) {
            setError('Please log in to proceed with checkout');
            return;
        }

        if (items.length === 0) {
            setError('Your cart is empty');
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            const sendOrderToToast = httpsCallable(functions, 'sendOrderToToast');
            
            const orderData = {
                items: items.map(item => ({
                    id: item.id,
                    title: item.title,
                    description: item.description,
                    price: formatPrice(item.price),
                    quantity: item.quantity,
                    category: item.category
                })),
                timestamp: new Date().toISOString()
            };

            const result = await sendOrderToToast(orderData);
            
            if (result.data.success) {
                // Clear the cart after successful order
                clearCart();
                alert(`Order submitted successfully! Order ID: ${result.data.orderId}`);
            } else {
                throw new Error('Failed to submit order');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            setError(error.message || 'Failed to process order. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center py-16">
                    <div className="mb-4">
                        <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M9 19h9" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
                    <p className="text-gray-600 mb-6">Add some delicious items from our menu!</p>
                    <a 
                        href="/" 
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                        Browse Menu
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Your Cart ({getCartItemsCount()} items)
                    </h1>
                    <button
                        onClick={clearCart}
                        className="text-red-600 hover:text-red-800 font-medium transition-colors duration-200"
                    >
                        Clear Cart
                    </button>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            {items.map((item) => (
                                <div key={item.id} className="border-b border-gray-200 last:border-b-0">
                                    <div className="p-6">
                                        <div className="flex items-start space-x-4">
                                            {/* Product Info */}
                                            <div className="flex-grow">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                    {item.title}
                                                </h3>
                                                <p className="text-gray-600 text-sm mb-2">
                                                    {item.description}
                                                </p>
                                                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                                    {item.category}
                                                </span>
                                            </div>

                                            {/* Price and Controls */}
                                            <div className="flex flex-col items-end space-y-3">
                                                <div className="text-lg font-bold text-green-600">
                                                    ${(formatPrice(item.price) * item.quantity).toFixed(2)}
                                                </div>
                                                
                                                {/* Quantity Controls */}
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors duration-200"
                                                    >
                                                        <span className="text-gray-600 font-medium">-</span>
                                                    </button>
                                                    
                                                    <span className="w-8 text-center font-medium">
                                                        {item.quantity}
                                                    </span>
                                                    
                                                    <button
                                                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors duration-200"
                                                    >
                                                        <span className="text-gray-600 font-medium">+</span>
                                                    </button>
                                                </div>

                                                {/* Remove Button */}
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-red-600 hover:text-red-800 text-sm transition-colors duration-200"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                            
                            <div className="space-y-3 mb-4">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal ({getCartItemsCount()} items)</span>
                                    <span>${getCartTotal().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Tax (8.5%)</span>
                                    <span>${(getCartTotal() * 0.085).toFixed(2)}</span>
                                </div>
                                <div className="border-t pt-3">
                                    <div className="flex justify-between text-lg font-bold text-gray-900">
                                        <span>Total</span>
                                        <span>${(getCartTotal() * 1.085).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                    {error}
                                </div>
                            )}

                            {!currentUser && (
                                <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
                                    Please log in to complete your order.
                                </div>
                            )}

                            <div className="space-y-3">
                                <button 
                                    onClick={handleCheckout}
                                    disabled={isProcessing || !currentUser}
                                    className={`w-full py-3 rounded-lg font-medium transition-colors duration-200 ${
                                        isProcessing || !currentUser
                                            ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                                >
                                    {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
                                </button>
                                <a 
                                    href="/" 
                                    className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium text-center block"
                                >
                                    Continue Shopping
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart; 