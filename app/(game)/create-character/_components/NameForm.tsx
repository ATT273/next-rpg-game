import { motion } from "framer-motion";
import { useCreateCharacterContext } from "./CreateCharacterProvider";

const NameForm = () => {
  const { creatingPlayer, errors, handleUpdatePlayer, handleNextStep } = useCreateCharacterContext();
  return (
    <motion.div initial={{ opacity: 0, scale: 0.2 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
      <input
        id="name"
        type="text"
        className="form-input"
        placeholder="Enter your name"
        name="name"
        onChange={(e) => handleUpdatePlayer({ name: e.target.value })}
        value={creatingPlayer.name}
      />
      <p className="text-red-500 text-center">{errors.error}</p>
      <div className="flex gap-2 justify-center">
        <button type="submit" className="cursor-pointer text-xl rounded-md" onClick={handleNextStep}>
          Next
        </button>
      </div>
    </motion.div>
  );
};

export default NameForm;
