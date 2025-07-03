import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addExpense, getExpenses, updateExpense } from '../services/api';

let categories = ['Food', 'Rent', 'Shopping', 'Travel', 'Utilities'];
let methods = ['Cash', 'UPI', 'Credit Card'];

export default function ExpenseForm() {
  let [formData, setFormData] = useState({
    amount: '',
    category: '',
    date: '',
    method: '',
    notes: '',
  });
  let [loading, setLoading] = useState(false);
  let { id } = useParams();
  let navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchExistingExpense();
    }
  }, [id]);

  let fetchExistingExpense = async () => {
    try {
      let res = await getExpenses();
      let current = res.data.find(e => e._id === id);
      if (current) setFormData(current);
    } catch (err) {
      console.error('Failed to fetch expense for edit:', err);
    }
  };

  let handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  let handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await (id ? updateExpense(id, formData) : addExpense(formData));
      navigate('/expenses');
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        {id ? 'Edit Expense' : 'Add Expense'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date?.substring(0, 10)}
            onChange={handleChange}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Payment Method</label>
          <select
            name="method"
            value={formData.method}
            onChange={handleChange}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
          >
            <option value="">Select Method</option>
            {methods.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            name="notes"
            rows={2}
            value={formData.notes}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {loading ? 'Saving...' : id ? 'Update' : 'Submit'}
        </button>
      </form>
    </div>
  );
}

