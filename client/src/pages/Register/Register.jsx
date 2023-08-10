import React, { useState } from 'react';
import axios from 'axios';
import ResponsStatus from '../../components/ResponseStatus/ResponsStatus';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faUser } from '@fortawesome/free-regular-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import './register.css';

const Register = () => {
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    country: '',
    img: '',
    city: '',
    phone: '',
    password: '',
  });
  console.log('register', formData);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({ ...prevData, img: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/auth/register', formData);
      console.log(response);
      console.log('Registration successful!');
      navigate('/login');
    } catch (err) {
      setError(err.response.data);
    }
  };

  return (
    <div className="register">
      <div className="lContainer">
        <h2>Register</h2>
        <input
          type="text"
          name="username"
          placeholder="Username*"
          value={formData.username}
          onChange={handleChange}
          className="lInput"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email*"
          value={formData.email}
          onChange={handleChange}
          className="lInput"
          required
        />
        <input
          type="text"
          name="country"
          placeholder="Country*"
          value={formData.country}
          onChange={handleChange}
          className="lInput"
          required
        />
        <input
          type="text"
          name="city"
          placeholder="City*"
          value={formData.city}
          onChange={handleChange}
          className="lInput"
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone*"
          value={formData.phone}
          onChange={handleChange}
          className="lInput"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password*"
          value={formData.password}
          onChange={handleChange}
          className="lInput"
          required
        />
        <div className="image-preview-input">
          <div className="image-preview-container">
            {formData.img ? (
              <img
                className="image-preview"
                src={formData.img}
                alt="Selected Preview"
              />
            ) : (
              <FontAwesomeIcon icon={faUser} />
            )}
          </div>
          <input
            type="file"
            accept=".jpg,.png"
            onChange={handleImageChange}
            className="lInput"
          />
        </div>
        <button onClick={handleSubmit} className="lButton">
          Register
        </button>
      </div>
      {error && <ResponsStatus message={error.message} type="error" />}
      <p>
        Already registered? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;
