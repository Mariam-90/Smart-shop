import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; // שימוש ב-useNavigate
import "./styles.css";

const Login = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate(); // יצירת אינסטנס של useNavigate

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const requestUserLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async function (position) {
        try {
          const url = "http://localhost:3000/api/auth/login"; // שינוי כתובת הנתיב ל-/api/auth/login
          await axios.post(url, {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            email: data.email
          }, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
          });
          console.log("Location saved successfully.");
        } catch (error) {
          console.error("Error saving location:", error);
        }
      });
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "http://localhost:3000/api/auth";
      const { data: res } = await axios.post(url, data);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("id", res.data._id);
      localStorage.setItem("isAdmin", res.data.isAdmin);
      localStorage.setItem("email", data.email);

      requestUserLocation(); // Call location request after successful login

      navigate("/"); // שימוש ב-navigate במקום window.location
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
    }
  };

  return (
    <div className="login-form">
      <h1>התחבר</h1>
      <form className='login_form_container' onSubmit={handleSubmit}>
        <input type="text" placeholder="אימייל" name="email" onChange={handleChange} value={data.email} required className='input' data-testid="email" />
        <input type="password" placeholder="סיסמא" name="password" onChange={handleChange} value={data.password} required className='input' />
        {error && <div className='error_msg'>{error}</div>}
        <input type="submit" value="התחבר" />
      </form>
      <div className="login-tap">
        <h2 className="forgot-password text-right"> שכחת <a href="/forgot-password">סיסמא?</a> </h2>
        <h2>אין לך חשבון? <Link to="/signup">הירשם</Link></h2>
      </div>
    </div>
  );
};

export default Login;
