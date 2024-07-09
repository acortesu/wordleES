import React, { useState, useRef } from 'react';
import Alert from './Alert';  // Asegúrate de ajustar la ruta según tu estructura de proyecto

const Game = () => {
    const [wordToGuess, setWordToGuess] = useState('');
    const [userTries, setUserTries] = useState(0);
    const [gameOver, setGameOver] = useState(true);
    const [rows, setRows] = useState(
        Array(6).fill().map(() => Array(5).fill(''))
    );
    const [colors, setColors] = useState(
        Array(6).fill().map(() => Array(5).fill(''))
    );
    const [activeRow, setActiveRow] = useState(0);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [endMessage, setEndMessage] = useState('');

    const inputRefs = useRef(Array(6).fill().map(() => Array(5).fill(null)));

    const isWordValid = (word) => {
        const regex = /^[A-Za-z]{5}$/;
        return regex.test(word);
    };

    const getWordFromFirstRow = () => {
        return rows[activeRow].join('');
    };

    const handleSubmit = async (event) => {
        if (event) event.preventDefault();
        const word = getWordFromFirstRow();

        if (!isWordValid(word)) {
            setAlertMessage('Please enter a valid 5-letter word using only letters.');
            return;
        }

        console.log('Palabra enviada:', word);
        console.log('Estado del juego:', { wordToGuess, userTries, gameOver });

        try {
            const response = await fetch('/api/guess', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    candidate: word,
                    word_to_guess: wordToGuess,
                    user_tries: userTries,
                    game_over: gameOver,
                }),
            });

            const data = await response.json();
            if (data) {
                setWordToGuess(data.word_to_guess);
                setUserTries(data.user_tries);
                setGameOver(data.game_over);
                setData(data);
                console.log('Respuesta del backend:', data);

                // Actualiza los colores de las celdas según los resultados
                const newColors = [...colors];
                data.correct_letter_and_index.forEach(({ index }) => {
                    newColors[activeRow][index] = '#5a03d5';
                });
                data.correct_letter_wrong_index.forEach(({ index }) => {
                    newColors[activeRow][index] = '#ebb507';
                });
                data.incorrect_letter.forEach(({ index }) => {
                    newColors[activeRow][index] = '#2c0076';
                });
                setColors(newColors);

                // Si el juego ha terminado, mostrar mensaje de victoria o derrota
                if (data.game_over) {
                    if (data.user_tries < 6) {
                        setEndMessage('¡Felicidades! Has ganado.');
                    } else {
                        setEndMessage('Lo siento, has perdido. La palabra era: ' + data.word_to_guess);
                    }
                } else {
                    // Avanza a la siguiente fila si el juego no ha terminado
                    setActiveRow((prevActiveRow) => {
                        const newActiveRow = prevActiveRow + 1;
                        setTimeout(() => {
                            inputRefs.current[newActiveRow][0].focus();
                        }, 0);
                        return newActiveRow;
                    });
                }
            }
        } catch (error) {
            setError(error);
            console.error('Error al enviar la palabra:', error);
        }
    };

    const handleChanges = (rowIndex, colIndex, value) => {
        if (rowIndex !== activeRow) return; // Solo permitir cambios en la fila activa
        if (value.length > 1) return; // Evitar entradas múltiples

        const newRows = rows.map((row, rIndex) =>
            row.map((col, cIndex) =>
                rIndex === rowIndex && cIndex === colIndex ? value.toUpperCase() : col
            )
        );
        setRows(newRows);

        // Mueve el cursor a la siguiente celda si hay una letra
        if (value && colIndex < 4) {
            inputRefs.current[rowIndex][colIndex + 1].focus();
        }

        // Mueve el cursor a la celda anterior si se borra la letra
        if (!value && colIndex > 0) {
            inputRefs.current[rowIndex][colIndex - 1].focus();
        }
    };

    const handleKeyDown = (event, rowIndex, colIndex) => {
        if (event.key === 'Enter') {
            handleSubmit(event);
        }
    };

    const handleCloseAlert = () => {
        setAlertMessage('');
    };

    const handleCloseEndMessage = () => {
        setEndMessage('');
        // Reinicia el juego
        setWordToGuess('');
        setUserTries(0);
        setGameOver(true);
        setRows(Array(6).fill().map(() => Array(5).fill('')));
        setColors(Array(6).fill().map(() => Array(5).fill('')));
        setActiveRow(0);
        inputRefs.current[0][0].focus();
    };

    return (
        <div className='flex flex-col mt-10'>
            <div className="grid gap-4 justify-center">
                {rows.map((row, rowIndex) => (
                    <div key={rowIndex} className="grid grid-cols-5 gap-2">
                        {row.map((col, colIndex) => (
                            <input
                                key={colIndex}
                                ref={(el) => inputRefs.current[rowIndex][colIndex] = el}
                                type="text"
                                maxLength="1"
                                value={col}
                                onChange={(e) => handleChanges(rowIndex, colIndex, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                                className={`w-12 h-12 text-center border-2 text-white text-2xl ${
                                    rowIndex <= activeRow
                                        ? 'border-gray-600 bg-gray-800'
                                        : 'border-gray-400 bg-gray-600'
                                }`}
                                style={{ backgroundColor: colors[rowIndex][colIndex] }}
                                disabled={rowIndex !== activeRow || endMessage !== ''}
                            />
                        ))}
                    </div>
                ))}
            </div>
            <div className='flex justify-center mt-5'>
                <div>
                    <button
                        onClick={handleSubmit}
                        className="btn-press-anim h-14 w-44 bg-[#d85dc8] text-white hover:bg-[#9b3088] active:bg-[#69265c] dark:bg-white dark:text-black"
                    >
                        Enviar
                    </button>
                </div>
            </div>
            <Alert message={alertMessage} onClose={handleCloseAlert} />
            <Alert message={endMessage} onClose={handleCloseEndMessage} />
        </div>
    );
};

export default Game;
