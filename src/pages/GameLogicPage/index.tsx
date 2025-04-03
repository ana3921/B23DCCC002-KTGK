import { useGameLogicModel } from "@/models/gamelogicmodel";
import styles from "./styles.less";
import { choices } from "@/services/GameLogicService";
const GameLogicPage = () => {
    const { playerChoice, computerChoice, result, history, handlePlayerChoice, resetGame } = useGameLogicModel();

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Oẳn Tù Tì</h1>
            <div className={styles.choices}>
                {choices.map((choice) => (
                    <button
                        key={choice}
                        onClick={() => handlePlayerChoice(choice)}
                        className={`${styles.choiceButton} ${playerChoice === choice ? styles.activeChoice : ''}`}
                    >
                        {choice}
                    </button>
                ))}
            </div>
            {playerChoice && (
                <div className={styles.resultContainer}>
                    <div className={styles.resultBox}>
                        <p>
                            <strong>Bạn chọn:</strong>
                            <span className={`${styles[playerChoice === "kéo" ? "keo" : playerChoice === "búa" ? "bua" : "bao"]}`}> {playerChoice}</span>
                        </p>
                        <p><strong>MáyMáy chọn:</strong>
                            <span className={`${styles[computerChoice === "kéo" ? "keo" : computerChoice === "búa" ? "bua" : "bao"]}`}> {computerChoice}</span></p>
                        <p>
                            <strong>Kết quả:</strong>
                            <span className={`${styles[result === "Thắng" ? "win" : result === "Thua" ? "lose" : "draw"]}`}> {result}</span>
                        </p>
                    </div>
                    <button onClick={resetGame} className={styles.resetButton}>🔄 Chơi lại</button>
                </div>
            )}
            <h2 className={styles.historyTitle}>Lịch sử trận đấu</h2>
            <ul className={styles.history}>
                {history.map((game, index) => (
                    <li key={index} className={styles.historyItem}>
                        🏆 <strong>Bạn:</strong> {game.playerChoice}, <strong>Máy:</strong> {game.computerChoice} → <strong className={game.result === "Thắng" ? styles.win : game.result === "Thua" ? styles.lose : styles.draw}>{game.result}</strong>
                    </li>
                ))}
            </ul>
        </div>
    )
}
export default GameLogicPage;