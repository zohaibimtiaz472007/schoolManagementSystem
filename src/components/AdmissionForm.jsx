import React, { useState, useEffect } from 'react';
import { db } from '../firebase/Config';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import toast from 'react-hot-toast';

const AdmissionForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    class: '',
    address: '',
    rollNo: '',
    parentName: '',
    parentContact: ''
  });

  const [existingRollNos, setExistingRollNos] = useState([]);
  const [rollNoError, setRollNoError] = useState(false);

  useEffect(() => {
    const fetchRollNos = async () => {
      const querySnapshot = await getDocs(collection(db, 'students'));
      const rollNos = querySnapshot.docs.map(doc => doc.data().rollNo);
      setExistingRollNos(rollNos);
    };
    fetchRollNos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (existingRollNos.includes(formData.rollNo)) {
      setRollNoError(true);
      toast.error("Roll Number already exists");
    } else {
      await addDoc(collection(db, 'students'), formData);
      toast.success("Student Added Successfully");
      setFormData({
        name: '',
        age: '',
        class: '',
        address: '',
        rollNo: '',
        parentName: '',
        parentContact: ''
      });
      setRollNoError(false);
      setExistingRollNos([...existingRollNos, formData.rollNo]); // Add new roll number to the list
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Student Admission Form</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              required
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Age</label>
            <input
              type="number"
              name="age"
              required
              value={formData.age}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Class</label>
            <input
              type="text"
              name="class"
              required
              value={formData.class}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Address</label>
            <input
              type="text"
              required
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Roll Number</label>
            <input
              type="text"
              name="rollNo"
              required
              value={formData.rollNo}
              onChange={(e) => {
                handleChange(e);
                setRollNoError(false);
              }}
              className={`w-full p-2 border ${rollNoError ? 'border-red-500' : 'border-gray-300'} rounded mt-1`}
            />
            {rollNoError && <p className="text-red-500 text-sm">Roll Number already exists</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Parent Name</label>
            <input
              type="text"
              name="parentName"
              required
              value={formData.parentName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Parent Contact</label>
            <input
              type="text"
              name="parentContact"
              required
              value={formData.parentContact}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdmissionForm;
