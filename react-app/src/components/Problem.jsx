import React, { useState } from 'react'

const Problem = ({problem,index,setSearchProblem}) => {
    const [showFullProblem,setShowFullProblem]=useState(false)
    const sliced_problem=problem;
    if(!showFullProblem){
        problem = problem.substring(0,90) + '...';
    }
  return (
    <div className="card w-100 my-2" key={index}>
        <div className="card-body">
          <p className="card-text">{problem}</p>
          <a href="#" className="card-link" onClick={() => setShowFullProblem((prevState) => !prevState)} >see  {showFullProblem ? 'less' : 'more'}</a>
          <i className="bi bi-arrow-bar-right card-link" onClick={()=>setSearchProblem(sliced_problem)} ></i>
        </div>
    </div>
  )
}

export default Problem