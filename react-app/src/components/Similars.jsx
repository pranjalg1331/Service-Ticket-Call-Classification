import React from 'react';
import Similar from './Similar';

const Similars = ({similarSolutionList}) => {
  // console.log(similarSolutionList)
  return (
    <>
    {similarSolutionList.map((dict,index)=>(
      <Similar problem={dict["problem"]} solution={dict["solution"]}/>
    ))}


                    
    </>
  )
}

export default Similars