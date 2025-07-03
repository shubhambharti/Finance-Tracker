import React, { useEffect, useState } from 'react';
import { getBudgets, setBudget, deleteBudget } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function BudgetList() {
    let [budgets, setBudgets] = useState([]);
    let [editId, setEditId] = useState(null);
    let [form, setForm] = useState({ category: '', amount: '' });
    let userId = localStorage.getItem('userId');
    let navigate = useNavigate();

    useEffect(() => {
        fetchBudgets();
    }, []);

    let fetchBudgets = async () => {
        try {
            let res = await getBudgets(userId);
            setBudgets(res.data);
        } catch (err) {
            console.error('Failed to load budgets:', err);
        }
    };

    let handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.category || !form.amount) return;
        try {
            await setBudget({ userId, category: form.category, amount: form.amount });
            setForm({ category: '', amount: '' });
            setEditId(null);
            fetchBudgets();
        } catch (err) {
            console.error('Save failed:', err);
        }
    };

    let handleEdit = (b) => {
        setEditId(b._id);
        setForm({ category: b.category, amount: b.limit });
    };

    let handleDelete = async (id) => {
        if (!window.confirm('Delete this budget?')) return;
        try {
            await deleteBudget(id);
            fetchBudgets();
        } catch (err) {
            console.error('Delete failed:', err);
        }
    };

    return (
        <div className="bg-white p-6 mt-6 rounded-lg shadow-md text-gray-800">
            <h2 className="text-xl font-semibold mb-4">Budgets</h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="border rounded px-3 py-2 w-full"
                />
                <input
                    type="number"
                    name="amount"
                    placeholder="Amount"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    className="border rounded px-3 py-2 w-full"
                />
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
                >
                    {editId ? 'Update' : 'Add'}
                </button>
            </form>

            <ul className="divide-y divide-gray-200">
                {budgets.map((b) => (
                    <li key={b._id} className="py-4 flex justify-between items-start">
                        <div>
                            <p className="text-lg font-medium">{b.category}</p>
                            <p className="text-sm text-gray-600">₹{b.limit}</p>
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => handleEdit(b)}
                                className="text-blue-600 hover:text-blue-800 text-sm"
                                title="Edit"
                            >
                                <i className="fas fa-pen"></i>
                            </button>
                            <button
                                onClick={() => handleDelete(b._id)}
                                className="text-red-600 hover:text-red-800 text-sm"
                                title="Delete"
                            >
                                <i className="fas fa-trash"></i>
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

