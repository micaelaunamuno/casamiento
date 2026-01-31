import React, { useState } from 'react';
import './WishWall.css';

const initialWishes = [
    { name: "Sofi y Juan", message: "¡Muchas felicidades chicos! Los queremos mucho. ✨", emoji: "🥂" },
    { name: "La Nonna", message: "Que sean siempre muy felices juntos. Una alegría inmensa para toda la familia.", emoji: "❤️" },
    { name: "Rama", message: "¡Se viene el fiestón del año! 🥂🥂🥂", emoji: "🔥" },
    { name: "Mati", message: "No puedo esperar para verlos en el altar. ¡Vamooo!", emoji: "😂" }
];

const WishWall = () => {
    const [wishes, setWishes] = useState([]);
    const [newName, setNewName] = useState(localStorage.getItem('weddingGuestName') || '');
    const [newMessage, setNewMessage] = useState('');
    const [newEmoji, setNewEmoji] = useState('❤️');

    useEffect(() => {
        fetch('/api/wishes')
            .then(res => res.json())
            .then(data => setWishes(data.reverse()))
            .catch(err => console.error("Error fetching wishes:", err));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newName || !newMessage) return;

        const wish = { name: newName, message: newMessage, emoji: newEmoji };

        fetch('/api/wish', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(wish)
        }).then(() => {
            setWishes([wish, ...wishes]);
            localStorage.setItem('weddingGuestName', newName);
            setNewMessage('');
            setNewEmoji('❤️');
        });
    };

    return (
        <section className="wish-wall" id="wishes">
            <div className="container fade-in">
                <h2 className="section-title">Muro de Deseos</h2>
                <p className="wish-intro">Dejanos un deseo, un consejo o una frase linda.<br />Prometemos leerlos todos.</p>

                <form className="wish-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Nombre o Alias</label>
                            <input
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group emoji-group">
                            <label>Emoji</label>
                            <select value={newEmoji} onChange={(e) => setNewEmoji(e.target.value)}>
                                <option value="❤️">❤️ Love</option>
                                <option value="🥂">🥂 Cheers</option>
                                <option value="🔥">🔥 Party</option>
                                <option value="😂">😂 Fun</option>
                                <option value="✨">✨ Magic</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Tu Mensaje</label>
                        <textarea
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            required
                            rows="3"
                        ></textarea>
                    </div>
                    <button type="submit" className="btn-primary">Dejar Deseo</button>
                </form>

                <div className="wishes-display">
                    {wishes.map((wish, index) => (
                        <div key={index} className="wish-card fade-in">
                            <div className="wish-emoji">{wish.emoji}</div>
                            <p className="wish-text">"{wish.message}"</p>
                            <p className="wish-author">— {wish.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WishWall;
