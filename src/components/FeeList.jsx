import React, { useEffect, useState } from 'react';
import { db } from '../firebase/Config';
import { collection, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import Skeleton from 'react-loading-skeleton';
import Modal from 'react-modal';
import 'react-loading-skeleton/dist/skeleton.css';
import toast from 'react-hot-toast';

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
    maxWidth: '90%',
    width: '400px',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
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
    class: '',
    paid: false,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [paidFilter, setPaidFilter] = useState('');
  const [modalIsOpen, setIsOpen] = useState(false);
  const [totalPaidAmount, setTotalPaidAmount] = useState(0);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'fees'), (snapshot) => {
      setFees(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const paidAmount = fees.reduce((total, fee) => {
      if (fee.paid) {
        return total + (parseFloat(fee.amount || 0) + parseFloat(fee.fine || 0) + parseFloat(fee.sports || 0) + parseFloat(fee.other || 0));
      }
      return total;
    }, 0);
    setTotalPaidAmount(paidAmount);
  }, [fees]);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'fees', id));
    toast.success('Fee deleted successfully');
  };

  const handleEdit = (fee) => {
    setEditingId(fee.id);
    setEditData(fee);
    setIsOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await updateDoc(doc(db, 'fees', editingId), editData);
    setEditingId(null);
    toast.success('Fee updated successfully');
    setIsOpen(false);
  };

  const handlePaid = async (id) => {
    const feeDoc = doc(db, 'fees', id);
    const fee = fees.find(f => f.id === id);
    await updateDoc(feeDoc, { paid: !fee.paid });
  };

  const filteredFees = fees.filter(fee => {
    const feeDate = new Date(fee.date);
    return (
      fee.studentId.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (classFilter === '' || fee.class === classFilter) &&
      (monthFilter === '' || (feeDate.getMonth() + 1).toString() === monthFilter) &&
      (yearFilter === '' || feeDate.getFullYear().toString() === yearFilter) &&
      (paidFilter === '' || fee.paid.toString() === paidFilter)
    );
  });

  const totalAmount = filteredFees.reduce((total, fee) => total + parseFloat(fee.amount || 0), 0);
  const totalFine = filteredFees.reduce((total, fee) => total + parseFloat(fee.fine || 0), 0);
  const totalSports = filteredFees.reduce((total, fee) => total + parseFloat(fee.sports || 0), 0);
  const totalOther = filteredFees.reduce((total, fee) => total + parseFloat(fee.other || 0), 0);

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
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Fee List</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          {loading ? (
            <Skeleton height={100} count={6} className="mb-4" />
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
              <input
                type="number"
                placeholder="Filter by Month"
                value={monthFilter}
                onChange={(e) => setMonthFilter(e.target.value)}
                className="p-2 border border-gray-300 rounded mb-6 w-full"
              />
              <input
                type="number"
                placeholder="Filter by Year"
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="p-2 border border-gray-300 rounded mb-6 w-full"
              />
              <select
                value={paidFilter}
                onChange={(e) => setPaidFilter(e.target.value)}
                className="p-2 border border-gray-300 rounded mb-6 w-full"
              >
                <option value="">Filter by Paid Status</option>
                <option value="true">Paid</option>
                <option value="false">Unpaid</option>
              </select>
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
                <p>Total Paid Amount: Rs {totalPaidAmount}</p>
              </div>
              <div id="cards" className="flex flex-wrap -m-4 mt-6">
                {filteredFees.map((fee) => (
                  <div key={fee.id} className="w-full sm:w-1/2 md:w-1/3 p-4">
                    <div className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${fee.paid ? 'border-green-500' : 'border-blue-500'}`}>
                      <h2 className="text-xl font-bold mb-2">Student ID: {fee.studentId}</h2>
                      <p className="text-gray-700">Amount: Rs {fee.amount}</p>
                      <p className="text-gray-700">Date: {fee.date}</p>
                      <p className="text-gray-700">Fine: Rs {fee.fine}</p>
                      <p className="text-gray-700">Sports: Rs {fee.sports}</p>
                      <p className="text-gray-700">Other: Rs {fee.other}</p>
                      <p className="text-gray-700">Class: {fee.class}</p>
                      <p className={`text-lg font-bold mt-4 ${fee.paid ? 'text-green-500' : 'text-red-500'}`}>
                        {fee.paid ? 'Paid' : 'Unpaid'}
                      </p>
                      <div className="mt-4 flex space-x-2">
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
                        <button
                          onClick={() => handlePaid(fee.id)}
                          className={`px-3 py-2 rounded ${fee.paid ? 'bg-green-500' : 'bg-gray-500'} text-white`}
                        >
                          {fee.paid ? 'Paid' : 'Unpaid'}
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
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customStyles} contentLabel="Edit Fee Modal">
        <h2 className="text-2xl font-bold mb-4">Edit Fee</h2>
        <form onSubmit={handleUpdate}>
          <div className="flex flex-wrap -m-2">
            <div className="p-2 w-full sm:w-1/2">
              <label className="block text-gray-700">Student ID</label>
              <input
                type="text"
                value={editData.studentId}
                onChange={(e) => setEditData({ ...editData, studentId: e.target.value })}
                className="p-2 border border-gray-300 rounded w-full"
                required
              />
            </div>
            <div className="p-2 w-full sm:w-1/2">
              <label className="block text-gray-700">Amount</label>
              <input
                type="number"
                value={editData.amount}
                onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
                className="p-2 border border-gray-300 rounded w-full"
                required
              />
            </div>
            <div className="p-2 w-full sm:w-1/2">
              <label className="block text-gray-700">Date</label>
              <input
                type="date"
                value={editData.date}
                onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                className="p-2 border border-gray-300 rounded w-full"
                required
              />
            </div>
            <div className="p-2 w-full sm:w-1/2">
              <label className="block text-gray-700">Fine</label>
              <input
                type="number"
                value={editData.fine}
                onChange={(e) => setEditData({ ...editData, fine: e.target.value })}
                className="p-2 border border-gray-300 rounded w-full"
              />
            </div>
            <div className="p-2 w-full sm:w-1/2">
              <label className="block text-gray-700">Sports</label>
              <input
                type="number"
                value={editData.sports}
                onChange={(e) => setEditData({ ...editData, sports: e.target.value })}
                className="p-2 border border-gray-300 rounded w-full"
              />
            </div>
            <div className="p-2 w-full sm:w-1/2">
              <label className="block text-gray-700">Other</label>
              <input
                type="number"
                value={editData.other}
                onChange={(e) => setEditData({ ...editData, other: e.target.value })}
                className="p-2 border border-gray-300 rounded w-full"
              />
            </div>
            <div className="p-2 w-full sm:w-1/2">
              <label className="block text-gray-700">Class</label>
              <input
                type="text"
                value={editData.class}
                onChange={(e) => setEditData({ ...editData, class: e.target.value })}
                className="p-2 border border-gray-300 rounded w-full"
              />
            </div>
            <div className="p-2 w-full">
              <label className="block text-gray-700">Paid</label>
              <input
                type="checkbox"
                checked={editData.paid}
                onChange={(e) => setEditData({ ...editData, paid: e.target.checked })}
                className="mr-2"
              />
              <span>{editData.paid ? 'Paid' : 'Unpaid'}</span>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Save</button>
            <button type="button" onClick={closeModal} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FeeList;
