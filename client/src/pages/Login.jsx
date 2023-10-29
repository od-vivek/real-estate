import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInFailure, signInSuccess, signInStart } from '../redux/user/UserSlice';
import OAuth from '../components/OAuth';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const { loading, error } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeHandler = (event) => {
    setFormData({
      ...formData,
      [event.target.id]: event.target.value,
    });
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('https://urban-utopia.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      } else {
        dispatch(signInSuccess(data));
        // Navigate only on successful login
        navigate('/');
      }
    } catch (e) {
      dispatch(signInFailure(e.message));
    }
  };


  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Login</h1>
      <form onSubmit={submitHandler} className='flex flex-col gap-3'>
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
          disabled={loading}
          className='bg-slate-700 text-white p-3 rounded-lg hover:opacity-95 uppercase'
        >
          {loading ? 'Loading...' : 'Login'}
        </button>
        <OAuth></OAuth>
      </form>
      <div className='flex gap-2 mt-2.5'>
        <p>Don't have an account?</p>
        <Link to={'/signup'}>
          <span className='text-blue-600'>Sign Up</span>
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
