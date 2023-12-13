import React, { useEffect, useState } from 'react';
import { Delete, Search } from '@mui/icons-material';
import '../../assets/CSS/PaperStyles.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from '../BaseUrl/BaseUrl';

function List({ update, setUpdate }) {

  const [notes, setNotes] = useState([]);
  const [checkedIds, setCheckedIds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState({});
  const [editing, setEditing] = useState(false);
  const [editedNote, setEditedNote] = useState({ title: '', body: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage,setCurrentpage] = useState(1)

  const fetchNotes = async (page) => {
    try {
        const response = await axios.get(`${BASE_URL}/v1/notes/`);
      const formattedNotes = response.data.results.map((note) => ({
        id: note.id,
        title: note.title,
        body: note.body,
        date: note.date,
      }));

      setNotes(formattedNotes);

      return formattedNotes;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchNotes(currentPage);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [editing, isModalOpen,update]);

  const handleCheckboxChange = (id) => {
    if (checkedIds.includes(id)) {
      setCheckedIds(checkedIds.filter((checkedId) => checkedId !== id));
    } else {
      setCheckedIds([...checkedIds, id]);
    }
  };

  const handleNoteClick = (note) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditing(false);
    setEditedNote({ id: '', title: '', body: '' });
  };

  // Editing existing note
  const handleEditClick = async () => {
    setEditing(!editing);
    if (!editing) {
      // Save the current state of the note for editing
      setEditedNote({
        id: selectedNote.id,
        title: selectedNote.title,
        body: selectedNote.body,
      });
    } else {
      // Update the state with the editedNote values
      setSelectedNote({
        ...selectedNote,
        id: editedNote.id,
        title: editedNote.title,
        body: editedNote.body,
      });
      await saveEditedNote();
      setIsModalOpen(false);

      // Reset the editing and editedNote states
      setEditing(false);
      setEditedNote({ id: '', title: '', body: '' });
    }
  };

  const handleInputChange = (e) => {
    setEditedNote({
      ...editedNote,
      [e.target.name]: e.target.value,
    });
  };

  const saveEditedNote = async () => {
    try {
      await axios.put(`${BASE_URL}/v1/notes/${selectedNote.id}/`, editedNote);
      toast.success('Edited successfully');
      await fetchNotes();
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const deleteNote = async () => {
    try {
      const confirmed = await toast.promise(
        new Promise((resolve) => {
          toast.info(
            <div>
              <p>Are you sure you want to delete this note?</p>
              <button
                className='mt-4 bg-red-500 text-white p-2 rounded'
                onClick={() => {
                  resolve(true);
                  toast.dismiss(); // Close the toast immediately
                }}
              >
                Yes
              </button>
              <button
                className='mt-4 ml-2 bg-green-500 text-white p-2 rounded'
                onClick={() => {
                  resolve(false);
                  toast.dismiss(); // Close the toast immediately
                }}
              >
                No
              </button>
            </div>,
            {
              closeOnClick: false,
              closeOnEscape: false,
              autoClose: false, // Do not close automatically
            }
          );
        }),
        {
          success: 'Confirmed!',
          error: 'Cancelled!',
        }
      );

      if (confirmed) {
        await axios.delete(`${BASE_URL}/v1/notes/${selectedNote.id}/`);
        toast.success('Deleted successfully');
        await fetchNotes();
        closeModal();
      }
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };


  const handleDeleteIconClick = async () => {
    try {
      // Check if there are selected entries to delete
      if (checkedIds.length === 0) {
        toast.warning('Select entries to delete.');
        return;
      }
      const confirmed = await toast.promise(
        new Promise((resolve) => {
          toast.info(
            <div>
              <p>Are you sure you want to delete selected notes?</p>
              <button
                className='mt-4 bg-red-500 text-white p-2 rounded'
                onClick={() => {
                  resolve(true);
                  toast.dismiss(); // Close the toast immediately
                }}
              >
                Yes
              </button>
              <button
                className='mt-4 ml-2 bg-green-500 text-white p-2 rounded'
                onClick={() => {
                  resolve(false);
                  toast.dismiss(); // Close the toast immediately
                }}
              >
                No
              </button>
            </div>,
            {
              closeOnClick: false,
              closeOnEscape: false,
              autoClose: false, // Do not close automatically
            }
          );
        }),
        {
          success: 'Confirmed!',
          error: 'Cancelled!',
        }
      );
  
      if (confirmed) {
        await axios.delete(`${BASE_URL}/v1/notes/delete-multiple/`, {
          data: { ids: checkedIds },
        });
  
        toast.success('Selected notes deleted successfully');
        await fetchNotes();
        closeModal();
        setCheckedIds([])
      }
    } catch (error) {
        toast.error('something went wrong');
      console.error('Error deleting data:', error);
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const handleSearchIconClick = async () => {
    if (searchQuery.trim() === '') {
      toast.warning('Enter a search query.');
      return;
    }
    try {
      const response = await axios.get(`${BASE_URL}/v1/search-notes/`, {
        params: { query: searchQuery },
      });
  
      const searchResults = response.data.results.map((note) => ({
        id: note.id,
        title: note.title,
        body: note.body,
        date: note.date,
      }));
  
      setNotes(searchResults);
    } catch (error) {
      toast.error('Error searching notes.');
      console.error('Error searching notes:', error);
    }
  };
  

  console.log("check id",checkedIds)

  return (
    <div className=' bg-slate-50 '>
      <div className='bg-sky-900 text-white flex'>
        <div className='p-4 w-1/3'>
          <h1 className='font-semibold text-xl'>Notes</h1>
        </div>
        <div className='p-4 w-1/3 hidden md:block'></div>
        <div className='w-1/3 flex justify-items-end'>
          <div className='mt-3'>
            <input
              type='text'
              className='border rounded-3xl p-1 text-center text-slate-500'
              placeholder='Search'
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
          </div>
          <div className='mt-3 cursor-pointer'>
            <Search fontSize='large' onClick={handleSearchIconClick} />
          </div>
          <div className='mt-3 ml-4 md:ml-3 cursor-pointer'>
            <Delete fontSize='large' onClick={handleDeleteIconClick} />
          </div>
        </div>
      </div>
      <div style={{ height: '550px' }} className='  w-full  overflow-y-auto'>
      <div className='p-4 '>
        {notes.map((note) => (
          <div
            key={note.id}
            className='border p-2 mt-0.5 rounded-lg shadow-2xl overflow-hidden bg-sky-900 text-white transition duration-300 hover:bg-orange-200 hover:text-black'
          >
            <div className='flex'>
              <div className='mt-3'>
                <input
                  type='checkbox'
                  className='mr-2'
                  checked={checkedIds.includes(note.id)}
                  onChange={() => handleCheckboxChange(note.id)}
                />
              </div>
              <div
                onClick={() => handleNoteClick(note)}
                className='cursor-pointer w-full'
              >
                <h2 className='font-semibold text-lg'>{note.title}</h2>
                <p>
                    {note.body.slice(0, 200)}
                    {note.body.length > 200 && '...'}
                  </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white p-8 rounded-lg h-96 md:w-1/3'>
            {editing ? (
              <>
                <input
                  type='text'
                  name='title'
                  className='w-full mb-4 p-2 border rounded'
                  value={editedNote.title}
                  onChange={handleInputChange}
                />
                <textarea
                  name='body'
                  className='w-full h-52 p-2 border rounded'
                  value={editedNote.body}
                  onChange={handleInputChange}
                />
              </>
            ) : (
              <>
                <h2 className='text-xl bg-sky-900 text-white p-2 w-full font-semibold mb-4'>
                  {selectedNote.title}
                </h2>
                <textarea
                  name='body'
                  className='w-full h-52 p-2 border rounded'
                  value={selectedNote.body}
                />
              </>
            )}
            <div className='flex justify-between'>
              <button
                className='mt-4 bg-orange-500 text-white p-2 rounded'
                onClick={closeModal}
              >
                Close
              </button>

              <div className='flex '>
                <button
                  onClick={deleteNote}
                  className='mt-4 bg-red-500 text-white p-2 rounded mr-2'
                >
                  Delete
                </button>

                <button
                  className='mt-4 bg-blue-500 text-white p-2 rounded'
                  onClick={handleEditClick}
                >
                  {editing ? 'Save' : 'Edit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
</div>
<div className='flex justify-center mt-4'>
        
      </div>
    </div>
  );
}

export default List;
