import React from 'react'
import Navbar from './components/Navbar'
import Problems from './components/Problems'
import Searchbar from './components/Searchbar'
import Similars from './components/Similars'
import { useState ,useEffect} from 'react'
import Generate from './components/Generate'

const App = () => {
  const [searchProblem, setSearchProblem] = useState('');
  const [similarProblem,setSimilarProblem]=useState([]);
  const[generatedSolution,setGeneratedSolution]=useState("");
  useEffect(()=>{
    if (searchProblem) {
    
      // Function to send POST request
      const postSearchProblem = async () => {
        const data = {
          input_data: searchProblem,
          category: "Loan and debt"
        };

      const response = await fetch("http://localhost:4000/related",{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        }).then((response) => {
          return response.json();
        }).then((data) => {
     
        
          setSimilarProblem(data["similar problems with solutions"]);
          
        })
       .catch(error => console.error(error))
       
      }
      // similarProblem
      
      console.log(similarProblem);
      postSearchProblem();
    
    };
  },[searchProblem])

  const generateSolution = async () => {
    if (!searchProblem) {
      console.error('searchProblem is not defined');
      return;
    }
  
    const data = {
      problem: searchProblem,
      similarProblems: similarProblem
    };
  
    try {
      const response = await fetch("http://localhost:4000/generate", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      // console.log(result);
      setGeneratedSolution(result);
    } catch (error) {
      console.error('Error:', error);
    }
  };
    
  
 
  // console.log(searchProblem);
  return (
    <>
      <Navbar/>
        <div className="row">
                <Problems setSearchProblem={setSearchProblem}/>
                <div className="col-8">
                    <div className="container-fluid full-height p-5">
                        <Searchbar searchProblem={searchProblem} generateSolution={generateSolution}/>
                        <Generate generatedSolution={generatedSolution}/>
                        <Similars similarSolutionList={similarProblem}/>
                            
                    </div>
                </div>
        </div>
    </>
  )
}

export default App

