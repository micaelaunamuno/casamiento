import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Information from './components/Information';
import RSVP from './components/RSVP';
import Quiz from './components/Quiz';
import WishWall from './components/WishWall';
import Footer from './components/Footer';
import Admin from './components/Admin';

function App() {
  const path = window.location.pathname;

  if (path === '/admin') {
    return <Admin />;
  }

  return (
    <div className="App">
      <Navbar />
      <Hero />
      <Information />
      <RSVP />
      <Quiz />
      <WishWall />
      <Footer />
    </div>
  );
}

export default App;
