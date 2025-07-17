import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./styles.css";

const Signup = () => {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "http://localhost:3000/api/users";
      const { data: res } = await axios.post(url, data);
      setMsg(res.message);
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
      <h1>הירשם</h1>
      <form className="signup_form_container" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="שם פרטי"
          name="firstName"
          onChange={handleChange}
          value={data.firstName}
          required
          className='input'
        />
        <input
          type="text"
          placeholder="שם משפחה"
          name="lastName"
          onChange={handleChange}
          value={data.lastName}
          required
          className='input'
        />
        <input
          type="text"
          placeholder="אימייל"
          name="email"
          onChange={handleChange}
          value={data.email}
          required
          className='input'
        />
        <input
          type="text"
          placeholder="סיסמא"
          name="password"
          onChange={handleChange}
          value={data.password}
          required
          className='input'
        />
        {error && <div className='error_msg'>{error}</div>}
        {msg && <div className='success_msg'>{msg}</div>}
        <input type="submit" value="הירשם" />
      </form>
      <div className="login-tap">
        <h2>יש לי חשבון{" "} <Link to="/Login">התחבר</Link></h2>
      </div>
    </div>
  );
};

export default Signup;