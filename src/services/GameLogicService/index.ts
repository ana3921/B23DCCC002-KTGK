 export const choices = ["kéo", "búa", "bao"];

export const RamdomComputerChoice = () => {
    return choices[Math.floor(Math.random() * choices.length)];
}

export const CompareChoices = (player: string, computer: string): string => {
    if (player === computer) return "Hòa";
    else if(
        (player === "kéo" && computer === "bao") ||
        (player === "búa" && computer === "kéo") ||
        (player === "bao" && computer === "búa")
    ) return "Thắng";
    else return "Thua";
}