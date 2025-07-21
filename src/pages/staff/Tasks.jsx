import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ConfirmationModal from "../../components/common/ConfirmationModal";

const defaultTasks = [
  {
    id: 1,
    title: "Review KYC for Ravi Kumar",
    dueDate: "2024-06-20",
    note: "Check Aadhar mismatch",
    completed: false,
  },
  {
    id: 2,
    title: "Verify Contract for Anjali",
    dueDate: "2024-06-21",
    note: "Confirm signature on page 2",
    completed: false,
  },
  {
    id: 3,
    title: "Update License info",
    dueDate: "2024-06-22",
    note: "Renew expiring license",
    completed: true,
  },
];

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc");
  const [confirm, setConfirm] = useState({ open: false, task: null });

  useEffect(() => {
    const stored = localStorage.getItem("staffTasks");
    if (stored) {
      setTasks(JSON.parse(stored));
    } else {
      setTasks(defaultTasks);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("staffTasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleConfirm = (task) => {
    setConfirm({ open: true, task });
  };

  const handleToggle = () => {
    const { task } = confirm;
    const updated = tasks.map((t) =>
      t.id === task.id ? { ...t, completed: !t.completed } : t
    );
    setTasks(updated);
    toast.success(
      `Task ${task.completed ? "marked as pending" : "completed"}!`
    );
    setConfirm({ open: false, task: null });
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "All") return true;
    return filter === "Pending" ? !task.completed : task.completed;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) =>
    sortOrder === "asc"
      ? new Date(a.dueDate) - new Date(b.dueDate)
      : new Date(b.dueDate) - new Date(a.dueDate)
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-blue-700 mb-6">
        📝 Your Assigned Tasks
      </h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center mb-6 text-sm">
        <select
          className="border px-3 py-2 rounded w-full sm:w-auto"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All Tasks</option>
          <option value="Pending">Pending Only</option>
          <option value="Completed">Completed Only</option>
        </select>
        <select
          className="border px-3 py-2 rounded w-full sm:w-auto"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="asc">Sort by Due Date ↑</option>
          <option value="desc">Sort by Due Date ↓</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-xl border">
        <table className="w-full text-sm sm:text-base">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left whitespace-nowrap">Task</th>
              <th className="px-4 py-3 text-left whitespace-nowrap">
                Due Date
              </th>
              <th className="px-4 py-3 text-left whitespace-nowrap">Note</th>
              <th className="px-4 py-3 text-left whitespace-nowrap">Status</th>
              <th className="px-4 py-3 text-left whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedTasks.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No tasks found.
                </td>
              </tr>
            ) : (
              sortedTasks.map((task) => (
                <tr key={task.id} className="border-t">
                  <td className="px-4 py-3">{task.title}</td>
                  <td className="px-4 py-3">{task.dueDate}</td>
                  <td className="px-4 py-3 text-gray-600">{task.note}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-3 py-1 text-xs rounded-full ${
                        task.completed
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {task.completed ? "Completed" : "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleConfirm(task)}
                      className={`px-4 py-1 rounded text-white text-xs ${
                        task.completed
                          ? "bg-gray-500 hover:bg-gray-600"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {task.completed ? "Undo" : "Mark Done"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirm.open}
        onClose={() => setConfirm({ open: false, task: null })}
        onConfirm={handleToggle}
        title={
          confirm.task?.completed ? "Undo Task Completion" : "Mark Task as Done"
        }
        message={
          confirm.task
            ? confirm.task.completed
              ? `Do you want to undo completion of "${confirm.task.title}"?`
              : `Are you sure you want to mark "${confirm.task.title}" as completed?`
            : ""
        }
      />
    </div>
  );
}
