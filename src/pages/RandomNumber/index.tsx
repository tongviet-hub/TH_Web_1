import { useEffect, useState } from "react";
import { Input, Button } from "antd";

const RandomNumber = () => {
    const [number, setNumber] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [numberGuest, setNumberGuest] = useState('');
    const [message, setMessage] = useState('');
    const [attempts, setAttempts] = useState(0);

    const handleGuess = () => {
        if (gameOver) return;
        const guess = parseInt(numberGuest, 10);
        if (isNaN(guess) || guess < 0 || guess > 100) {
            setMessage('Vui lòng nhập số từ 1 đến 100');
            return;
        }
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        if (guess === number) {
            setGameOver(true);
            setMessage('Chúc mừng! Bạn đã đoán đúng');
        } else if (newAttempts >= 10) {
            setGameOver(true);
            setMessage(`Bạn đã hết lượt! Số đúng là ${number}`);
        } else if (guess < number) {
            setMessage('Bạn đoán quá thấp!');
        } else {
            setMessage('Bạn đoán quá cao!');
        }
        setNumberGuest('');
    };

    const resetGame = () => {
        const newNumber = Math.floor(Math.random() * 100) + 1;
        setNumber(newNumber);
        setGameOver(false);
        setNumberGuest('');
        setMessage('');
        setAttempts(0);
        console.log("Số bí mật là:", newNumber);
    };
    useEffect(() => {
        resetGame();
    }, []);

    return (
        <div className="App" style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f25f51ff, #dbd650ff)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: '-apple-system, BlinkMacOSystemFont, "Segoe UI", Roboto, sans-serif',
            color: '#fff'
        }}>
            <div className="game-container" style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '2.5rem 2rem',
                width: '90%',
                maxWidth: '420px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
                textAlign: 'center'
            }}>
                <h1 style={{ marginBottom: '10px' }}>Trò chơi Đoán Số</h1>
                <p style={{ opacity: 0.8, marginBottom: '20px' }}>Số bí mật nằm trong khoảng 1 – 100</p>

                <div className="status">
                    <p>Lượt còn lại: <strong>{10 - attempts}</strong></p>
                    <p className="message">{message}</p>
                </div>

                <div className="input-area" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <Input
                        type="number"
                        value={numberGuest}
                        onChange={(e) => setNumberGuest(e.target.value)}
                        placeholder="Nhập số của bạn"
                        disabled={gameOver}
                        style={{
                            padding: '10px 15px',
                            borderRadius: '8px',
                            textAlign: 'center',
                            fontSize: '16px'
                        }}
                    />
                    <Button onClick={handleGuess} disabled={gameOver}>
                        Đoán
                    </Button>
                </div>

                {gameOver && (
                    <Button className="reset-btn" onClick={resetGame}>
                        Chơi lại
                    </Button>
                )}
            </div>
        </div>
    );
};

export default RandomNumber;
