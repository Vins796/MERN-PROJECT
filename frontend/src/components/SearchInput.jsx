export default function SearchInput({ search, handleChange }) {

  return (
    <input 
        type="text" 
        placeholder="Ricerca..."
        value={search}
        onChange={handleChange}
        className='bg-slate-200 rounded-lg py-[10px] px-[15px] focus:outline-none'
    />

  )
}
