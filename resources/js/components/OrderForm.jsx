import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderForm = ({ tableId }) => {
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [order, setOrder] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const response = await axios.get('/api/products');
        setProducts(response.data);
    };

    const handleAddProduct = (product) => {
        setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    };

    const handleQuantityChange = (index, quantity) => {
        const updatedProducts = [...selectedProducts];
        updatedProducts[index].quantity = quantity;
        setSelectedProducts(updatedProducts);
    };

    const handleSubmitOrder = async () => {
        try {
            const response = await axios.post('/api/orders', {
                table_id: tableId,
                items: selectedProducts.map(p => ({
                    product_id: p.id,
                    quantity: p.quantity,
                })),
            });
            setOrder(response.data);
            setSelectedProducts([]);
        } catch (error) {
            console.error('Error submitting order:', error);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">New Order</h2>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <h3 className="text-xl font-semibold mb-2">Menu</h3>
                    {products.map(product => (
                        <button
                            key={product.id}
                            className="bg-blue-500 text-white p-2 rounded mb-2 w-full"
                            onClick={() => handleAddProduct(product)}
                        >
                            {product.name} - ${product.price}
                        </button>
                    ))}
                </div>
                <div>
                    <h3 className="text-xl font-semibold mb-2">Selected Items</h3>
                    {selectedProducts.map((product, index) => (
                        <div key={index} className="flex items-center mb-2">
                            <span className="flex-grow">{product.name}</span>
                            <input
                                type="number"
                                min="1"
                                value={product.quantity}
                                onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                                className="w-16 p-1 border rounded"
                            />
                        </div>
                    ))}
                    <button
                        className="bg-green-500 text-white p-2 rounded mt-4 w-full"
                        onClick={handleSubmitOrder}
                    >
                        Submit Order
                    </button>
                </div>
            </div>
            {order && (
                <div className="mt-4">
                    <h3 className="text-xl font-semibold mb-2">Order Submitted</h3>
                    <p>Order ID: {order.id}</p>
                    <p>Total Amount: ${order.total_amount}</p>
                </div>
            )}
        </div>
    );
};

export default OrderForm;
