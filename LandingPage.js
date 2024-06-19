import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import './styles.css';

function LandingPage() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loginError, setLoginError] = useState(null);
  const [registerError, setRegisterError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState(null);

  const handleApiRequest = async (url, data, onError) => {
    setLoading(true);
    onError(null);
    try {
      const response = await axios.post(url, data);
      console.log(response.data);
    } catch (error) {
      onError(error.response?.data?.error || 'Request failed');
    }
    setLoading(false);
  };

  const handleLogin = (data) => handleApiRequest('/api/login', data, setLoginError);

  const handleRegister = (data) => handleApiRequest('/api/register', data, setRegisterError);

  const handleForgotPassword = async (data) => {
    setForgotPasswordMessage(null);
    setLoading(true);
    try {
      const response = await axios.post('/api/forgot-password', data);
      setForgotPasswordMessage('A reset link has been sent to your email.');
      reset();
    } catch (error) {
      setForgotPasswordMessage('Failed to send reset link.');
    }
    setLoading(false);
    setShowForgotPassword(false);
  };

  const renderFormInput = (labelText, inputType, inputName, validationRules) => (
    <label>
      {labelText}:
      <input
        type={inputType}
        {...register(inputName, validationRules)}
      />
      {errors[inputName] && <p className="error">{errors[inputName].message}</p>}
    </label>
  );

  const renderModal = (title, onSubmit, onClose) => (
    <div className="modal">
      <div className="modal-content">
        <h2>{title}</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          {renderFormInput('Email', 'email', 'email', { required: 'This field is required' })}
          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? 'Loading...' : 'Submit'}
          </button>
          <button type="button" className="secondary-button" onClick={onClose}>Cancel</button>
        </form>
        {forgotPasswordMessage && <p className="success">{forgotPasswordMessage}</p>}
      </div>
    </div>
  );

  return (
    <div className="container">
      <div className="header">
        <h1>Welcome to the Voting Page!</h1>
        <p>Please login before voting</p>
      </div>
      <div className="login-container">
        <div className="form-container">
          <h2>Login</h2>
          <form onSubmit={handleSubmit(handleLogin)}>
            {renderFormInput('Username or Email', 'text', 'usernameOrEmail', { required: 'This field is required' })}
            {renderFormInput('Password', 'password', 'password', { required: 'This field is required' })}
            {loginError && <p className="error">{loginError}</p>}
            <button type="submit" className="primary-button" disabled={loading}>
              {loading ? 'Loading...' : 'Login'}
            </button>
            <p className="forgot-password">
              Forgot password? <a href="#" onClick={() => setShowForgotPassword(true)}>Click here</a>
            </p>
            <p className="register-link">
              Don't have an account? <a href="#" onClick={() => setShowRegister(true)}>Register here</a>
            </p>
          </form>
        </div>
      </div>

      {showForgotPassword && renderModal('Forgot Password', handleForgotPassword, () => setShowForgotPassword(false))}

      {showRegister && renderModal('Register', handleRegister, () => setShowRegister(false))}
    </div>
  );
}

export default LandingPage;