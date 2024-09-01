import './bootstrap';
    import React from 'react';
    import ReactDOM from 'react-dom/client';
    import Example from '/components/Example';

    ReactDOM.createRoot(document.getElementById('app')).render(
        <React.StrictMode>
            <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
            <div className="text-xl font-medium text-black">POS Restaurant</div>
        </div>
        </React.StrictMode>
    );
