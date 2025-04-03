import styles from './styles.less';
import { Button, Card, Input } from "antd";
import { Typography } from "antd";
import { useRandomNumberModel } from "@/models/ramdomNumber";

const { Title, Text } = Typography;

const RamdomNumberPage = () => {
    const { numberOfEntries, guess, ramdomResult, isNumberOver, setGuess, handleGuess, handleNewRamdomNumber, feedback } = useRandomNumberModel();

    return (
        <div className={styles.container}>
            <Card className={styles.card}>
                <Title level={3}>Trò chơi đoán số</Title>
                <Text>Bạn hãy đoán số từ 1 đến 100. Bạn có {numberOfEntries} lần đoán.</Text>

                <div className={styles.inputNumber}>
                    <Input
                        type="number"
                        value={guess}
                        onChange={(e) => setGuess(e.target.value)}
                        // Bắt sự kiện nhấn Enter để đoán số
                        onKeyPress={(e) => e.key === 'Enter' && handleGuess()}
                        placeholder="Nhập số đoán của bạn"
                        // Khóa input nếu trò chơi kết thúc
                        disabled={isNumberOver}
                    />
                    <Button type="primary" onClick={handleGuess} disabled={isNumberOver}>Đoán số</Button>
                </div>
                {/* Phản hồi kết quả */}
                {feedback && <Text className={styles.feedback}>{feedback}</Text>}
                {ramdomResult && <Text className={styles.result}>{ramdomResult}</Text>}
                {/* Button chơi lại */}
                {isNumberOver && (
                    <Button type="primary" onClick={handleNewRamdomNumber} className={styles.resetButton}>
                        Chơi lại
                    </Button>
                )}
            </Card>
        </div>
    );
};

export default RamdomNumberPage;
