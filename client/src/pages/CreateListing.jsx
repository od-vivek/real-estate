import { useState } from "react";
import { getDownloadURL, getStorage, uploadBytesResumable, ref } from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CreateListing() {
    const navigate = useNavigate();

    const { currentUser } = useSelector(state => state.user)

    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        imageUrls: [],
        name: '',
        description: '',
        address: '',
        type: 'rent',
        bedrooms: '1',
        bathrooms: '1',
        regularPrice: 50,
        discountPrice: 50,
        offer: false,
        parking: false,
        furnished: false,
    });
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    console.log(formData);

    const imageSubmitHandler = (event) => {
        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            setUploading(true);
            setImageUploadError(false);
            const promises = [];

            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]));
            }

            Promise.all(promises)
                .then((urls) => {
                    setFormData({ ...formData, imageUrls: formData.imageUrls.concat(urls) });
                    setImageUploadError(false);
                    setUploading(false);
                })
                .catch((error) => {
                    setImageUploadError('Image Upload failed! 5MB max per image');
                    setUploading(false);
                });
        } else if (files.length <= 0) {
            setImageUploadError('Please choose at least 1 image');
            setUploading(false);
        } else {
            setImageUploadError('You can only upload 6 images per listing!');
            setUploading(false);
        }
    };

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);

            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref)
                        .then(downloadUrl => {
                            resolve(downloadUrl);
                        })
                        .catch((error) => {
                            reject(error);
                        });
                });
        });
    };

    const removeImageHandler = (index) => {
        const updatedImageUrls = formData.imageUrls.filter((_, i) => i !== index);

        setFormData({
            ...formData,
            imageUrls: updatedImageUrls,
        });

        // Update the number of files in the state
        setFiles(updatedImageUrls.length > 0 ? [new File([], "")] : []);
    };

    const handleChange = (e) => {
        const id = e.target.id;
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

        setFormData({
            ...formData,
            [id]: value,
        });
    };

    const submitHandler = async (event) => {
        event.preventDefault();
        try {
            if (formData.imageUrls.length < 1) return setError('You must upload at least 1 image of the listing!');
            if (+formData.regularPrice < +formData.discountPrice) return setError('Discounted price must be less than the regular price!');
            setLoading(true); // Set loading state to true
            setError(false);

            const res = await fetch('https://urban-utopia.onrender.com/api/listing/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id
                })
            })

            const data = await res.json();

            // Handle the response and errors
            setLoading(false);

            if (data.success === false) {
                setError(data.message);
            } else {
                // If the listing is created successfully, you can navigate to another page
                navigate(`/listing/${data._id}`);
            }
        } catch (error) {
            setError(error.message);
            setLoading(false); // Make sure to set loading state to false in case of an error
        }
    }

    return (
        <main className='p-3 max-w-4xl mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>
                Create a Listing
            </h1>
            <form onSubmit={submitHandler} className='flex flex-col sm:flex-row gap-4'>
                <div className='flex flex-col gap-4 flex-1'>
                    <input
                        onChange={handleChange}
                        value={formData.name}
                        type='text'
                        placeholder='Name'
                        className='border p-3 rounded-lg'
                        id='name'
                        maxLength='62'
                        minLength='10'
                        required
                    />
                    <textarea
                        onChange={handleChange}
                        value={formData.description}
                        placeholder='Description'
                        className='border p-3 rounded-lg'
                        id='description'
                        required
                    />
                    <input
                        onChange={handleChange}
                        value={formData.address}
                        type='text'
                        placeholder='Address'
                        className='border p-3 rounded-lg'
                        id='address'
                        required
                    />
                    <div className='flex gap-6 flex-wrap'>
                        <div className='flex gap-2'>
                            <input
                                onChange={handleChange}
                                checked={formData.type === 'sale'}
                                type='radio'
                                id='type'
                                value='sale'
                                className='w-5'
                            />
                            <span>Sell</span>
                        </div>
                        <div className='flex gap-2'>
                            <input
                                onChange={handleChange}
                                checked={formData.type === 'rent'}
                                type='radio'
                                id='type'
                                value='rent'
                                className='w-5'
                            />
                            <span>Rent</span>
                        </div>
                        <div className='flex gap-2'>
                            <input
                                onChange={handleChange}
                                checked={formData.parking}
                                type='checkbox'
                                id='parking'
                                className='w-5'
                            />
                            <span>Parking spot</span>
                        </div>
                        <div className='flex gap-2'>
                            <input
                                onChange={handleChange}
                                checked={formData.furnished}
                                type='checkbox'
                                id='furnished'
                                className='w-5'
                            />
                            <span>Furnished</span>
                        </div>
                        <div className='flex gap-2'>
                            <input
                                onChange={handleChange}
                                checked={formData.offer}
                                type='checkbox'
                                id='offer'
                                className='w-5'
                            />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className='flex flex-wrap gap-6'>
                        <div className='flex items-center gap-2'>
                            <input
                                onChange={handleChange}
                                value={formData.bedrooms}
                                type='number'
                                id='bedrooms'
                                min='1'
                                max='10'
                                required
                                className='p-3 border border-gray-300 rounded-lg'
                            />
                            <p>Beds</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input
                                onChange={handleChange}
                                value={formData.bathrooms}
                                type='number'
                                id='bathrooms'
                                min='1'
                                max='10'
                                required
                                className='p-3 border border-gray-300 rounded-lg'
                            />
                            <p>Baths</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input
                                onChange={handleChange}
                                value={formData.regularPrice}
                                type='number'
                                id='regularPrice'
                                min='50'
                                max='10000000'
                                required
                                className='p-3 border border-gray-300 rounded-lg'
                            />
                            <div className='flex flex-col items-center'>
                                <p>Regular price</p>
                                <span className='text-xs'>($ / month)</span>
                            </div>
                        </div>
                        {
                            formData.offer && (<div className='flex items-center gap-2'>
                                <input
                                    onChange={handleChange}
                                    value={formData.discountPrice}
                                    type='number'
                                    id='discountPrice'
                                    min='0'
                                    max='10000000'
                                    required
                                    className='p-3 border border-gray-300 rounded-lg'
                                />
                                <div className='flex flex-col items-center'>
                                    <p>Discounted price</p>
                                    <span className='text-xs'>($ / month)</span>
                                </div>
                            </div>)}
                    </div>
                </div>
                <div className='flex flex-col flex-1 gap-4'>
                    <p className='font-semibold'>
                        Images:
                        <span className='font-normal text-gray-600 ml-2'>
                            The first image will be the cover (max 6)
                        </span>
                    </p>
                    <div className='flex gap-4'>
                        <input
                            onChange={(e) => { setFiles(e.target.files) }}
                            className='p-3 border border-gray-300 rounded w-full'
                            type='file'
                            id='images'
                            accept='image/*'
                            multiple
                        />
                        <button onClick={imageSubmitHandler}
                            disabled={uploading}
                            type='button'
                            className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
                        >
                            {uploading ? 'Uploading...' : 'Upload'}
                        </button>
                    </div>
                    <p className="text-center text-red-700 text-sm">{imageUploadError && imageUploadError}</p>
                    {formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
                        <div className="flex justify-between p-3 border items-center" key={url}>
                            <img src={url} className="w-20 h-20 object-contain rounded-lg" alt="Uploaded Image" />
                            <button type="button" onClick={() => removeImageHandler(index)} className="p-3 text-red-700 rounded-lg hover:opacity-75"> Delete </button>
                        </div>
                    ))}
                    <button disabled={loading || uploading}
                        className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
                    >{loading ? 'Creating...' : 'Create Listing'}
                    </button>
                    {error && <p className="text-red-700 text-sm">{error}</p>}
                </div>
            </form>
        </main>
    );
}
