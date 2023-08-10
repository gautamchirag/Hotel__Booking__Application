import React, { useContext, useState } from "react";
import "./navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "../Sidebar/Sidebar";

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showSideBar, setShowSideBar] = useState(false);


  const handleSidebarclick = () => {
    setShowSideBar(!showSideBar);
  };

  return (
    <div className="navbar">
      <div className="navContainer">
        <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
          <span className="logo">lamabooking</span>
        </Link>
        {user && user ? (
          <div onClick={handleSidebarclick} className="avatar">
            {user.username}
          </div>
        ) : (
          <div className="navItems">
            <button className="navButton" onClick={() => navigate("/register")}>
              Register
            </button>
            <button className="navButton" onClick={() => navigate("/login")}>
              Login
            </button>
          </div>
        )}
      </div>
      {showSideBar && <Sidebar setShowSideBar={setShowSideBar} />}
    </div>
  );
};

export default Navbar;
