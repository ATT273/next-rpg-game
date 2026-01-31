import { createContext, useContext, useState } from "react";
import { initialPlayer } from "@/data/data";
import { Player } from "@/types/player";

type CreateCharacterContextType = {
  step: number;
  errors: { error: string };
  creatingPlayer: Player;
  skillPoints: number;
  setSkillPoints: (points: number) => void;
  handleNextStep: () => void;
  handlePrevStep: () => void;
  handleUpdatePlayer: (data: Partial<Player>) => void;
};

export const MAX_SKILL_POINTS = 1;
const CreateCharacterContext = createContext<CreateCharacterContextType | null>(null);

const CreateCharacterProvider = ({ children }: { children: React.ReactNode }) => {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({ error: "" });
  const [skillPoints, setSkillPoints] = useState<number>(MAX_SKILL_POINTS);
  const [creatingPlayer, setCreatingPlayer] = useState<Player>(initialPlayer);

  const handleUpdatePlayer = (data: any) => {
    setCreatingPlayer((prevState) => ({ ...prevState, ...data }));
  };

  const checkErrors = () => {
    let error = false;
    switch (step) {
      case 1:
        if (creatingPlayer.name === "") {
          setErrors((prevState) => ({
            ...prevState,
            error: "Please enter your character`s name",
          }));
          error = true;
        }
        break;
      case 2:
        if (creatingPlayer.skills.length === 0) {
          setErrors((prevState) => ({
            ...prevState,
            error: "Select 1 skill to learn",
          }));
          error = true;
        }
        break;
      default:
        error = false;
        break;
    }
    return error;
  };
  const handleNextStep = () => {
    const error = checkErrors();
    if (!error) {
      setStep(step + 1);
      setErrors({ error: "" });
    }
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  return (
    <CreateCharacterContext.Provider
      value={{
        step,
        errors,
        creatingPlayer,
        skillPoints,
        setSkillPoints,
        handleNextStep,
        handlePrevStep,
        handleUpdatePlayer,
      }}
    >
      {children}
    </CreateCharacterContext.Provider>
  );
};

export const useCreateCharacterContext = () => {
  const context = useContext(CreateCharacterContext);
  if (!context) {
    throw new Error("useCreateCharacterContext must be used within a CreateCharacterProvider");
  }
  return context;
};

export default CreateCharacterProvider;
