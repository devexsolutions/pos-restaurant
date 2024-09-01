import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MenuManagement = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', category_id: '', is_available: true });

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        const response = await axios.get('/api/products');
        setProducts(response.data);
    };

    const fetchCategories = async () => {
        const response = await axios.get('/api/categories');
        setCategories(response.data);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct({ ...newProduct, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/products', newProduct);
            setNewProduct({ name: '', description: '', price: '', category_id: '', is_available: true });
            fetchProducts();
        } catch (error) {
            console.error('Error creating product:', error);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Menu Management</h2>
            <form onSubmit={handleSubmit} className="mb-4">
                <input
                    type="text"
                    name="name"
                    value={newProduct.name}
                    onChange={handleInputChange}
                    placeholder="Product Name"
                    className="p-2 border rounded mr-2"
                />
                <input
                    type="text"
                    name="description"
                    value={newProduct.description}
                    onChange={handleInputChange}
                    placeholder="Description"
                    className="p-2 border rounded mr-2"
                />
                <input
                    type="number"
                    name="price"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    placeholder="Price"
                    className="p-2 border rounded mr-2"
                />
                <select
                    name="category_id"
                    value={newProduct.category_id}
                    onChange={handleInputChange}
                    className="p-2 border rounded mr-2"
                >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                    Add Product
                </button>
            </form>
            <div>
                <h3 className="text-xl font-semibold mb-2">Product List</h3>
                <ul>
                    {products.map(product => (
                        <li key={product.id} className="mb-2">
                            {product.name} - ${product.price} - {product.category.name}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default MenuManagement;
