import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/auth/AuthContext";
import { ThemeContext } from "../../context/theme/ThemeContext";
import "./topbar.css";

export default function Topbar({ setIsThemeDark }) {
  const {user, dispatch} = useContext(AuthContext);
  const PF = "http://localhost:8800/images/";
  const { isDark, Dispatch } = useContext(ThemeContext);

  const handleLogout = () => {
    dispatch({type:"LOGOUT"});
  }

  const handleTheme = async () => {
    try {
      await Dispatch({ type: "CHANGE_THEME", payload: isDark ? false : true });
      await setIsThemeDark(isDark ? false : true);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="top">
      <div className="topLeft">
        <a href="https://twitter.com/eneskay_"><i className="topIcon fab fa-twitter-square"></i></a>
        <a href="https://tr.pinterest.com/ensk05/"><i className="topIcon fab fa-pinterest-square"></i></a>
        <a href="https://www.instagram.com/ensk05/"><i className="topIcon fab fa-instagram-square"></i></a>
      </div>
      <div className="topCenter">
        <ul className="topList">
          <li className="topListItem">
            <Link className="link" to="/">
              HOME
            </Link>
          </li>
          {/* <li className="topListItem">
            <Link className="link" to="/">
              ABOUT
            </Link>
          </li>
          <li className="topListItem">
            <Link className="link" to="/">
              CONTACT
            </Link>
          </li> */}
          <li className="topListItem">
            <Link className="link" to="/write">
              WRITE
            </Link>
          </li>
          <li className="topListItem" onClick={handleLogout}>{user && "LOGOUT"}</li>
        </ul>
      </div>
      <div className="topRight">
        {user ? (
          <Link to="/settings">
            <img
              className="topImg"
              src={user.profilePicture ? PF + user.profilePicture : PF + "noAvatar.png"}
              alt=""
            />
          </Link>
        ) : (
          <ul className="topList">
            <li className="topListItem">
              <Link className="link" to="/login">
                LOGIN
              </Link>
            </li>
            <li className="topListItem">
              <Link className="link" to="/register">
                REGISTER
              </Link>
            </li>
          </ul>
        )}
        <i className="topSearchIcon fas fa-search"></i>
        <div className="theme" onClick={handleTheme}>
          {isDark ? <i class="topSearchIcon fa-solid fa-sun"></i> : <i class="topSearchIcon fa-solid fa-moon"></i>}
        </div>
      </div>
    </div>
  );
}
