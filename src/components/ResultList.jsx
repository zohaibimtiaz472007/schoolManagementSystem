import React, { useEffect, useState } from "react";
import { db } from "../firebase/Config";
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

const ResultList = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    studentId: "",
    marks: {},
    class: "",
    obtainedMarks: 0,
    totalMarks: 0,
  });

  const [searchStudentId, setSearchStudentId] = useState("");
  const [searchClass, setSearchClass] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "results"), (snapshot) => {
      setResults(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "results", id));
  };

  const handleEdit = (result) => {
    setEditingId(result.id);
    setEditData(result);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const totalMarks = Object.values(editData.marks).reduce(
      (acc, mark) => acc + Number(mark),
      0
    );
    await updateDoc(doc(db, "results", editingId), {
      ...editData,
      obtainedMarks: totalMarks,
    });
    setEditingId(null);
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredResults = results.filter(
    (result) =>
      result.studentId.toLowerCase().includes(searchStudentId.toLowerCase()) &&
      result.class.toLowerCase().includes(searchClass.toLowerCase())
  );

  const groupedResults = filteredResults.reduce((acc, result) => {
    const className = result.class;
    if (!acc[className]) {
      acc[className] = [];
    }
    acc[className].push(result);
    return acc;
  }, {});

  const renderSkeletonLoader = () => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <div
          key={index}
          className="animate-pulse bg-gray-300 h-8 w-full mb-2 rounded"
        ></div>
      ));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Result List</h1>
        <div className="mb-6 flex space-x-4">
          <input
            type="text"
            placeholder="Search by Student ID"
            value={searchStudentId}
            onChange={(e) => setSearchStudentId(e.target.value)}
            className="p-2 border border-gray-300 rounded w-full max-w-xs"
          />
          <input
            type="text"
            placeholder="Search by Class"
            value={searchClass}
            onChange={(e) => setSearchClass(e.target.value)}
            className="p-2 border border-gray-300 rounded w-full max-w-xs"
          />
        </div>
        <button
          onClick={handlePrint}
          className="mb-6 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Print
        </button>
        {loading ? (
          renderSkeletonLoader()
        ) : (
          Object.keys(groupedResults).map((className) => (
            <div key={className} className="mb-6">
              <h2 className="text-2xl font-bold mb-4">Class: {className}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedResults[className].map((result) => (
                  <div
                    key={result.id}
                    className="bg-white p-6 rounded-lg shadow-lg"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold">
                        Student ID: {result.studentId}
                      </h2>
                      <div>
                        <button
                          onClick={() => handleEdit(result)}
                          className="mr-2 bg-green-500 text-white px-2 py-1 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(result.id)}
                          className="bg-red-500 text-white px-2 py-1 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-lg font-bold">
                        Total Marks: {result.totalMarks}
                      </h3>
                      <h3 className="text-lg font-bold">
                        Obtained Marks: {result.obtainedMarks}
                      </h3>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2">Marks</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.keys(result.marks).map((subject) => (
                          <div key={subject} className="bg-gray-100 p-2 rounded">
                            <p className="text-sm font-semibold">
                              {subject.charAt(0).toUpperCase() +
                                subject.slice(1)}
                            </p>
                            <p className="text-sm">{result.marks[subject]}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
      {editingId && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-lg mx-auto">
            <h2 className="text-xl font-bold mb-4">Edit Result</h2>
            <form onSubmit={handleUpdate}>
              <div className="flex flex-wrap mb-4">
                <label className="block text-gray-700 w-32">Student ID</label>
                <input
                  type="text"
                  name="studentId"
                  value={editData.studentId}
                  onChange={(e) =>
                    setEditData({ ...editData, studentId: e.target.value })
                  }
                  className="flex-grow px-3 py-2 border rounded "
                />
              </div>
              <div className="flex flex-wrap mb-4">
                <label className="block text-gray-700 w-32">Class</label>
                <select
                  name="class"
                  value={editData.class}
                  onChange={(e) =>
                    setEditData({ ...editData, class: e.target.value })
                  }
                  className="flex-grow px-3 py-2 border rounded"
                >
                  <option value="">Select Class</option>
                  {[
                    "1st",
                    "2nd",
                    "3rd",
                    "4th",
                    "5th",
                    "6th",
                    "7th",
                    "8th",
                    "9th",
                    "10th",
                  ].map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </div>
              {Object.keys(editData.marks).map((subject) => (
                <div className="flex flex-wrap mb-4" key={subject}>
                  <label className="block text-gray-700 w-32">
                    {subject.charAt(0).toUpperCase() + subject.slice(1)}
                  </label>
                  <input
                    type="number"
                    name={subject}
                    value={editData.marks[subject]}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        marks: { ...editData.marks, [subject]: e.target.value },
                      })
                    }
                    className="flex-grow px-3 py-2 border rounded"
                  />
                </div>
              ))}
              <div className="flex flex-wrap mb-4">
                <label className="block text-gray-700 w-32">Total Marks</label>
                <input
                  type="number"
                  name="totalMarks"
                  value={editData.totalMarks}
                  readOnly
                  className="flex-grow px-3 py-2 border rounded bg-gray-100"
                />
              </div>
              <div className="flex flex-wrap mb-4">
                <label className="block text-gray-700 w-32">Obtained Marks</label>
                <input
                  type="number"
                  name="obtainedMarks"
                  value={editData.obtainedMarks}
                  readOnly
                  className="flex-grow px-3 py-2 border rounded bg-gray-100"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultList;