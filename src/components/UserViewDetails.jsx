import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUserById } from "../api/adminUserApi.js";
import { getUserLoginHistory } from "../api/loginHistoryApi.js";

function UserViewDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [latestLogin, setLatestLogin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserById(id);
        if (response.success) setUser(response.user);

        const historyResponse = await getUserLoginHistory(id);
        if (historyResponse.success && historyResponse.history?.length) {
          setLatestLogin(historyResponse.history[0]);
        }
      } catch (error) {
        console.error("USER DETAILS ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) return <h2>Loading...</h2>;
  if (!user) return <h2>User Not Found</h2>;

  return (
    <div className="user-details">
      <button onClick={() => navigate("/users")}>← Back</button>

      <div className="details-card">
        {user.profileImage ? (
          <img src={user.profileImage} alt={user.name} />
        ) : (
          <div className="big-avatar">{user.name?.charAt(0)?.toUpperCase()}</div>
        )}

        <h1>{user.name}</h1>
        <p><b>Email:</b> {user.email}</p>
        <p><b>Type:</b> {user.role}</p>
        <p><b>Phone:</b> {user.phone || "N/A"}</p>
        <p><b>Bio:</b> {user.bio || "No bio"}</p>
        <p><b>Joined:</b> {user.createdAt ? new Date(user.createdAt).toLocaleString() : "N/A"}</p>
        <p><b>Last Login:</b> {latestLogin?.loginTime ? new Date(latestLogin.loginTime).toLocaleString() : "Never"}</p>
        <p><b>Status:</b> {latestLogin?.status || "N/A"}</p>
      </div>
    </div>
  );
}

export default UserViewDetails;