import React from 'react';
import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { resetError, deleteUserFailure, deleteUserStart, deleteUserSuccess, updateUserFailure, updateUserStart, updateUserSuccess, signoutUserStart, signoutUserFailure, signoutUserSuccess } from '../redux/user/UserSlice';
import { useDispatch } from 'react-redux';

export default function Profile() {
  useEffect(() => {
    // Dispatch the resetError action when the component loads.
    dispatch(resetError());

    // Other code or side effects can go here.
    // For example, you can fetch initial data or perform other actions.
  }, []); // The empty dependency array means this effect runs only on mount.


  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector(state => state.user);

  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  //we must be able to update all the form data , not only the image.
  const [formData, setFormData] = useState({});

  const dispatch = useDispatch();

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
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
  }

  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }

  const deleteHandler = async (event) => {
    event.preventDefault();
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
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
  }

  const signoutHandler = async (event) => {
    try {
      dispatch(signoutUserStart());

      const res = await fetch('/api/auth/signout');
      const data = await res.json();

      if (data.sucess === false) {
        dispatch(signoutUserFailure(data.message));
        return;
      }

      dispatch(signoutUserSuccess());

    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={submitHandler} className='flex flex-col gap-4'>
        <input type='file' ref={fileRef} hidden onChange={(e) => setFile(e.target.files[0])}></input>
        <img onClick={() => fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt="User Avatar" className='rounded-full h-24 w-24 object-cover
        cursor-pointer self-center mt-2'/>
        <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>
              Image Upload Error (image must be less than 2 mb)
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
        <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity 80'>{loading ? 'Loading..' : 'Update'}</button>
      </form>

      <div className='flex justify-between mt-5'>
        <button onClick={deleteHandler} className='text-red-700 cursor:pointer'> Delete your account </button>
        <button onClick={signoutHandler} className='text-red-700 cursor:pointer'> Sign Out </button>
      </div>

      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-700 mt-5'> {updateSuccess ? 'User updated successfully!' : ''}</p>
    </div>
  );
}
