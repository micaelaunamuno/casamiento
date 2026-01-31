import React, { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="nav-container">
                <div className="nav-logo">M & Z</div>
                <ul className="nav-links">
                    <li><a href="#info">Información</a></li>
                    <li><a href="#rsvp">RSVP</a></li>
                    <li><a href="#quiz">Quiz</a></li>
                    <li><a href="#wishes">Deseos</a></li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
