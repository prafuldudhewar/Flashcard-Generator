import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addFlashcard } from '../features/flashcards/flashcardsSlice';
import { FaUpload, FaTrash, FaEdit } from 'react-icons/fa';

const FlashcardForm = () => {
  const [group, setGroup] = useState('');
  const [description, setDescription] = useState('');
  const [terms, setTerms] = useState([{ term: '', definition: '', image: null }]);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [newGroupImage, setNewGroupImage] = useState(null);
  const dispatch = useDispatch();
  const flashcards = useSelector((state) => state.flashcards);
  const isExistingGroup = flashcards.some(flashcard => flashcard.group === group);


  const handleTermChange = (index, event) => {
    const newTerms = terms.map((term, termIndex) => {
      if (termIndex === index) {
        return { ...term, [event.target.name]: event.target.value };
      }
      return term;
    });
    setTerms(newTerms);
  };

  const handleTermImageChange = async (index, event) => {
    const file = event.target.files[0];
    if (file) {
      const base64Image = await toBase64(file);
      const newTerms = terms.map((term, termIndex) => {
        if (termIndex === index) {
          term.image = base64Image;
          return term;
        }
        return term;
      });
      setTerms(newTerms);
    }
  };

  const handleGroupImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const base64Image = await toBase64(file);
      setNewGroupImage(base64Image);
    }
  };

  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
    });
  };

  const addMoreTerms = () => {
    setTerms([...terms, { term: '', definition: '', image: null }]);
  };

  const deleteTerm = (index) => {
    const newTerms = terms.filter((_, termIndex) => termIndex !== index);
    setTerms(newTerms);
  };

  const validate = () => {
    const newErrors = {};
    if (!group) newErrors.group = 'Group is required';
    if (flashcards.every(flashcard => flashcard.group !== group) && !description) {
      newErrors.description = 'Description is required';
    }
    terms.forEach((term, index) => {
      if (!term.term) newErrors[`term-${index}`] = 'Term is required';
      if (!term.definition) newErrors[`definition-${index}`] = 'Definition is required';
    });
    return newErrors;
  };

  const handleSubmit = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const flashcard = {
      group,
      description,
      terms,
      image: newGroupImage,
    };

    dispatch(addFlashcard(flashcard));
    setErrors({});
    setSuccessMessage('Flashcard updated/created successfully!');

    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);

    setGroup('');
    setDescription('');
    setTerms([{ term: '', definition: '', image: null }]);
    setNewGroupImage(null);
  };

  
  

  const triggerFileUpload = (id) => {
    document.getElementById(id).click();
  };

  const handleGroupChange = (e) => {
    setGroup(e.target.value);
  };

  return (
    <div className="container mx-auto bg-white p-8 shadow-md rounded-lg mt-10 mb-10">
      <div className="mb-8 p-4 border-2 border-gray-300 rounded-lg">
        <div className="mb-4 flex flex-col sm:flex-row items-center">
          <div className="flex sm:w-1/3">
            <label className="flex text-gray-700">Group <span className="text-red-500">*</span></label>
            <div className="relative">
              <input
                type="text"
                value={group}
                onChange={handleGroupChange}
                list="group-options"
                placeholder="Select or enter new group"
                className="mt-1 block w-full rounded-md border-black-300 shadow-sm border-2 border-bold"
              />
              <datalist id="group-options">
                {flashcards.map((flashcard, index) => (
                  <option key={index} value={flashcard.group}>{flashcard.group}</option>
                ))}
              </datalist>
            </div>
            {errors.group && <p className="text-red-500">{errors.group}</p>}
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-4">
            <button
              type="button"
              onClick={() => triggerFileUpload('groupImage')}
              className="mt-1 py-2 px-4 bg-blue-500 text-white rounded-md flex items-center"
            >
              <FaUpload className="mr-2" /> Upload Image
            </button>
            <input
              type="file"
              id="groupImage"
              onChange={handleGroupImageChange}
              className="hidden"
              name="groupImage"
            />
            {newGroupImage && <img src={newGroupImage} alt="Group" className="mt-2 w-20 h-20 object-cover" />}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700">Description <span className="text-red-500">*</span></label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm h-32 border-2 border-bold"
            disabled={isExistingGroup}
          />
          {errors.description && <p className="text-red-500">{errors.description}</p>}
        </div>
      </div>

      <div className="mb-8 p-4 border-2 border-gray-300 rounded-lg">
        <div className="text-lg font-semibold text-gray-700 mb-4">Terms</div>
        {terms.map((term, index) => (
          <div key={index} className="mb-6 border-2 border-gray-300 rounded-lg p-4">
            <div className="flex flex-wrap items-center mb-2">
              <span className="mr-2 text-red-500">{index + 1}</span>
              <div className="w-full sm:w-1/3 mr-4 mb-4 sm:mb-0">
                <label className="block text-gray-700">Term <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="term"
                  value={term.term}
                  onChange={(e) => handleTermChange(index, e)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border-2 border-bold"
                  disabled={!group}
                />
                {errors[`term-${index}`] && <p className="text-red-500">{errors[`term-${index}`]}</p>}
              </div>
              <div className="w-full sm:w-1/3 mr-4 mb-4 sm:mb-0">
                <label className="block text-gray-700">Definition <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="definition"
                  value={term.definition}
                  onChange={(e) => handleTermChange(index, e)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border-2 border-bold"
                  disabled={!group}
                />
                {errors[`definition-${index}`] && <p className="text-red-500">{errors[`definition-${index}`]}</p>}
              </div>
              <div className="mt-4 sm:mt-0 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => triggerFileUpload(`termImage-${index}`)}
                  className="mt-1 py-2 px-4 bg-blue-500 text-white rounded-md flex items-center"
                  disabled={!group}
                >
                  <FaUpload className="mr-2" /> Select Image
                </button>
                <input
                  type="file"
                  id={`termImage-${index}`}
                  onChange={(e) => handleTermImageChange(index, e)}
                  className="hidden"
                  name="termImage"
                />
                {term.image && <img src={term.image} alt={`Term ${index + 1}`} className="mt-2 w-20 h-20 object-cover" />}
                <button
                  type="button"
                  onClick={() => deleteTerm(index)}
                  className="mt-1 py-2 px-4 bg-red-500 text-white rounded-md flex items-center"
                  disabled={terms.length <= 1 || !group}
                >
                  <FaTrash className="mr-2" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        <div className="mt-4">
          <button
            type="button"
            onClick={addMoreTerms}
            className="mt-1 py-2 px-4 bg-green-500 text-white rounded-md flex items-center"
            disabled={!group}
          >
            <FaEdit className="mr-2" /> Add More Terms
          </button>
        </div>
      </div>

      <div className="text-right">
        <button
          type="button"
          onClick={handleSubmit}
          className="mt-1 py-2 px-4 bg-indigo-500 text-white rounded-md"
        >
          Save
        </button>
      </div>
      {successMessage && <p className="text-green-500 text-center mt-4">{successMessage}</p>}
    </div>
  );
};

export default FlashcardForm;
