import { useEffect, useState } from "react";
import {
  getAdminUsers,
  deleteAdminUser,
} from "../api/adminApi";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      const data = await getAdminUsers(token);

      setUsers(data.users || []);
    } catch (error) {
      console.error(
        "Failed to fetch users:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId, userName) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${userName}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await deleteAdminUser(userId, token);

      setUsers((currentUsers) =>
        currentUsers.filter(
          (user) => user._id !== userId
        )
      );

      alert("User deleted successfully.");
    } catch (error) {
      console.error(
        "Failed to delete user:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete user."
      );
    }
  };

  if (loading) {
    return (
      <main>
        <h2>Loading users...</h2>
      </main>
    );
  }

  return (
    <main>
      <h1>Manage Users</h1>

      <p>
        Total Users: {users.length}
      </p>

      <div>
        {users.map((user) => (
          <div key={user._id}>
            <h3>{user.name}</h3>

            <p>{user.email}</p>

            <p>
              Role:{" "}
              <strong>{user.role}</strong>
            </p>

            <p>
              Joined:{" "}
              {new Date(
                user.createdAt
              ).toLocaleDateString()}
            </p>

            {user.role === "admin" ? (
              <button disabled>
                Current Admin
              </button>
            ) : (
              <button
                onClick={() =>
                  handleDelete(
                    user._id,
                    user.name
                  )
                }
              >
                Delete User
              </button>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}

export default AdminUsers;