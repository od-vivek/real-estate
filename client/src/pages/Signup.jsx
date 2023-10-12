import React from 'react'
import {Link} from 'react-router-dom';

export default function Signup() {
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form className='flex flex-col gap-3'>
        <input type='text' placeholder='username' className='border p-3 rounded-lg' id='username'></input>
        <input type='text' placeholder='email' className='border p-3 rounded-lg' id='email'></input>
        <input type='text' placeholder='password' className='border p-3 rounded-lg' id='password'></input>
        <button className='bg-slate-700 text-white p-3 rounded-lg hover:opacity-95'>Sign Up</button>
      </form>
      <div className='flex gap-2 mt-2.5'>
        <p> Have an account ?</p>
        <Link to ={'/login'}>
          <span className='text-blue-600'> Login </span>
        </Link>
      </div>
    </div>
  ) 
}
