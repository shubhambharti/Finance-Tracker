import React, { useEffect, useState } from 'react';
import { getExpenses, deleteExpense } from '../services/api';
import { useNavigate } from 'react-router-dom';

let categories = ['All', 'Food', 'Rent', 'Shopping', 'Travel', 'Utilities'];
let methods = ['All', 'Cash', 'UPI', 'Credit Card'];

export default function ExpenseList() {
  let [expenses, setExpenses] = useState([]);
  let [filter, setFilter] = useState({ category: 'All', method: 'All', date: '' });
  let [search, setSearch] = useState('');
  let navigate = useNavigate();

  useEffect(() => {
    fetchExpenses();
  }, []);

  let fetchExpenses = async () => {
    let res = await getExpenses();
    setExpenses(res.data);
  };

  let handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense(id);
        setExpenses(expenses.filter(e => e._id !== id));
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  let filteredExpenses = expenses.filter(exp => {
    let matchCategory = filter.category === 'All' || exp.category === filter.category;
    let matchMethod = filter.method === 'All' || exp.method === filter.method;
    let matchDate = !filter.date || exp.date.startsWith(filter.date);
    let matchSearch = !search || (
      exp.category.toLowerCase().includes(search.toLowerCase()) ||
      exp.method.toLowerCase().includes(search.toLowerCase()) ||
      exp.notes?.toLowerCase().includes(search.toLowerCase())
    );

    return matchCategory && matchMethod && matchDate && matchSearch;
  });

  return (
    <div className="bg-gray-100 p-6 mt-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Expenses</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by category, method, or notes..."
          className="border border-gray-300 rounded p-2 w-full bg-white text-gray-800"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <select
          className="border border-gray-300 rounded p-2 w-full bg-white text-gray-800"
          value={filter.category}
          onChange={(e) => setFilter({ ...filter, category: e.target.value })}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          className="border border-gray-300 rounded p-2 w-full bg-white text-gray-800"
          value={filter.method}
          onChange={(e) => setFilter({ ...filter, method: e.target.value })}
        >
          {methods.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        <input
          type="date"
          className="border border-gray-300 rounded p-2 w-full bg-white text-gray-800"
          value={filter.date}
          onChange={(e) => setFilter({ ...filter, date: e.target.value })}
        />
      </div>

      <ul className="divide-y divide-gray-300">
        {filteredExpenses.length === 0 ? (
          <p className="text-gray-500">No expenses found.</p>
        ) : (
          filteredExpenses.map((exp) => (
            <li key={exp._id} className="py-4 flex justify-between items-start">
              <div>
                <p className="text-lg font-medium text-gray-900">
                  ₹{exp.amount} - {exp.category}
                </p>
                <p className="text-sm text-gray-600">
                  {exp.date?.substring(0, 10)} | {exp.method} | {exp.notes}
                </p>
              </div>
              <div className="flex space-x-4 mt-1">
                <button
                  onClick={() => navigate(`/edit-expense/${exp._id}`)}
                  className="text-blue-600 hover:text-blue-800"
                  title="Edit"
                >
                  <i className="fas fa-pen"></i>
                </button>
                <button
                  onClick={() => handleDelete(exp._id)}
                  className="text-red-600 hover:text-red-800"
                  title="Delete"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

