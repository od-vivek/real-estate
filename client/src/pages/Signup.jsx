import React, { useState } from 'react';
import { Link , useNavigate } from 'react-router-dom';


export default function Signup() {
  const [formData, setFormData] = useState({});
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
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        setError(data.message);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        setError(null); // Clear the error if the request was successful
        // Handle success, e.g., redirect to another page
        navigate('/login');
      }
    } catch (e) {
      setIsLoading(false);
      setError(e.message);
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
          type='text'
          placeholder='password'
          className='border p-3 rounded-lg'
          id='password'
          onChange={changeHandler}
        ></input>
        <button
          disabled={isLoading}
          className='bg-slate-700 text-white p-3 rounded-lg hover:opacity-95'
        >
          {isLoading ? 'Loading...' : 'SignUp'}
        </button>
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
