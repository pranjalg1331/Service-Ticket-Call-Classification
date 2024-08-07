import React, { useState } from 'react'

const Similar = ({problem,solution}) => {
  const [visibleSolution,setVisibleSolution]=useState(false)
  const showSolution=()=>{
  
    setVisibleSolution(!visibleSolution);
  }
  return (
    <div className="card w-100 my-3" >
        <div className="card-body">
            <h5 className="card-title">Problem</h5>
            
            <p className="card-text">{problem} </p>
            
            <div className="card-footer text-muted text-center see-solution" onClick={()=>showSolution()}> 
                See Solution <spam><i class="bi bi-chevron-expand"></i></spam>
            </div>
            <div className="card-text m-1" style={{ display:visibleSolution? 'block': 'none'}}>
             
              <p>{solution}</p>
            </div>
            
        </div>
    </div>
  )
}

export default Similar