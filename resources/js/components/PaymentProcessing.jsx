import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PaymentProcessing = ({ orderId }) => {
    const [order, setOrder] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [splitPayments, setSplitPayments] = useState([{ amount: 0, payment_method: 'cash' }]);

    useEffect(() => {
        fetchOrder();
    }, [orderId]);

    const fetchOrder = async () => {
        const response = await axios.get(`/api/orders/${orderId}`);
        setOrder(response.data);
    };

    const handlePayment = async () => {
        try {
            await axios.post('/api/transactions', {
                order_id: orderId,
                amount: order.total_amount,
                payment_method: paymentMethod,
            });
            alert('Payment processed successfully');
            fetchOrder();
        } catch (error) {
            console.error('Error processing payment:', error);
            alert('Error processing payment');
        }
    };

    const handleSplitPayment = async () => {
        try {
            await axios.post(`/api/orders/${orderId}/split-payment`, {
                payments: splitPayments,
            });
            alert('Split payment processed successfully');
            fetchOrder();
        } catch (error) {
            console.error('Error processing split payment:', error);
            alert('Error processing split payment');
        }
    };

    const addSplitPayment = () => {
        setSplitPayments([...splitPayments, { amount: 0, payment_method: 'cash' }]);
    };

    const updateSplitPayment = (index, field, value) => {
        const updatedPayments = [...splitPayments];
        updatedPayments[index][field] = value;
        setSplitPayments(updatedPayments);
    };

    if (!order) return <div>Loading...</div>;

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Process Payment</h2>
            <div className="mb-4">
                <p>Order Total: ${order.total_amount}</p>
                <p>Status: {order.status}</p>
            </div>
            {order.status !== 'completed' && (
                <>
                    <div className="mb-4">
                        <h3 className="text-xl font-semibold mb-2">Full Payment</h3>
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="p-2 border rounded mr-2"
                        >
                            <option value="cash">Cash</option>
                            <option value="credit_card">Credit Card</option>
                            <option value="debit_card">Debit Card</option>
                            <option value="other">Other</option>
                        </select>
                        <button onClick={handlePayment} className="bg-green-500 text-white p-2 rounded">
                            Process Payment
                        </button>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-2">Split Payment</h3>
                        {splitPayments.map((payment, index) => (
                            <div key={index} className="mb-2">
                                <input
                                    type="number"
                                    value={payment.amount}
                                    onChange={(e) => updateSplitPayment(index, 'amount', parseFloat(e.target.value))}
                                    placeholder="Amount"
                                    className="p-2 border rounded mr-2"
                                />
                                <select
                                    value={payment.payment_method}
                                    onChange={(e) => updateSplitPayment(index, 'payment_method', e.target.value)}
                                    className="p-2 border rounded mr-2"
                                >
                                    <option value="cash">Cash</option>
                                    <option value="credit_card">Credit Card</option>
                                    <option value="debit_card">Debit Card</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        ))}
                        <button onClick={addSplitPayment} className="bg-blue-500 text-white p-2 rounded mr-2">
                            Add Payment
                        </button>
                        <button onClick={handleSplitPayment} className="bg-green-500 text-white p-2 rounded">
                            Process Split Payment
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default PaymentProcessing;
