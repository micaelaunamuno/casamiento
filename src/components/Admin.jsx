import React, { useState, useEffect } from 'react';
import './Admin.css';

const Admin = () => {
    const [rsvps, setRsvps] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [wishes, setWishes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [rsvpsRes, leaderboardRes, wishesRes] = await Promise.all([
                    fetch('/api/rsvps'),
                    fetch('/api/leaderboard'),
                    fetch('/api/wishes')
                ]);

                const [rsvpsData, leaderboardData, wishesData] = await Promise.all([
                    rsvpsRes.json(),
                    leaderboardRes.json(),
                    wishesRes.json()
                ]);

                setRsvps(rsvpsData);
                setLeaderboard(leaderboardData);
                setWishes(wishesData);
            } catch (err) {
                console.error("Error fetching admin data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const countAttending = rsvps.filter(r => r.attending === 'yes').length;

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>Panel de Control</h1>
                <div className="admin-stats">
                    <div className="stat-card">
                        <span className="stat-value">{rsvps.length}</span>
                        <span className="stat-label">Respuestas</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value">{countAttending}</span>
                        <span className="stat-label">Confirmados ✅</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value">{wishes.length}</span>
                        <span className="stat-label">Deseos ✨</span>
                    </div>
                </div>
            </div>

            <div className="admin-content">
                <section className="admin-section">
                    <h2>Lista de Invitados</h2>
                    {loading ? (
                        <p>Cargando datos...</p>
                    ) : (
                        <div className="table-container">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Asistencia</th>
                                        <th>Dieta / Restricción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rsvps.map((rsvp, index) => (
                                        <tr key={index}>
                                            <td>{rsvp.name}</td>
                                            <td className={rsvp.attending === 'yes' ? 'status-yes' : 'status-no'}>
                                                {rsvp.attending === 'yes' ? 'Confirmado' : 'No asiste'}
                                            </td>
                                            <td>{rsvp.diet || '-'}</td>
                                        </tr>
                                    ))}
                                    {rsvps.length === 0 && (
                                        <tr>
                                            <td colSpan="3" style={{ textAlign: 'center' }}>No hay confirmaciones aún.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                <div className="admin-grid-two">
                    <section className="admin-section">
                        <h2>Ranking Quiz 🏆</h2>
                        <div className="table-container">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Pos</th>
                                        <th>Nombre</th>
                                        <th>Puntos</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaderboard.map((entry, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{entry.name}</td>
                                            <td>{entry.score}</td>
                                        </tr>
                                    ))}
                                    {leaderboard.length === 0 && (
                                        <tr>
                                            <td colSpan="3" style={{ textAlign: 'center' }}>Nadie jugó aún.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section className="admin-section">
                        <h2>Muro de Deseos ✨</h2>
                        <div className="wishes-list">
                            {wishes.map((wish, index) => (
                                <div key={index} className="wish-item-admin">
                                    <strong>{wish.name}</strong> {wish.emoji}
                                    <p>"{wish.message}"</p>
                                </div>
                            ))}
                            {wishes.length === 0 && <p>No hay deseos todavía.</p>}
                        </div>
                    </section>
                </div>
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <button className="btn-outline" onClick={() => window.location.href = '/'}>
                    Volver a la web
                </button>
            </div>
        </div>
    );
};

export default Admin;
