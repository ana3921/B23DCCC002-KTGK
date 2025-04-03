import { useState } from "react"
import { RamdomComputerChoice, CompareChoices } from "@/services/GameLogicService"

export const useGameLogicModel = () => {
    const [playerChoice, setPlayerChoice] = useState<string | null>(null);
    const [computerChoice, setComputerChoice] = useState<string | null>(null);
    const [result, setResult] = useState<string | null>(null);
    const [history, setHistory] = useState<{ playerChoice: string, computerChoice: string, result: string }[]>([]);

    const handlePlayerChoice = (choice: string) => {
        const computer = RamdomComputerChoice();
        const gameResult = CompareChoices(choice, computer);
        setPlayerChoice(choice);
        setComputerChoice(computer);
        setResult(gameResult);
        setHistory([...history, { playerChoice: choice, computerChoice: computer, result: gameResult }]);
    };

    const resetGame = () => {
        setPlayerChoice(null);
        setComputerChoice(null);
        setResult(null);
    };
    return {
        playerChoice,
        computerChoice,
        result,
        history,
        resetGame,
        handlePlayerChoice,
    }
}