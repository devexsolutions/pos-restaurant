import React, { useState } from 'react';
import axios from 'axios';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
ChartJS.register(...registerables);

const Reports = () => {
    const [reportType, setReportType] = useState('sales');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reportData, setReportData] = useState(null);

    const fetchReport = async () => {
        try {
            let response;
            switch (reportType) {
                case 'sales':
                    response = await axios.get(`/api/reports/sales?start_date=${startDate}&end_date=${endDate}`);
                    break;
                case 'inventory':
                    response = await axios.get('/api/reports/inventory');
                    break;
                case 'staff':
                    response = await axios.get(`/api/reports/staff-performance?start_date=${startDate}&end_date=${endDate}`);
                    break;
                case 'top-products':
                    response = await axios.get(`/api/reports/top-selling-products?start_date=${startDate}&end_date=${endDate}`);
                    break;
            }
            setReportData(response.data);
        } catch (error) {
            console.error('Error fetching report:', error);
        }
    };

    const renderChart = () => {
        if (!reportData) return null;

        switch (reportType) {
            case 'sales':
                return (
                    <Line
                        data={{
                            labels: reportData.map(item => item.date),
                            datasets: [{
                                label: 'Sales',
                                data: reportData.map(item => item.total_sales),
                                borderColor: 'rgb(75, 192, 192)',
                                tension: 0.1
                            }]
                        }}
                    />
                );
            case 'inventory':
                return (
                    <Bar
                        data={{
                            labels: reportData.map(item => item.name),
                            datasets: [{
                                label: 'Inventory',
                                data: reportData.map(item => item.total_quantity),
                                backgroundColor: 'rgba(54, 162, 235, 0.5)'
                            }]
                        }}
                    />
                );
            case 'staff':
                return (
                    <Pie
                        data={{
                            labels: reportData.map(item => item.name),
                            datasets: [{
                                data: reportData.map(item => item.orders_sum_total_amount),
                                backgroundColor: [
                                    'rgba(255, 99, 132, 0.5)',
                                    'rgba(54, 162, 235, 0.5)',
                                    'rgba(255, 206, 86, 0.5)',
                                    'rgba(75, 192, 192, 0.5)',
                                    'rgba(153, 102, 255, 0.5)',
                                ]
                            }]
                        }}
                    />
                );
            case 'top-products':
                return (
                    <Bar
                        data={{
                            labels: reportData.map(item => item.product.name),
                            datasets: [{
                                label: 'Quantity Sold',
                                data: reportData.map(item => item.total_quantity),
                                backgroundColor: 'rgba(75, 192, 192, 0.5)'
                            }]
                        }}
                    />
                );
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Reports</h2>
            <div className="mb-4">
                <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="p-2 border rounded mr-2"
                >
                    <option value="sales">Sales Report</option>
                    <option value="inventory">Inventory Report</option>
                    <option value="staff">Staff Performance</option>
                    <option value="top-products">Top Selling Products</option>
                </select>
                {reportType !== 'inventory' && (
                    <>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="p-2 border rounded mr-2"
                        />
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="p-2 border rounded mr-2"
                        />
                    </>
                )}
                <button
                    onClick={fetchReport}
                    className="bg-blue-500 text-white p-2 rounded"
                >
                    Generate Report
                </button>
            </div>
            <div className="mt-4">
                {renderChart()}
            </div>
        </div>
    );
};

export default Reports;
