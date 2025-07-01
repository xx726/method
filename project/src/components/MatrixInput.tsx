import React, { useState } from 'react';
import { Plus, Minus, Calculator, Info } from 'lucide-react';

interface MatrixInputProps {
  onCalculate: (
    matrix: number[][],
    rowLabels: string[],
    colLabels: string[],
    matchingType: 'max' | 'min'
  ) => void;
  isCalculating: boolean;
}

const MatrixInput: React.FC<MatrixInputProps> = ({ onCalculate, isCalculating }) => {
  const [size, setSize] = useState({ rows: 3, cols: 3 });
  const [matrix, setMatrix] = useState<number[][]>([
    [4, 2, 8],
    [4, 3, 7],
    [3, 1, 6]
  ]);
  const [rowLabels, setRowLabels] = useState<string[]>(['Trabajador 1', 'Trabajador 2', 'Trabajador 3']);
  const [colLabels, setColLabels] = useState<string[]>(['Tarea A', 'Tarea B', 'Tarea C']);
  const [matchingType, setMatchingType] = useState<'max' | 'min'>('min');
  const [showExample, setShowExample] = useState(false);

  const updateMatrixSize = (newRows: number, newCols: number) => {
    const newMatrix = Array(newRows).fill(null).map((_, i) => 
      Array(newCols).fill(null).map((_, j) => 
        matrix[i]?.[j] ?? 0
      )
    );
    
    const newRowLabels = Array(newRows).fill(null).map((_, i) => 
      rowLabels[i] ?? `Fila ${i + 1}`
    );
    
    const newColLabels = Array(newCols).fill(null).map((_, i) => 
      colLabels[i] ?? `Col ${i + 1}`
    );

    setMatrix(newMatrix);
    setRowLabels(newRowLabels);
    setColLabels(newColLabels);
    setSize({ rows: newRows, cols: newCols });
  };

  const updateCell = (row: number, col: number, value: string) => {
    const numValue = parseFloat(value) || 0;
    const newMatrix = [...matrix];
    newMatrix[row][col] = numValue;
    setMatrix(newMatrix);
  };

  const updateRowLabel = (index: number, value: string) => {
    const newLabels = [...rowLabels];
    newLabels[index] = value;
    setRowLabels(newLabels);
  };

  const updateColLabel = (index: number, value: string) => {
    const newLabels = [...colLabels];
    newLabels[index] = value;
    setColLabels(newLabels);
  };

  const loadExample = () => {
    setSize({ rows: 4, cols: 4 });
    setMatrix([
      [10, 19, 8, 15],
      [10, 18, 7, 17],
      [13, 16, 9, 14],
      [12, 19, 8, 18]
    ]);
    setRowLabels(['Alicia', 'Roberto', 'Carlos', 'Diana']);
    setColLabels(['Proyecto A', 'Proyecto B', 'Proyecto C', 'Proyecto D']);
    setMatchingType('min');
    setShowExample(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate(matrix, rowLabels, colLabels, matchingType);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Algoritmo Húngaro</h2>
        <button
          type="button"
          onClick={() => setShowExample(!showExample)}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors"
        >
          <Info size={20} />
          Ejemplo
        </button>
      </div>

      {showExample && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-medium text-blue-900 mb-2">Ejemplo: Asignación de Proyectos</h3>
          <p className="text-blue-800 text-sm mb-3">
            Asigna 4 empleados a 4 proyectos. La matriz muestra las horas estimadas que cada persona 
            necesitaría para completar cada proyecto. Encuentra la asignación que minimiza el total de horas.
          </p>
          <button
            onClick={loadExample}
            className="btn-primary text-sm"
          >
            Cargar Ejemplo
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Matrix Size Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de Filas
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => size.rows > 2 && updateMatrixSize(size.rows - 1, size.cols)}
                className="p-1 rounded bg-gray-100 hover:bg-gray-200 transition-colors"
                disabled={size.rows <= 2}
              >
                <Minus size={16} />
              </button>
              <span className="w-12 text-center font-medium">{size.rows}</span>
              <button
                type="button"
                onClick={() => size.rows < 8 && updateMatrixSize(size.rows + 1, size.cols)}
                className="p-1 rounded bg-gray-100 hover:bg-gray-200 transition-colors"
                disabled={size.rows >= 8}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de Columnas
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => size.cols > 2 && updateMatrixSize(size.rows, size.cols - 1)}
                className="p-1 rounded bg-gray-100 hover:bg-gray-200 transition-colors"
                disabled={size.cols <= 2}
              >
                <Minus size={16} />
              </button>
              <span className="w-12 text-center font-medium">{size.cols}</span>
              <button
                type="button"
                onClick={() => size.cols < 8 && updateMatrixSize(size.rows, size.cols + 1)}
                className="p-1 rounded bg-gray-100 hover:bg-gray-200 transition-colors"
                disabled={size.cols >= 8}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Objetivo de Optimización
            </label>
            <select
              value={matchingType}
              onChange={(e) => setMatchingType(e.target.value as 'max' | 'min')}
              className="input-field"
            >
              <option value="min">Minimizar (Costo)</option>
              <option value="max">Maximizar (Beneficio)</option>
            </select>
          </div>
        </div>

        {/* Row Labels */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Etiquetas de Filas (ej. Trabajadores, Personas, Recursos)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {rowLabels.map((label, index) => (
              <input
                key={index}
                type="text"
                value={label}
                onChange={(e) => updateRowLabel(index, e.target.value)}
                className="input-field text-sm"
                placeholder={`Fila ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Column Labels */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Etiquetas de Columnas (ej. Tareas, Trabajos, Asignaciones)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {colLabels.map((label, index) => (
              <input
                key={index}
                type="text"
                value={label}
                onChange={(e) => updateColLabel(index, e.target.value)}
                className="input-field text-sm"
                placeholder={`Col ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Matrix Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {matchingType === 'min' ? 'Matriz de Costos' : 'Matriz de Beneficios'}
          </label>
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              <table className="border-collapse">
                <thead>
                  <tr>
                    <th className="w-24"></th>
                    {colLabels.map((label, index) => (
                      <th key={index} className="p-2 text-xs font-medium text-gray-600 text-center">
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {matrix.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      <td className="p-2 text-xs font-medium text-gray-600 text-right pr-4">
                        {rowLabels[rowIndex]}
                      </td>
                      {row.map((cell, colIndex) => (
                        <td key={colIndex} className="p-1">
                          <input
                            type="number"
                            value={cell}
                            onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                            className="matrix-cell"
                            step="0.1"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-4">
          <button
            type="submit"
            disabled={isCalculating}
            className="btn-primary flex items-center gap-2 px-8 py-3 text-lg"
          >
            <Calculator size={20} />
            {isCalculating ? 'Calculando...' : 'Resolver Problema de Asignación'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MatrixInput;