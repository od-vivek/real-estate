import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';

export default function Signup() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const changeHandler = (event) => {
    setFormData({
      ...formData,
      [event.target.id]: event.target.value,
    });
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      const res = await fetch('https://urban-utopia.onrender.com/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        setError(null);
        // Redirect to the login page after successful signup
        navigate('/login');
      }
    } catch (e) {
      setIsLoading(false);
      setError('An error occurred.');
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form onSubmit={submitHandler} className='flex flex-col gap-3'>
        <input
          type='text'
          placeholder='username'
          className='border p-3 rounded-lg'
          id='username'
          onChange={changeHandler}
        ></input>
        <input
          type='text'
          placeholder='email'
          className='border p-3 rounded-lg'
          id='email'
          onChange={changeHandler}
        ></input>
        <input
          type='password'
          placeholder='password'
          className='border p-3 rounded-lg'
          id='password'
          onChange={changeHandler}
        ></input>
        <button
          disabled={isLoading}
          className='bg-slate-700 text-white p-3 rounded-lg hover:opacity-95 uppercase'
        >
          {isLoading ? 'Loading...' : 'Sign Up'}
        </button>
        <OAuth></OAuth>
      </form>
      <div className='flex gap-2 mt-2.5'>
        <p>Have an account?</p>
        <Link to={'/login'}>
          <span className='text-blue-600'>Login</span>
        </Link>
      </div>
      {error && (
        <p className='text-red-500 mt-5'>
          Error: {error}
        </p>
      )}
    </div>
  );
}
