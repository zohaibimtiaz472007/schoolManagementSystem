import React, { useEffect, useState } from 'react';
import { db } from '../firebase/Config';
import { collection, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import Skeleton from 'react-loading-skeleton';
import Modal from 'react-modal';
import 'react-loading-skeleton/dist/skeleton.css';

// Custom styles for Modal
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '10px',
    padding: '20px',
  },
};

const FeeList = () => {
  const [fees, setFees] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    studentId: '',
    amount: '',
    date: '',
    fine: '',
    sports: '',
    other: '',
    class: ''
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [modalIsOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'fees'), (snapshot) => {
      setFees(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'fees', id));
  };

  const handleEdit = (fee) => {
    setEditingId(fee.id);
    setEditData(fee);
    setIsOpen(true); // Open modal
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await updateDoc(doc(db, 'fees', editingId), editData);
    setEditingId(null);
    setIsOpen(false); // Close modal
  };

  // Filter fees based on search term and class filter
  const filteredFees = fees.filter(fee =>
    fee.studentId.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (classFilter === '' || fee.class === classFilter)
  );

  // Calculate totals
  const totalAmount = filteredFees.reduce((total, fee) => total + parseFloat(fee.amount || 0), 0);
  const totalFine = filteredFees.reduce((total, fee) => total + parseFloat(fee.fine || 0), 0);
  const totalSports = filteredFees.reduce((total, fee) => total + parseFloat(fee.sports || 0), 0);
  const totalOther = filteredFees.reduce((total, fee) => total + parseFloat(fee.other || 0), 0);

  // Calculate overall total
  const overallTotal = filteredFees.reduce((total, fee) => {
    return total + (parseFloat(fee.amount || 0) + parseFloat(fee.fine || 0) + parseFloat(fee.sports || 0) + parseFloat(fee.other || 0));
  }, 0);

  const handlePrintAll = () => {
    const printContents = document.getElementById('cards').innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  };

  const closeModal = () => {
    setIsOpen(false);
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <style>
        {`
          @media print {
            #cards {
              display: flex;
              flex-wrap: wrap;
            }
            #cards > div {
              flex: 1 0 30%;
              box-sizing: border-box;
              margin: 5px;
            }
          }
        `}
      </style>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Fee List</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          {loading ? (
            <Skeleton height={100} count={6} className='mb-4' />
          ) : (
            <>
              <input
                type="text"
                placeholder="Search by Student ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-2 border border-gray-300 rounded mb-6 w-full"
              />
              <input
                type="text"
                placeholder="Filter by Class"
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="p-2 border border-gray-300 rounded mb-6 w-full"
              />
              <button
                onClick={handlePrintAll}
                className="bg-green-500 text-white px-3 py-2 rounded mb-6"
              >
                Print All
              </button>
              <div className="mt-6 bg-gray-200 p-4 rounded-lg">
                <h2 className="text-xl font-bold mb-4">Totals</h2>
                <p>Total Amount: Rs {totalAmount}</p>
                <p>Total Fine: Rs {totalFine}</p>
                <p>Total Sports: Rs {totalSports}</p>
                <p>Total Other: Rs {totalOther}</p>
                <p>Overall Total: Rs {overallTotal}</p>
              </div>
              <div id="cards" className="flex flex-wrap -m-4 mt-6">
                {filteredFees.map((fee) => (
                  <div key={fee.id} className="w-full sm:w-1/2 md:w-1/3 p-4">
                    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                      <h2 className="text-xl font-bold mb-2">Student ID: {fee.studentId}</h2>
                      <p className="text-gray-700">Amount: Rs {fee.amount}</p>
                      <p className="text-gray-700">Date: {fee.date}</p>
                      <p className="text-gray-700">Fine: Rs {fee.fine}</p>
                      <p className="text-gray-700">Sports: Rs {fee.sports}</p>
                      <p className="text-gray-700">Other: Rs {fee.other}</p>
                      <p className="text-gray-700">Class: {fee.class}</p>
                      <div className="flex justify-between mt-4">
                        <button
                          onClick={() => handleEdit(fee)}
                          className="bg-blue-500 text-white px-3 py-2 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(fee.id)}
                          className="bg-red-500 text-white px-3 py-2 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Edit Fee Modal"
      >
        <h2 className="text-2xl font-bold mb-4">Edit Fee</h2>
        <form onSubmit={handleUpdate}>
          <div className="mb-4">
            <label className="block text-gray-700">Student ID</label>
            <input
              type="text"
              name="studentId"
              value={editData.studentId}
              onChange={(e) => setEditData({ ...editData, studentId: e.target.value })}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Amount</label>
            <input
              type="number"
              name="amount"
              value={editData.amount}
              onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              value={editData.date}
              onChange={(e) => setEditData({ ...editData, date: e.target.value })}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Fine</label>
            <input
              type="number"
              name="fine"
              value={editData.fine}
              onChange={(e) => setEditData({ ...editData, fine: e.target.value })}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Sports</label>
            <input
              type="number"
              name="sports"
              value={editData.sports}
              onChange={(e) => setEditData({ ...editData, sports: e.target.value })}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Other</label>
            <input
              type="number"
              name="other"
              value={editData.other}
              onChange={(e) => setEditData({ ...editData, other: e.target.value })}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Class</label>
            <input
              type="text"
              name="class"
              value={editData.class}
              onChange={(e) => setEditData({ ...editData, class: e.target.value })}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="bg-blue-500 text-white px-3 py-2 rounded mr-2">Save</button>
            <button onClick={closeModal} className="bg-gray-500 text-white px-3 py-2 rounded">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FeeList;
