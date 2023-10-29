import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getDownloadURL, getStorage, list, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import {
  resetError,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  signoutUserStart,
  signoutUserFailure,
  signoutUserSuccess
} from '../redux/user/UserSlice';

export default function Profile() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(resetError());
  }, []);

  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector(state => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [formData, setFormData] = useState({});
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [showListings, setShowListings] = useState(false);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`https://urban-utopia.onrender.com/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);

      setTimeout(() => {
        setUpdateSuccess(false);
        setSuccessMessage('');
      }, 1000);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const deleteHandler = async (event) => {
    event.preventDefault();
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`https://urban-utopia.onrender.com/api/user/delete/${currentUser._id}`, {
        method: 'DELETE'
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess(data));

    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  };

  const signoutHandler = async (event) => {
    try {
      dispatch(signoutUserStart());

      const res = await fetch('https://urban-utopia.onrender.com/api/auth/signout');
      const data = await res.json();

      if (data.success === false) {
        dispatch(signoutUserFailure(data.message));
        return;
      }
      dispatch(signoutUserSuccess());

    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  };

  const handleShowListings = async (event) => {
    event.preventDefault();
    setShowListings(true);
    try {
      setShowListingsError(false);
      const res = await fetch(`https://urban-utopia.onrender.com/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleHideListings = () => {
    setShowListings(false);
  };

  const deleteListingHandler = async (listingId) => {
    try {
      const res = await fetch(`https://urban-utopia.onrender.com/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));
    } catch (error) {
      console.log(error.message);
    }
  }


  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={submitHandler} className='flex flex-col gap-4'>
        <input type='file' ref={fileRef} hidden onChange={(e) => setFile(e.target.files[0])}></input>
        <img onClick={() => fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt="User Avatar" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' />
        <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>
              Image Upload Error (image must be less than 2 MB)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
          ) : (filePerc === 100 && !fileUploadError) ? (
            <span className='text-green-700'>Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>
        <input onChange={changeHandler} type='text' placeholder='username' className='border p-3 rounded-lg' id='username' defaultValue={currentUser.username}></input>
        <input onChange={changeHandler} type='email' placeholder='email' className='border p-3 rounded-lg' id='email' defaultValue={currentUser.email}></input>
        <input onChange={changeHandler} type='password' placeholder='password' className='border p-3 rounded-lg' id='password'></input>
        <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>{loading ? 'Loading..' : 'Update'}</button>
        <Link className='bg-green-700 text-white rounded-lg text-white p-3 rounded-lg uppercase text-center hover:opacity-95' to='/create-listing'>Create Listing</Link>
      </form>

      <div className='flex justify-between mt-5'>
        <button onClick={deleteHandler} className='text-red-700 cursor-pointer'>Delete your account</button>
        <button onClick={signoutHandler} className='text-red-700 cursor-pointer'>Sign Out</button>
      </div>

      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-700 mt-5'>{updateSuccess ? 'User updated successfully!' : ''}</p>

      {showListings ? (
        <div>
          <button onClick={handleHideListings} className='text-green-700 centered w-full'>
            Hide My Listings
          </button>
          {userListings && userListings.length > 0 && (
            <div className='flex flex-col mt-4'>
              {userListings.map((listing) => (
                <div className='border rounded-lg p-3 flex justify-between items-center gap-8' key={listing._id}>
                  <Link to={`/listing/${listing._id}`}>
                    <img className='h-16 w-16 object-contain rounded-lg' src={listing.imageUrls[0]} alt='listing-image' />
                  </Link>
                  <Link className='text-slate-700 font-semibold flex-1 mt-4 hover:underline truncate' to={`/listing/${listing._id}`}>
                    <p>{listing.name}</p>
                  </Link>
                  <div className='flex flex-col items-center mt-2'>
                    <Link to={`/update-listing/${listing._id}`}>
                      <button className='text-green-700'>Edit</button>
                    </Link>
                    <button onClick={() => deleteListingHandler(listing._id)} className='text-red-700'>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <button onClick={handleShowListings} className='text-green-700 centered w-full'>
          Show My Listings
        </button>
      )}
      <p className='text-red-700 mt-5'>{showListingsError ? 'Error showing listings' : ''}</p>
    </div>
  );
}
