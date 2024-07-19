import { useState } from 'react';
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from 'framer-motion';

export default function SearchInput({ search, handleChange }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="relative flex items-center">
      <div className="rounded-full border p-[10px]">
        <MagnifyingGlassIcon 
          className="h-6 w-6 cursor-pointer text-[#01FF84]" 
          onClick={toggleExpand}
        />
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 200, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <motion.input 
              type="text" 
              placeholder="Search..."
              value={search}
              onChange={handleChange}
              className='bg-slate-200 rounded-lg py-[10px] pl-[15px] pr-[15px] focus:outline-none ml-2'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}