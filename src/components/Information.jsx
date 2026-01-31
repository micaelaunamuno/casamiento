import React from 'react';
import './Information.css';

const Information = () => {
    return (
        <section className="information" id="info">
            <div className="container fade-in">
                <h2 className="section-title">Información</h2>
                <div className="info-grid">
                    <div className="info-item">
                        <label>Cuándo</label>
                        <p>30 de Mayo</p>
                    </div>
                    <div className="info-item">
                        <label>Ceremonia</label>
                        <p>Comunidad Amijai</p>
                        <a href="https://maps.app.goo.gl/n4Zzg7eQA8bBMC4DA" target="_blank" rel="noopener noreferrer" className="map-link">Ver Mapa</a>
                    </div>
                    <div className="info-item">
                        <label>Horarios</label>
                        <p>19:00 hs</p>
                    </div>
                    <div className="info-item">
                        <label>Fiesta</label>
                        <p>Puerto Salguero</p>
                        <a href="https://maps.app.goo.gl/F5fnU7ZiWjY6bZLP7" target="_blank" rel="noopener noreferrer" className="map-link">Ver Mapa</a>

                    </div>
                </div>
            </div>
        </section>
    );
};


export default Information;
