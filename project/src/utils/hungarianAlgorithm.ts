import { MatchingResult, MatchingPair } from '../types';

export function hungarianAlgorithm(
  matrix: number[][],
  rowLabels: string[],
  colLabels: string[],
  matchingType: 'max' | 'min'
): MatchingResult {
  const rows = matrix.length;
  const cols = matrix[0].length;
  
  // Make the matrix square by padding with zeros
  const size = Math.max(rows, cols);
  const squareMatrix: number[][] = Array(size).fill(null).map(() => Array(size).fill(0));
  
  // Copy original matrix and handle max/min conversion
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      squareMatrix[i][j] = matrix[i][j];
    }
  }
  
  // For maximization, convert to minimization by subtracting from max value
  let maxValue = 0;
  if (matchingType === 'max') {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        maxValue = Math.max(maxValue, matrix[i][j]);
      }
    }
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (i < rows && j < cols) {
          squareMatrix[i][j] = maxValue - matrix[i][j];
        } else {
          squareMatrix[i][j] = maxValue;
        }
      }
    }
  }
  
  // Solve using Hungarian algorithm
  const assignment = solveHungarian(squareMatrix);
  
  // Convert back to original indices and calculate result
  const pairs: MatchingPair[] = [];
  let totalWeight = 0;
  
  for (let i = 0; i < rows; i++) {
    const j = assignment[i];
    if (j < cols) {
      const originalWeight = matrix[i][j];
      pairs.push({
        row: rowLabels[i],
        col: colLabels[j],
        weight: originalWeight
      });
      totalWeight += originalWeight;
    }
  }
  
  return {
    pairs,
    totalWeight,
    matchingType,
    rowLabels,
    colLabels
  };
}

function solveHungarian(matrix: number[][]): number[] {
  const size = matrix.length;
  const cost = matrix.map(row => [...row]);
  
  // Step 1: Subtract row minimums
  for (let i = 0; i < size; i++) {
    const rowMin = Math.min(...cost[i]);
    for (let j = 0; j < size; j++) {
      cost[i][j] -= rowMin;
    }
  }
  
  // Step 2: Subtract column minimums
  for (let j = 0; j < size; j++) {
    let colMin = Infinity;
    for (let i = 0; i < size; i++) {
      colMin = Math.min(colMin, cost[i][j]);
    }
    for (let i = 0; i < size; i++) {
      cost[i][j] -= colMin;
    }
  }
  
  // Step 3: Find minimum number of lines to cover all zeros
  let assignment: number[] = new Array(size).fill(-1);
  let numAssigned = 0;
  
  // Try to find initial assignment
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (cost[i][j] === 0 && assignment[i] === -1) {
        let canAssign = true;
        for (let k = 0; k < size; k++) {
          if (assignment[k] === j) {
            canAssign = false;
            break;
          }
        }
        if (canAssign) {
          assignment[i] = j;
          numAssigned++;
          break;
        }
      }
    }
  }
  
  // If not fully assigned, use augmenting path method
  while (numAssigned < size) {
    const rowCovered = new Array(size).fill(false);
    const colCovered = new Array(size).fill(false);
    
    // Cover assigned columns
    for (let i = 0; i < size; i++) {
      if (assignment[i] !== -1) {
        colCovered[assignment[i]] = true;
      }
    }
    
    // Cover rows with zeros in uncovered columns
    let changed = true;
    while (changed) {
      changed = false;
      for (let i = 0; i < size; i++) {
        if (!rowCovered[i]) {
          for (let j = 0; j < size; j++) {
            if (!colCovered[j] && cost[i][j] === 0) {
              rowCovered[i] = true;
              changed = true;
              break;
            }
          }
        }
      }
      
      // Cover columns with assigned zeros in covered rows
      for (let i = 0; i < size; i++) {
        if (rowCovered[i] && assignment[i] !== -1) {
          colCovered[assignment[i]] = false;
          changed = true;
        }
      }
    }
    
    // Find minimum uncovered value
    let minUncovered = Infinity;
    for (let i = 0; i < size; i++) {
      if (!rowCovered[i]) {
        for (let j = 0; j < size; j++) {
          if (!colCovered[j]) {
            minUncovered = Math.min(minUncovered, cost[i][j]);
          }
        }
      }
    }
    
    // Adjust matrix
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (rowCovered[i] && colCovered[j]) {
          cost[i][j] += minUncovered;
        } else if (!rowCovered[i] && !colCovered[j]) {
          cost[i][j] -= minUncovered;
        }
      }
    }
    
    // Try to improve assignment
    assignment = new Array(size).fill(-1);
    numAssigned = 0;
    
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (cost[i][j] === 0 && assignment[i] === -1) {
          let canAssign = true;
          for (let k = 0; k < size; k++) {
            if (assignment[k] === j) {
              canAssign = false;
              break;
            }
          }
          if (canAssign) {
            assignment[i] = j;
            numAssigned++;
            break;
          }
        }
      }
    }
  }
  
  return assignment;
}