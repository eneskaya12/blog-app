import "./settings.css"
import Sidebar from "../../components/sidebar/Sidebar"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../context/auth/AuthContext"
import axios from "axios";

export default function Settings() {

  const [file, setFile] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [desc, setDesc] = useState("");
  const [success, setSuccess] = useState(false);

  const { user, dispatch } = useContext(AuthContext);
  const PF = "http://localhost:8800/images/";

  useEffect(() => {
    const getPost = async () => {
      const res = await axios.get("/users/" + user._id);
      setUsername(res.data.username);
      setEmail(res.data.email);
      setPassword(res.data.password);
      setDesc(res.data.desc);
    };
    getPost();
  }, [user._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({type:"UPDATE_START"});
    const updatedUser = {
      userId: user._id,
      username,
      email,
      password,
      desc
    };

    if(file){
      const data = new FormData();
      const filename = Date.now() + file.name;

      data.append("name", filename);
      data.append("file", file);
      updatedUser.profilePicture = filename;

      try {
        await axios.post("/upload", data);
      } catch (err) {
        console.log(err);
      }
    }
    
    try {
      const res = await axios.put("/users/" + user._id, updatedUser);
      setSuccess(true);
      dispatch({type:"UPDATE_SUCCESS", payload:res.data});
    } catch (err) {
      dispatch({type:"UPDATE_FAILURE"});
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete("/users/" + user._id, {
        data: {userId: user._id}
      });
      dispatch({type:"LOGOUT"});
      window.location.replace("/");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="settings">
      <div className="settingsWrapper">
        <div className="settingsTitle">
          <span className="settingsUpdateTitle">Update Your Account</span>
          <span className="settingsDeleteTitle" onClick={handleDelete}>Delete Account</span>
        </div>
        <form className="settingsForm" onSubmit={handleSubmit}>
          <label>Profile Picture</label>
          <div className="settingsPP">
            <img src={file ? URL.createObjectURL(file) : user.profilePicture ? PF + user.profilePicture : PF + "noAvatar.png"} alt=""/>
            <label htmlFor="fileInput">
              <i className="settingsPPIcon far fa-user-circle"></i>
            </label>
            <input type="file" id="fileInput" style={{display:"none"}} onChange={(e) => setFile(e.target.files[0])}/>
          </div>
          <label>Username</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
          <label>Password</label>
          <input type="password" onChange={(e) => setPassword(e.target.value)}/>
          <label>Description</label>
          <input type="text" value={desc} onChange={(e) => setDesc(e.target.value)}/>
          <button className="settingsSubmit" type="submit">Update</button>
          {
            success && <span style={{color:"green", textAlign:"center", marginTop:"20px"}}>Profile has been updated...</span>
          }          
        </form>
      </div>
      <Sidebar />
    </div>
  )
}
