export default function Pagination({ currentPage, setCurrentPage, totalPages, limit, setLimit }) {
    return (
      <div className="flex justify-center pb-[50px]">
          <div className="flex flex-col items-center gap-[20px]">
              <div className="flex gap-[14px] items-center">
                  <button className=" cursor-pointer font-mono border border-black text-black text-[20px] bg-[#01FF84] px-[15px] hover:drop-shadow-xl hover:bg-black hover:border hover:border-[#01FF84] hover:text-white" onClick={() => setCurrentPage((currentPage) => Math.max(currentPage -1, 1))} disabled={currentPage === 1}>Back</button>
                  <span className="text-white font-mono dark:text-black">Pagina {currentPage} di {totalPages}</span>
                  <button className=" cursor-pointer font-mono border border-black text-black text-[20px] bg-[#01FF84] px-[15px] hover:drop-shadow-xl hover:bg-black hover:border hover:border-[#01FF84] hover:text-white" onClick={() => setCurrentPage((currentPage) => Math.min(currentPage +1, totalPages))} disabled={currentPage === totalPages}>Next</button>
              </div>
  
              <div>
                  <select className="font-mono text-black text-[20px] bg-[#01FF84] px-[30px] py-[20px] hover:drop-shadow-xl hover:bg-black hover:border hover:border-[#01FF84] hover:text-white cursor-pointer" value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
                      <option value={5}>5 per pagina</option>
                      <option value={10}>10 per pagina</option>
                      <option value={20}>20 per pagina</option>
                  </select>
              </div>
          </div>
      </div>
    )
}
  