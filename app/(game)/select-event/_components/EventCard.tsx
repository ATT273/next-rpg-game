import { motion, AnimatePresence } from "framer-motion";
import Image, { StaticImageData } from "next/image";

interface EventCardProps {
  title: string;
  image: string | StaticImageData;
  description?: string;
  handleOnClick: () => void;
}
const EventCard = ({ title, image, description, handleOnClick }: EventCardProps) => {
  return (
    <motion.div
      key="event-2"
      id="event-2"
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.2, zIndex: 10 }}
      className="relative w-full md:w-50 h-auto md:h-75 border p-4 cursor-pointer bg-white flex flex-col gap-2 items-center justify-start rounded-xl"
      onClick={handleOnClick}
    >
      {title && (
        <>
          <h1>{title}</h1>
          <div className="size-30 relative mb-4 hidden md:block shrink-0">
            <Image src={image} alt={title} fill sizes="300px" />
          </div>
          <div className="text-sm line-clamp-4 text-center italic p-2 hidden md:block">{description}</div>
          <div className="flex w-full gap-2 md:hidden">
            <div className="size-30 relative mb-4 shrink-0">
              <Image src={image} alt={title} fill sizes="300px" />
            </div>
            <div className="text-sm line-clamp-4 text-left italic p-2">{description}</div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default EventCard;
