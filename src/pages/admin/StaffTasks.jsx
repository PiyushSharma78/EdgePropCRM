import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const sampleStaff = ["Rohit", "Deepa", "Sana", "Karan"];

export default function StaffTasks() {
  const [selectedStaff, setSelectedStaff] = useState("");
  const [allTasks, setAllTasks] = useState({});
  const [taskInput, setTaskInput] = useState({
    title: "",
    note: "",
    dueDate: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem("staffTaskMap");
    if (stored) setAllTasks(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("staffTaskMap", JSON.stringify(allTasks));
  }, [allTasks]);

  const handleAssign = () => {
    if (!selectedStaff || !taskInput.title || !taskInput.dueDate) {
      toast.error("Fill all fields before assigning");
      return;
    }

    const newTask = {
      id: Date.now(),
      ...taskInput,
      completed: false,
    };

    setAllTasks((prev) => ({
      ...prev,
      [selectedStaff]: [...(prev[selectedStaff] || []), newTask],
    }));

    setTaskInput({ title: "", note: "", dueDate: "" });
    toast.success(`Task assigned to ${selectedStaff}`);
  };

  const handleDelete = (taskId) => {
    setAllTasks((prev) => ({
      ...prev,
      [selectedStaff]: prev[selectedStaff].filter((task) => task.id !== taskId),
    }));
    toast.success("Task deleted");
  };

  const staffTasks = selectedStaff ? allTasks[selectedStaff] || [] : [];

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div>
        <h2 className="text-3xl font-bold text-blue-700">
          🧑‍💼 Staff Task Assignment
        </h2>
        <p className="text-gray-600 text-sm mt-1">
          Assign, review, and manage tasks for your staff members. Select a
          staff member below to begin.
        </p>
      </div>

      {/* Staff Selection */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Select Staff Member:
        </label>
        <select
          className="border px-4 py-2 rounded w-full sm:w-1/2"
          value={selectedStaff}
          onChange={(e) => setSelectedStaff(e.target.value)}
        >
          <option value="">-- Choose Staff --</option>
          {sampleStaff.map((name) => (
            <option key={name}>{name}</option>
          ))}
        </select>
      </div>

      {/* If no staff selected */}
      {!selectedStaff && (
        <div className="bg-white shadow p-6 rounded text-center text-gray-500">
          <p className="text-lg font-medium">
            Please select a staff member to begin assigning tasks.
          </p>
          <p className="text-sm mt-2">Use the dropdown above to get started.</p>
        </div>
      )}

      {/* Assign Form */}
      {selectedStaff && (
        <div className="bg-white shadow rounded-xl p-5 space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">
            ➕ Assign New Task to {selectedStaff}
          </h3>
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4">
            <input
              type="text"
              placeholder="Task title"
              value={taskInput.title}
              onChange={(e) =>
                setTaskInput((prev) => ({ ...prev, title: e.target.value }))
              }
              className="border px-3 py-2 rounded w-full sm:w-[32%]"
            />
            <input
              type="date"
              value={taskInput.dueDate}
              onChange={(e) =>
                setTaskInput((prev) => ({ ...prev, dueDate: e.target.value }))
              }
              className="border px-3 py-2 rounded w-full sm:w-[25%]"
            />
            <input
              type="text"
              placeholder="Optional note"
              value={taskInput.note}
              onChange={(e) =>
                setTaskInput((prev) => ({ ...prev, note: e.target.value }))
              }
              className="border px-3 py-2 rounded w-full sm:flex-1"
            />
            <button
              onClick={handleAssign}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full sm:w-auto"
            >
              Assign Task
            </button>
          </div>
        </div>
      )}

      {/* Task List */}
      {selectedStaff && (
        <div className="bg-white shadow rounded-xl overflow-hidden">
          <div className="p-4 font-medium text-gray-700 border-b">
            📋 Tasks assigned to{" "}
            <span className="text-blue-600">{selectedStaff}</span>
          </div>

          {staffTasks.length === 0 ? (
            <div className="p-6 text-center text-gray-500 text-sm italic">
              No tasks assigned yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left">Title</th>
                    <th className="px-4 py-3 text-left">Due Date</th>
                    <th className="px-4 py-3 text-left">Note</th>
                    <th className="px-4 py-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {staffTasks.map((task) => (
                    <tr key={task.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2">{task.title}</td>
                      <td className="px-4 py-2">{task.dueDate}</td>
                      <td className="px-4 py-2">{task.note}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="text-red-500 hover:text-red-700 text-xs"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
