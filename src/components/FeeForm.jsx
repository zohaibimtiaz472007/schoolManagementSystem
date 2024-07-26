import React, { useState } from 'react';
import { db } from '../firebase/Config';
import { collection, addDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

const FeeForm = () => {
  const [fee, setFee] = useState({
    studentId: '',
    amount: '',
    date: '',
    fine: '',
    sports: '',
    other: '',
    class: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFee({ ...fee, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'fees'), fee);
      toast.success('Fee recorded successfully');
      setFee({ studentId: '', amount: '', date: '', fine: '', sports: '', other: '', class: '' });
    } catch (error) {
      console.error('Error recording fee: ', error);
      toast.error('Failed to record fee');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Fee Management Form</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Student ID</label>
            <input
              type="text"
              name="studentId"
              value={fee.studentId}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Amount</label>
            <input
              type="number"
              name="amount"
              value={fee.amount}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              value={fee.date}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Fine</label>
            <input
              type="number"
              name="fine"
              value={fee.fine}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Sports</label>
            <input
              type="number"
              name="sports"
              value={fee.sports}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Other</label>
            <input
              type="number"
              name="other"
              value={fee.other}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Class</label>
            <input
              type="text"
              name="class"
              value={fee.class}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default FeeForm;
