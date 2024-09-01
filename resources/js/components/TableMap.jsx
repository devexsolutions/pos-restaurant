import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TableMap = () => {
    const [tables, setTables] = useState([]);

    useEffect(() => {
        fetchTables();
    }, []);

    const fetchTables = async () => {
        const response = await axios.get('/api/tables');
        setTables(response.data);
    };

    const handleTableClick = (table) => {
        // Aquí puedes manejar la lógica cuando se hace clic en una mesa
        console.log('Clicked table:', table);
    };

    return (
        <div className="grid grid-cols-3 gap-4">
            {tables.map((table) => (
                <div
                    key={table.id}
                    className={`p-4 border rounded cursor-pointer ${
                        table.status === 'available' ? 'bg-green-200' :
                        table.status === 'occupied' ? 'bg-red-200' : 'bg-yellow-200'
                    }`}
                    onClick={() => handleTableClick(table)}
                >
                    <h3 className="font-bold">Table {table.number}</h3>
                    <p>Capacity: {table.capacity}</p>
                    <p>Status: {table.status}</p>
                </div>
            ))}
        </div>
    );
};

export default TableMap;
