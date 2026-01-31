import React, { useState, useEffect, useRef } from 'react';
import './Quiz.css';

const questions = [
    { question: "¿Dónde nos conocimos?", options: ["En el trabajo", "En un viaje", "En una fiesta", "En la facultad"], correct: 3 },
    { question: "¿Quién dio el primer paso?", options: ["Micky", "Zurdo", "Fue mutuo"], correct: 1 },
    { question: "¿Cómo se llaman nuestros gatos", options: ["Brad y Trini", "Pancho y Ruda", "Helen y William"], correct: 2 },
    { question: "¿Cuántos tiempo llevamos juntos?", options: ["1 año y medio", "2 años", "2 años y medio", "3 años"], correct: 3 },
    { question: "¿Cuál es nuestro plato de comida preferido para compartir?", options: ["Sushi", "Asado", "Pasta", "Pizza"], correct: 1 }
];

const Quiz = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60); // 60 seconds total
    const [leaderboard, setLeaderboard] = useState([]);
    const [userName, setUserName] = useState(localStorage.getItem('weddingGuestName') || '');
    const [quizStarted, setQuizStarted] = useState(false);
    const timerRef = useRef(null);

    const startQuiz = () => {
        if (userName) {
            localStorage.setItem('weddingGuestName', userName);
            setQuizStarted(true);
        }
    };

    useEffect(() => {
        fetch('/api/leaderboard')
            .then(res => res.json())
            .then(data => setLeaderboard(data));
    }, []);

    useEffect(() => {
        if (quizStarted && !showResult && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            handleComplete();
        }
        return () => clearInterval(timerRef.current);
    }, [quizStarted, showResult, timeLeft]);

    const handleAnswer = (index) => {
        let newScore = score;
        if (index === questions[currentQuestion].correct) {
            newScore = score + 1;
            setScore(newScore);
        }

        const nextQuestion = currentQuestion + 1;
        if (nextQuestion < questions.length) {
            setCurrentQuestion(nextQuestion);
        } else {
            handleComplete(newScore);
        }
    };

    const handleComplete = (finalCorrectAnswers) => {
        setShowResult(true);
        clearInterval(timerRef.current);

        // Calculate points: 100 per correct answer + time bonus (only if they got some right)
        const baseScore = finalCorrectAnswers * 100;
        const timeBonus = finalCorrectAnswers > 0 ? timeLeft : 0;
        const totalPoints = baseScore + timeBonus;

        const finalData = {
            name: userName,
            correctAnswers: finalCorrectAnswers,
            score: totalPoints,
            timeElapsed: 60 - timeLeft
        };

        fetch('/api/quiz', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(finalData)
        })
            .then(res => res.json())
            .then(data => setLeaderboard(data));
    };

    return (
        <section className="quiz" id="quiz">
            <div className="container quiz-layout fade-in">
                <div className="quiz-main">
                    <h2 className="section-title">¿Cuánto nos conocés?</h2>

                    {!quizStarted ? (
                        <div className="quiz-card">
                            <input
                                type="text"
                                placeholder="Ingresá tu nombre"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                className="quiz-name-input"
                            />
                            <button
                                className="btn-primary"
                                disabled={!userName}
                                onClick={startQuiz}
                            >
                                Empezar Quiz
                            </button>
                        </div>
                    ) : !showResult ? (
                        <div className="quiz-card">
                            <div className="quiz-header">
                                <div className="timer">Tiempo: {timeLeft}s</div>
                                <div className="question-counter">Pregunta {currentQuestion + 1}/{questions.length}</div>
                            </div>
                            <h3 className="question-text">{questions[currentQuestion].question}</h3>
                            <div className="options-grid">
                                {questions[currentQuestion].options.map((option, index) => (
                                    <button key={index} className="btn-outline option-btn" onClick={() => handleAnswer(index)}>
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="quiz-result fade-in">
                            <div className="result-score">{score} / {questions.length}</div>
                            <div className="result-points">Puntaje total: {(score * 100) + (score > 0 ? timeLeft : 0)} pts</div>
                            <h3>¡Buen trabajo, {userName}!</h3>
                            <button className="btn-primary" onClick={() => window.location.reload()}>Volver a empezar</button>
                        </div>
                    )}
                </div>

                <div className="quiz-leaderboard">
                    <h3 className="leaderboard-title">Ranking 🏆</h3>
                    <ul className="leaderboard-list">
                        {leaderboard.map((entry, index) => (
                            <li key={index} className="leaderboard-item">
                                <span className="rank-pos">{index + 1}.</span>
                                <span className="rank-name">{entry.name}</span>
                                <span className="rank-points">{entry.score} pts ({entry.timeElapsed}s)</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default Quiz;
