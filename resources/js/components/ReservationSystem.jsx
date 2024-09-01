import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReservationSystem = () => {
    const [reservations, setReservations] = useState([]);
    const [newReservation, setNewReservation] = useState({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        reservation_time: '',
        party_size: 1,
        special_requests: '',
    });

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            const response = await axios.get('/api/reservations');
            setReservations(response.data);
        } catch (error) {
            console.error('Error fetching reservations:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewReservation({ ...newReservation, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/reservations', newReservation);
            setNewReservation({
                customer_name: '',
                customer_email: '',
                customer_phone: '',
                reservation_time: '',
                party_size: 1,
                special_requests: '',
            });
            fetchReservations();
        } catch (error) {
            console.error('Error creating reservation:', error);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await axios.put(`/api/reservations/${id}`, { status: newStatus });
            fetchReservations();
        } catch (error) {
            console.error('Error updating reservation status:', error);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Reservation System</h2>
            <form onSubmit={handleSubmit} className="mb-8">
                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="customer_name"
                        value={newReservation.customer_name}
                        onChange={handleInputChange}
                        placeholder="Customer Name"
                        className="p-2 border rounded"
                        required
                    />
                    <input
                        type="email"
                        name="customer_email"
                        value={newReservation.customer_email}
                        onChange={handleInputChange}
                        placeholder="Customer Email"
                        className="p-2 border rounded"
                        required
                    />
                    <input
                        type="tel"
                        name="customer_phone"
                        value={newReservation.customer_phone}
                        onChange={handleInputChange}
                        placeholder="Customer Phone"
                        className="p-2 border rounded"
                        required
                    />
                    <input
                        type="datetime-local"
                        name="reservation_time"
                        value={newReservation.reservation_time}
                        onChange={handleInputChange}
                        className="p-2 border rounded"
                        required
                    />
                    <input
                        type="number"
                        name="party_size"
                        value={newReservation.party_size}
                        onChange={handleInputChange}
                        placeholder="Party Size"
                        className="p-2 border rounded"
                        min="1"
                        required
                    />
                    <textarea
                        name="special_requests"
                        value={newReservation.special_requests}
                        onChange={handleInputChange}
                        placeholder="Special Requests"
                        className="p-2 border rounded"
                    ></textarea>
                </div>
                <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded">
                    Create Reservation
                </button>
            </form>
            <div>
                <h3 className="text-xl font-semibold mb-2">Reservations</h3>
                <table className="w-full">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Time</th>
                            <th>Party Size</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservations.map((reservation) => (
                            <tr key={reservation.id}>
                                <td>{reservation.customer_name}</td>
                                <td>{new Date(reservation.reservation_time).toLocaleString()}</td>
                                <td>{reservation.party_size}</td>
                                <td>{reservation.status}</td>
                                <td>
                                    <select
                                        value={reservation.status}
                                        onChange={(e) => handleStatusChange(reservation.id, e.target.value)}
                                        className="p-1 border rounded"
                                    >
                                        <option value="confirmed">Confirmed</option>
                                        <option value="cancelled">Cancelled</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReservationSystem;
