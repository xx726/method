import React, { useState } from 'react';
import MatrixInput from './components/MatrixInput';
import Results from './components/Results';
import { hungarianAlgorithm } from './utils/hungarianAlgorithm';
import { MatchingResult } from './types';

function App() {
  const [results, setResults] = useState<MatchingResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = async (
    matrix: number[][],
    rowLabels: string[],
    colLabels: string[],
    matchingType: 'max' | 'min'
  ) => {
    setIsCalculating(true);
    
    try {
      // Simulate a brief calculation delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const result = hungarianAlgorithm(matrix, rowLabels, colLabels, matchingType);
      setResults(result);
    } catch (error) {
      console.error('Error calculating:', error);
      alert('Ocurrió un error al calcular. Por favor, verifica tu entrada.');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleReset = () => {
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {!results ? (
            <div className="animate-fade-in">
              <MatrixInput 
                onCalculate={handleCalculate} 
                isCalculating={isCalculating}
              />
            </div>
          ) : (
            <div className="animate-slide-up">
              <Results 
                results={results} 
                onReset={handleReset}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;