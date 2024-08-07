import React from 'react'

const Generate = ({generatedSolution}) => {
    console.log(generatedSolution)
    if (!generatedSolution) {
        return null; 
    }
    return (
        <div className="card w-100 my-3" style={{ backgroundColor: 'grey', color: 'white' }}>
                <div className="card-body">
                    <h5 className="card-title">Here is the generated solution.</h5>
                    <p className="card-text">{generatedSolution["solution"]}</p>
                    
                </div>
            </div>
    );
    
}

export default Generate

