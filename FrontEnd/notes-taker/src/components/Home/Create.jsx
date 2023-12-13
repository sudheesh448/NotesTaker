import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { BASE_URL } from '../BaseUrl/BaseUrl';




function Create({ update, setUpdate }) {
    const [title, setTitle] = useState('');
    const [body, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
      console.log('Title:', title);
      console.log('Content:', body);
      e.preventDefault();
      if (!title.trim() || !body.trim()) {
        toast.error('Title and Content cannot be empty');
        return;
      }
  
      try {
        setLoading(true);
        const response = await axios.post(`${BASE_URL}/v1/notes/`, {
          title,
          body,
        });
        console.log('Response from server:', response.data);
        setTitle('');
        setContent('');
        toast.success('Form submitted successfully');
        setUpdate(response.data);
        
      } catch (error) {
        console.error('Error submitting form:', error);
        toast.error('Error submitting form. Please try again.');
      } finally {
        setLoading(false);
      }
    };

  return (
    <div>
        <div  className=''>
            <div className=' p-4 bg-emerald-900'>
            <h1 className='font-semibold text-white  text-xl'>Create New Notes</h1>
            </div>
        </div>
        <div style={{ backgroundColor: '#eae7dd' }} className='h-screen'>
            
            <div className='mb-4 p-4 rounded-2xl'>
                <label htmlFor='title' className='block text-sm font-medium text-gray-700'>
                Title
                </label>
                <input
                type='text'
                id='title'
                className='mt-1 p-2 border border-hidden rounded-md w-full  '
                placeholder='Enter the title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div className='mb-4 p-4'>
                <label htmlFor='body' className='block text-sm font-medium text-gray-700'>
                Content
                </label>
                <textarea
                id='body'
                className='mt-1 p-2 border rounded-md w-full h-48'
                placeholder='Enter the content'
                value={body}
                onChange={(e) => setContent(e.target.value)}
                />
            </div>
            <div onClick={handleSubmit} className='flex justify-end items-end p-3 '>
            <button
                
                className='bg-emerald-900 text-white p-2 rounded-md hover:bg-emerald-700 '
            >
                Submit
            </button>
            </div>
          
            
            
        </div>
        
    </div>
  )
}

export default Create