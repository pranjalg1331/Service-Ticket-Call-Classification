import React from 'react'
import problems from '../assets/jsonfiles/problems.json';
import { useState } from 'react';
import Problem from './Problem';
const Problems = ({setSearchProblem}) => {
  const topProblems = problems.slice(0, 4);
  return (
    <>
    
    <div className="col-md-4">
        <div className="container-fluid full-height br my-4">
          
          {topProblems.map((problem,index) => (
            <Problem key={index} problem={problem} setSearchProblem={setSearchProblem}/>
          ))}
            
        
        
        </div> 
    </div>
    </>
  )
}

export default Problems