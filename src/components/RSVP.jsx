import React, { useState } from 'react';
import './RSVP.css';

const RSVP = () => {
    const [step, setStep] = useState(1);
    const [name, setName] = useState(localStorage.getItem('weddingGuestName') || '');
    const [attending, setAttending] = useState('');
    const [diet, setDiet] = useState('none');
    const [submitted, setSubmitted] = useState(false);

    const handleNext = () => {
        localStorage.setItem('weddingGuestName', name);
        setStep(2);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = { name, attending, diet };

        fetch('/api/rsvp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(() => {
            setSubmitted(true);
        });
    };

    if (submitted) {
        return (
            <section className="rsvp" id="rsvp">
                <div className="container fade-in">
                    <h2 className="section-title">¡Gracias, {name}!</h2>
                    <p>Tu respuesta ha sido enviada con éxito. ¡Nos vemos pronto!</p>
                </div>
            </section>
        );
    }

    return (
        <section className="rsvp" id="rsvp">
            <div className="container fade-in">
                <h2 className="section-title">Confirmar Asistencia</h2>
                <p className="rsvp-intro">Por favor, confirmanos si nos vas a acompañar.</p>

                <form className="rsvp-form" onSubmit={handleSubmit}>
                    {step === 1 ? (
                        <div className="form-group fade-in">
                            <label>Tu Nombre y Apellido</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="Ej: Juan Pérez"
                            />
                            <button
                                type="button"
                                className="btn-primary"
                                style={{ width: '100%' }}
                                disabled={!name}
                                onClick={handleNext}
                            >
                                Siguiente
                            </button>
                        </div>
                    ) : (
                        <div className="fade-in">
                            <div className="form-group">
                                <label>¿Venís?</label>
                                <select value={attending} onChange={(e) => setAttending(e.target.value)} required>
                                    <option value="">Seleccioná una opción</option>
                                    <option value="yes">¡Sí, confirmo!</option>
                                    <option value="no">No puedo ir</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Restricción Alimentaria</label>
                                <select value={diet} onChange={(e) => setDiet(e.target.value)}>
                                    <option value="none">Ninguna</option>
                                    <option value="vegetarian">Vegetariano</option>
                                    <option value="vegan">Vegano</option>
                                    <option value="celiac">Celiaco</option>
                                    <option value="kosher">Kosher</option>
                                </select>
                            </div>

                            <div className="form-actions">
                                <button type="button" className="btn-outline" onClick={() => setStep(1)}>Atrás</button>
                                <button type="submit" className="btn-primary" disabled={!attending}>Enviar Confirmación</button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </section>
    );
};

export default RSVP;
