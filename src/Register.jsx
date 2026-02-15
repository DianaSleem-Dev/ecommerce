import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate registration
    toast.success('Account created! You can now log in.');
    navigate('/login');
  };

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="card border-0 shadow-lg rounded-4 p-5">
              <div className="text-center mb-5">
                <h1 className="brand-font fs-2 fw-bold text-indigo mb-2">LUMINA</h1>
                <h2 className="h5 text-muted fw-normal">Create your account</h2>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label fw-bold text-muted small mb-2">Full Name</label>
                  <input type="text" className="form-control form-control-lg border-light rounded-3" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div className="mb-4">
                  <label className="form-label fw-bold text-muted small mb-2">Email Address</label>
                  <input type="email" className="form-control form-control-lg border-light rounded-3" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="mb-4">
                  <label className="form-label fw-bold text-muted small mb-2">Password</label>
                  <input type="password" className="form-control form-control-lg border-light rounded-3" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-indigo btn-lg w-100 rounded-3 fw-bold">Create Account</button>
              </form>
              <div className="text-center mt-4">
                <p className="text-muted mb-0">Already have an account? <a href="#/login" className="text-indigo fw-bold text-decoration-none">Sign in</a></p>
              </div>
              <hr className="my-4" />
              <div className="bg-light p-3 rounded-3">
                <p className="small fw-bold text-muted mb-2">Demo Accounts (for testing):</p>
                <div className="small text-muted mb-2"><strong>Customer:</strong> testuser@example.com / test123</div>
                <div className="small text-muted"><strong>Admin:</strong> admin@example.com / admin123</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
