import React, { useContext } from "react";
import "./sidebar.css";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ setShowSideBar }) => {
    const { user, dispatch } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleClick = async () => {
        try {
            const res = await axios.post("/auth/logout");

            if (res.data.loggedOut) {
                localStorage.removeItem("user");
            }
            dispatch({ type: "LOGOUT" });
            navigate("/");
        } catch (err) {
            dispatch({ type: "LOGIN_FAILURE", payload: err.response.data });
        }
    };

    return (
        user && (
            <div className="sidebar">
                <div className="user-details">
                    <h3>Welcome, {user.username}!</h3>
                    <p>Email: {user.email}</p>
                    <p>Country: {user.country}</p>
                    {user.img && <img src={user.img} alt="Profile" />}
                    <p>City: {user.city}</p>
                    <p>Phone: {user.phone}</p>
                    {user.isAdmin && <p>You have admin privileges.</p>}
                </div>
                <div className="sidebar-actions">
                    <button onClick={handleClick}>Logout</button>
                    <button >Edit Details</button>
                    <button onClick={() => setShowSideBar(false)}>Close Sidebar</button>
                </div>
            </div>
        )
    );
};

export default Sidebar;
