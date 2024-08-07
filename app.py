from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
import pickle
from sentence_transformers import SentenceTransformer
from flask_cors import CORS
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
GOOGLE_API_KEY="AIzaSyC4IYPA6YW6n7nofyz9j00-O-xkVlS-DkI"
app = Flask(__name__)
CORS(app)

df = pd.read_excel('output.xlsx')
df_cleaned=df.iloc[0:30,:]

category_mapping = {
    0: 'Bank account or service',
    1: 'Credit card or prepaid card',
    2: 'Credit reporting',
    3: 'Loan and debt',
    4: 'Money transfers',
    5: 'Other financial service'
}
model_filename = 'lr_tfidf_model.pkl'
vectorizer_filename = 'tfidf_vectorizer.pkl'

@app.route('/related', methods=['POST'])
def related_data():
    
    with open(vectorizer_filename, 'rb') as vectorizer_file:
        loaded_vectorizer = pickle.load(vectorizer_file)
    
    data = request.get_json()["input_data"]
    category=request.get_json()["category"]
    
    if not category:
        return jsonify({"error": "No categroy provided"}), 400

    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    input_data=[data]

    #get problems of same category
    df_filtered = df_cleaned[df_cleaned['Product'] == category]
    problems_of_same_category=df_filtered['final_problem']
    soultion_for_similar_problems=df_filtered['Solution']
    model = SentenceTransformer("all-mpnet-base-v2")
    query_embedding = model.encode(input_data[0])
    passage_embeddings = model.encode([
    x for x in problems_of_same_category.tolist()
    ])

    similarity = model.similarity(query_embedding, passage_embeddings)
    # Your similarity tensor
    similarity_tensor = np.array(similarity)
    similarity = similarity_tensor.flatten() 
    top_indices = np.argsort(similarity)[-3:][::-1]
    similar_problem_with_solution=[]

    for i in top_indices:
        x={}
        x["problem"]=problems_of_same_category.tolist()[i]
        x["solution"]=soultion_for_similar_problems.tolist()[i]
        similar_problem_with_solution.append(x)
        # x[problems_of_same_category.tolist()[i]]=soultion_for_similar_problems.tolist()[i]
    
    print("Top 3 passages based on similarity scores:")
    print(similar_problem_with_solution)
    
    response = {
        "similar problems with solutions":similar_problem_with_solution,
        "message": "Data processed successfully!"
    }

    
    return jsonify(response), 200

@app.route('/category', methods=['POST'])
def find_category():
    
    with open(vectorizer_filename, 'rb') as vectorizer_file:
        loaded_vectorizer = pickle.load(vectorizer_file)
    
    data = request.get_json()["input_data"]
    input_data=[data]
    # print(input_data)
    # Vectorize the input data
    X = loaded_vectorizer.transform(input_data) 

    if not input_data:
        return jsonify({"error": "No data provided"}), 400
    
    #load model
    with open(model_filename, 'rb') as file:
        loaded_model = pickle.load(file)

    i=loaded_model.predict(X)
    
    category=[category_mapping[label] for label in i][0]
    print(category)
        
    response = {
        "category": category,
        "message": "Data processed successfully!"
    }

    
    return jsonify(response), 200

@app.route('/generate', methods=['POST'])
def generate_solution():
    data = request.json
    problem = data['problem']
    similarProblems=data['similarProblems']
    rp1=similarProblems[0]["problem"]
    sp1=similarProblems[0]["solution"]
    rp2=similarProblems[1]["problem"]
    sp2=similarProblems[1]["solution"]
    rp3=similarProblems[2]["problem"]
    sp3=similarProblems[2]["solution"]
    
    description_prompt = PromptTemplate.from_template("{constant_input}")
    llm = ChatGoogleGenerativeAI(model="gemini-pro", google_api_key=GOOGLE_API_KEY)
    description_chain = LLMChain(llm=llm, prompt=description_prompt)
    
    prompt1="I have a customer care database with problem and solution. I will provide you with a new problem and some similar problems with their solutions from db. Please try to make a solution to the new problem from the given problems and solutions like you are answerung the customer in one paragraph.  \n problem: "+problem+" Related solutions are:\n 1> "+rp1+"->"+sp1+"\n 2> "+rp2+"->"+sp2+"\n3> "+rp3+"->"+sp3+".\n Absolutely do not make anything up."
    print(prompt1)

# script_chain = LLMChain(llm=llm, prompt=script_prompt)
    solution = description_chain.predict(constant_input=prompt1)
    print(solution)

    # Generate the solution based on the given problem and related solutions
    # solution = (
    #     f"We regret to hear about your experience with your credit card application at Barclays Bank DE. "
    #     f"To address this, we advise obtaining a copy of your credit report to review the information provided by Barclays Bank DE. "
    #     f"If discrepancies are identified, you can request a deletion letter from them to correct any inaccuracies. "
    #     f"If you need further assistance, please feel free to reach out to us for guidance."
    # )
    
    return jsonify({"solution": solution})

def startup_code():
    
    df_cleaned['Product'] = df_cleaned['Product'].replace('"Credit reporting', 'Credit reporting')
    df_cleaned['Product'] = df_cleaned['Product'].replace('Credit card', 'Credit card or prepaid card')
    df_cleaned['Product'] = df_cleaned['Product'].replace('Prepaid card', 'Credit card or prepaid card')
    df_cleaned['Product'] = df_cleaned['Product'].replace('Consumer Loan', 'Bank account or service')
    df_cleaned['Product'] = df_cleaned['Product'].replace('Student loan', 'Loan and debt')
    df_cleaned['Product'] = df_cleaned['Product'].replace('Payday loan', 'Loan and debt')
    df_cleaned['Product'] = df_cleaned['Product'].replace('"Payday loan', 'Loan and debt')
    df_cleaned['Product'] = df_cleaned['Product'].replace('Vehicle loan or lease', 'Loan and debt')
    df_cleaned['Product'] = df_cleaned['Product'].replace('Mortgage', 'Loan and debt')
    df_cleaned['Product'] = df_cleaned['Product'].replace('Debt collection', 'Loan and debt')
    df_cleaned['Product'] = df_cleaned['Product'].replace('"Money transfer', 'Money transfers')
    df_cleaned['Product'] = df_cleaned['Product'].replace('Checking or savings account', 'Bank account or service')
    df_cleaned['Product'] = df_cleaned['Product'].replace('Virtual currency', 'Other financial service')
    

if __name__ == '__main__':
    startup_code()
    app.run(debug=True,port=4000)