import React, { useEffect, useState } from 'react';
import { db } from '../firebase/Config';
import { collection, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import toast from 'react-hot-toast';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    rollNo: '',
    name: '',
    age: '',
    class: '',
    address: '',
    parentName: '',
    parentContact: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchClass, setSearchClass] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [searchRollNo, setSearchRollNo] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'students'), (snapshot) => {
      const studentList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      studentList.sort((a, b) => a.rollNo.localeCompare(b.rollNo));
      setStudents(studentList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'students', id));
    toast.success('Record deleted successfully');
  };

  const handleEdit = (student) => {
    setEditingId(student.id);
    setEditData(student);
    setIsModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await updateDoc(doc(db, 'students', editingId), editData);
    setEditingId(null);
    toast.success('Record updated successfully');
    setIsModalOpen(false);
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    student.class.toLowerCase().includes(searchClass.toLowerCase()) &&
    student.address.toLowerCase().includes(searchAddress.toLowerCase()) &&
    student.rollNo.toLowerCase().includes(searchRollNo.toLowerCase())
  );

  const groupedStudents = filteredStudents.reduce((groups, student) => {
    const className = student.class;
    if (!groups[className]) {
      groups[className] = [];
    }
    groups[className].push(student);
    return groups;
  }, {});

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Student List</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder="Search by class..."
              value={searchClass}
              onChange={(e) => setSearchClass(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder="Search by address..."
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder="Search by roll number..."
              value={searchRollNo}
              onChange={(e) => setSearchRollNo(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          {loading ? (
            <div>
              <Skeleton height={40} count={6} className="mb-4" />
            </div>
          ) : (
            <>
              {Object.keys(groupedStudents).map(className => (
                <div key={className}>
                  <h2 className="text-2xl font-bold my-4">Class: {className}</h2>
                  <div className="grid gap-6 mb-6">
                    {groupedStudents[className].map(student => (
                      <div key={student.id} className="p-4 bg-white border rounded-lg shadow">
                        <p><strong>Roll No:</strong> {student.rollNo}</p>
                        <p><strong>Name:</strong> {student.name}</p>
                        <p><strong>Age:</strong> {student.age}</p>
                        <p><strong>Address:</strong> {student.address}</p>
                        <p><strong>Parent Name:</strong> {student.parentName}</p>
                        <p><strong>Parent Contact:</strong> {student.parentContact}</p>
                        <div className="mt-4">
                          <button
                            onClick={() => handleEdit(student)}
                            className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(student.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setIsModalOpen(false)}
          />
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-3/4 lg:w-1/2 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Edit Student</h2>
            <form onSubmit={handleUpdate}>
              <div className="grid grid-cols-1 gap-6">
                <input
                  type="text"
                  placeholder="Roll No"
                  value={editData.rollNo}
                  onChange={(e) => setEditData({ ...editData, rollNo: e.target.value })}
                  className="p-2 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  placeholder="Name"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="p-2 border border-gray-300 rounded"
                />
                <input
                  type="number"
                  placeholder="Age"
                  value={editData.age}
                  onChange={(e) => setEditData({ ...editData, age: e.target.value })}
                  className="p-2 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  placeholder="Class"
                  value={editData.class}
                  onChange={(e) => setEditData({ ...editData, class: e.target.value })}
                  className="p-2 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  placeholder="Address"
                  value={editData.address}
                  onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                  className="p-2 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  placeholder="Parent Name"
                  value={editData.parentName}
                  onChange={(e) => setEditData({ ...editData, parentName: e.target.value })}
                  className="p-2 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  placeholder="Parent Contact"
                  value={editData.parentContact}
                  onChange={(e) => setEditData({ ...editData, parentContact: e.target.value })}
                  className="p-2 border border-gray-300 rounded"
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-500 text-white px-3 py-2 rounded mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-3 py-2 rounded"
                  >
                    Update
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;
