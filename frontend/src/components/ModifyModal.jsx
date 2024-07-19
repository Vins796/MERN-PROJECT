import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ModifyModal({ post, onClose, onModify }) {
  const [modifiedPost, setModifiedPost] = useState(post);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setModifiedPost(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onModify(modifiedPost);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <motion.div className="bg-white p-8 rounded-lg"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl mb-4 text-center font-mono">Modify Post</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            value={modifiedPost.title}
            onChange={handleChange}
            className="w-full mb-2 border rounded p-3"
            placeholder="Title"
          />
          <textarea
            name="content"
            value={modifiedPost.content}
            onChange={handleChange}
            className="w-full mb-2 border rounded p-3"
            placeholder="Content"
          />
          {/* Aggiungere altri campi come necessario */}
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="mr-2 px-4 py-2 bg-gray-200 rounded font-mono">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-[#01FF84] text-black rounded font-mono">Save Changes</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

