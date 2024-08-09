import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import FlashcardForm from './Components/FlashcardForm';
import MyFlashcards from './Components/MyFlashcards';
import ViewCard from './Components/ViewCard';
import AllFlashcards from './Components/AllFlashcards';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="bg-white p-4 shadow-md">
          <h1 className="text-3xl font-bold text-center">Flashcard Generator</h1>
        </header>
        <nav className="flex justify-center mt-4 space-x-4">
          <Link to="/" className="text-red-500 hover:underline">Create New</Link>
          <Link to="/my-flashcards" className="text-red-500 hover:underline">My Flashcards</Link>
        </nav>
        <main className="p-4">
          <Routes>
            <Route exact path="/" element={<FlashcardForm />} />
            <Route path="/my-flashcards" element={<MyFlashcards />} />
            <Route path="/view-card/:index" element={<ViewCard />} />
            <Route path="/all-flashcards" component={<AllFlashcards />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
