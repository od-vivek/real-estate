import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Header() {
    const navigate = useNavigate();

    const { currentUser } = useSelector(state => state.user);
    const [searchTerm, setSearchTerm] = useState('');

    const submitHandler = (event) => {
        event.preventDefault();

        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('searchTerm', searchTerm);

        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');

        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl);
        }
    }, [location.search]);

    return (
        <header className='bg-light-blue shadow-md'>
            <div className='flex justify-between items-center max-w-6xl mx-auto p-3.5'>
                <Link to='/'>
                    <h1 className='font-bold text-sm sm:text-xl flex flex-wrap text-dark-gray'>
                        <span className='text-slate-500'>Urban</span>
                        <span className='text-slate-700'>Utopia</span>
                    </h1>
                </Link>
                <form onSubmit={submitHandler} className='bg-dark-gray p-2.5 rounded-lg flex items-center'>
                    <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        type='text'
                        placeholder='Search...'
                        className='bg-transparent border-slate-500 focus:outline-none w-24 sm:w-64'
                    />
                    <button>
                        <FaSearch className='text-slate-600' />
                    </button>
                </form>
                <ul className='flex gap-5'>
                    <Link to='/'>
                        <li className='hidden sm:inline text-dark-gray hover:underline'>Home</li>
                    </Link>
                    <Link to='/about'>
                        <li className='hidden sm:inline text-dark-gray hover:underline'>About</li>
                    </Link>
                    <Link to='/profile'>
                        {currentUser ? (
                            <img className='rounded-full h-7 w-7 object-cover' src={currentUser.avatar} alt='profile' />
                        ) : (
                            <li className='text-dark-gray hover:underline'>Login</li>
                        )}
                    </Link>
                </ul>
            </div>
        </header>
    );
}
