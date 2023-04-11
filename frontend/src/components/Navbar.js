import { useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../images/logo.png";
// importing icons
import { FiLogOut, FiUsers } from "react-icons/fi";
import { RiExchangeDollarLine, RiLineChartLine, RiAdminLine } from "react-icons/ri";
import { HiOutlineKey } from "react-icons/hi";
import { BsArchive, BsCalculator } from "react-icons/bs";

const Navbar = () => {
  const [isMinimazed, setIsMinimazed] = useState(false);
  return (
    <>
      <div className="navbar">
        <div className="logo-container">
          <img src={logo} alt="logo" width={150} />
        </div>
        <h3>Main</h3>
        <ul>
          <li>
            <NavLink className="link" to={"/gross-board"}>
              <RiExchangeDollarLine />
              Load board
            </NavLink>
          </li>
          <li>
            <NavLink className="link" to={"/accounting"}>
              <BsCalculator />
              Accounting
            </NavLink>
          </li>
          <li>
            <NavLink className="link" to={"/driver-gross"}>
              <RiLineChartLine />
              Drivers' gross
            </NavLink>
          </li>
          <li>
            <NavLink className="link" to={"/dispatcher-gross"}>
              <RiLineChartLine />
              Dispatchers' gross
            </NavLink>
          </li>
          <li>
            <NavLink className="link" to={"/drivers"}>
              <FiUsers />
              Drivers
            </NavLink>
          </li>
          <li>
            <NavLink className="link" to={"/users"}>
              <FiUsers />
              Users
            </NavLink>
          </li>
          <li>
            <NavLink className="link" to={"/trailers"}>
              <FiUsers />
              Assets
            </NavLink>
          </li>
          <li>
            <NavLink className="link" to={"/carriers"}>
              <FiUsers />
              Carriers
            </NavLink>
          </li>
          <li>
            <NavLink className="link" to={"/actions"}>
              <BsArchive />
              Actions
            </NavLink>
          </li>
        </ul>
        <h3>Actions</h3>
        <ul>
          <li>
            <NavLink className="link" to={"/reset-password"}>
              <HiOutlineKey />
              Reset password
            </NavLink>
          </li>
          <li>
            <NavLink
              className="link"
              to={"/login"}
              onClick={() => {
                localStorage.setItem("authentication", JSON.stringify({}));
              }}
            >
              <FiLogOut />
              Log out
            </NavLink>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;
