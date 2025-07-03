import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getToken, removeToken } from '../utils/auth';
import BudgetAlertDropdown from './BudgetAlertDropdown';
import { getAlerts } from '../services/api';

export default function Navbar() {
    let navigate = useNavigate();
    let isLoggedIn = !!getToken();
    let userEmail = localStorage.getItem('userEmail');
    let userInitial = userEmail ? userEmail.charAt(0).toUpperCase() : 'U';

    let [showAvatarMenu, setShowAvatarMenu] = useState(false);
    let [showAlertDropdown, setShowAlertDropdown] = useState(false);
    let [alerts, setAlerts] = useState([]);
    let hasAlert = alerts.some(a => a.percent >= 80);

    useEffect(() => {
        let fetchAlerts = async () => {
            let userId = localStorage.getItem('userId');
            let month = new Date().toISOString().slice(0, 7);
            if (!userId) return;
            try {
                let res = await getAlerts(userId, month);
                let critical = res.data.filter(alert => alert.percent >= 80);
                setAlerts(critical);
            } catch (err) {
                console.error('Error fetching alerts in Navbar:', err);
            }
        };

        fetchAlerts();
        let interval = setInterval(fetchAlerts, 2000);
        return () => clearInterval(interval);
    }, []);

    let handleLogout = () => {
        setShowAvatarMenu(false);
        removeToken();
        navigate('/login');
    };

    return (
        <nav className="bg-purple-700 text-white px-6 py-3 shadow-md">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <h1 className="text-xl font-semibold">Finance Tracker</h1>

                <div className="flex items-center gap-4 relative">
                    {isLoggedIn ? (
                        <>
                            <Link to="/" className="hover:underline">Dashboard</Link>
                            <Link to="/add-expense" className="hover:underline">Add Expense</Link>
                            <Link to="/expenses" className="hover:underline">Expenses</Link>
                            <Link to="/budgets" className="hover:underline">Budget</Link>

                            <div className="relative">
                                <button
                                    onClick={() => setShowAlertDropdown(!showAlertDropdown)}
                                    className="relative text-yellow-400 hover:text-yellow-500"
                                    title="Budget Alerts"
                                >
                                    <i className="fas fa-bell text-lg"></i>
                                    {hasAlert && (
                                        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">!</span>
                                    )}
                                </button>

                                {showAlertDropdown && (
                                    <div className="absolute right-10 top-8 z-20 w-64 bg-white text-black rounded-md shadow-lg">
                                        <BudgetAlertDropdown
                                            onClose={() => setShowAlertDropdown(false)}
                                            alerts={alerts}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="relative">
                                <button
                                    onClick={() => setShowAvatarMenu(!showAvatarMenu)}
                                    className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm"
                                    title="Account"
                                >
                                    {userInitial}
                                </button>

                                {showAvatarMenu && (
                                    <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg text-black z-20">
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <Link to="/login" className="hover:underline">Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
