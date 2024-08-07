import React from 'react'
import { useState } from 'react'
const Searchbar = ({searchProblem,generateSolution}) => {
  // const [inputValue,setInputValue]=useState('')

  return (
    <>
    <form className="form-inline my-sm-0 w-100">
    <div className="input-group ">
        <input className="form-control mr-2 w-75 " value={searchProblem} type="search" placeholder="Search" aria-label="Search"></input>
        {/* <div className="form-control mr-2 w-75 b-2 search_bar">
          <p>{searchProblem}</p>
        </div> */}
        <div className="input-group-append mx-1">
        <button className="btn btn-outline-success" type="submit" onClick={()=>generateSolution()}>Generate</button>
        </div>
    </div>
    </form>
    </>
  )
}

export default Searchbar