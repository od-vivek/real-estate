import React from 'react';
import { GoogleAuthProvider } from 'firebase/auth'; // Import GoogleAuthProvider separately
import { getAuth, signInWithPopup } from 'firebase/auth'; // Import getAuth and signInWithPopup separately
import { app } from '../firebase';
import { signInSuccess } from '../redux/user/UserSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
    const dispatch = useDispatch();
    const navigate  = useNavigate();

    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider(); // Create a GoogleAuthProvider instance
            const auth = getAuth(app); // Initialize authentication with the Firebase app

            const result = await signInWithPopup(auth, provider); // Sign in with Google using the authentication instance and the GoogleAuthProvider
            // console.log(result);
            const res = await fetch('https://urban-utopia.onrender.com/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: result.user.displayName, email: result.user.email, photo: result.user.photoURL
                })
            })

            const data = await res.json();
            dispatch(signInSuccess(data));
            navigate('/');
        } catch (error) {
            console.log('Could not sign in with Google.', error);
        }
    }
    return (
        <button onClick={handleGoogleClick} type='button' className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>Continue with Google</button>
    )
}
