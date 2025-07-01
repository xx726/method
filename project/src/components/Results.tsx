import React from 'react';
import { MatchingResult } from '../types';
import { ArrowLeft, Download, Trophy, TrendingUp, TrendingDown } from 'lucide-react';

interface ResultsProps {
  results: MatchingResult;
  onReset: () => void;
}

const Results: React.FC<ResultsProps> = ({ results, onReset }) => {
  const { pairs, totalWeight, matchingType, rowLabels, colLabels } = results;

  const exportResults = () => {
    const csvContent = [
      ['Asignación', 'Fila', 'Columna', 'Peso'],
      ...pairs.map((pair, index) => [
        `Asignación ${index + 1}`,
        pair.row,
        pair.col,
        pair.weight.toString()
      ]),
      ['', '', 'Total:', totalWeight.toString()]
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resultados_algoritmo_hungaro.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              matchingType === 'min' 
                ? 'bg-green-100 text-green-600' 
                : 'bg-blue-100 text-blue-600'
            }`}>
              {matchingType === 'min' ? <TrendingDown size={24} /> : <TrendingUp size={24} />}
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Asignación Óptima Encontrada
              </h2>
              <p className="text-gray-600">
                Solución de {matchingType === 'min' ? 'costo mínimo' : 'beneficio máximo'}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={exportResults}
              className="btn-secondary flex items-center gap-2"
            >
              <Download size={16} />
              Exportar CSV
            </button>
            <button
              onClick={onReset}
              className="btn-primary flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Nuevo Problema
            </button>
          </div>
        </div>

        {/* Total Weight Display */}
        <div className={`p-6 rounded-lg border-2 ${
          matchingType === 'min' 
            ? 'bg-green-50 border-green-200' 
            : 'bg-blue-50 border-blue-200'
        }`}>
          <div className="flex items-center gap-3">
            <Trophy className={`${
              matchingType === 'min' ? 'text-green-600' : 'text-blue-600'
            }`} size={32} />
            <div>
              <h3 className={`text-lg font-medium ${
                matchingType === 'min' ? 'text-green-900' : 'text-blue-900'
              }`}>
                {matchingType === 'min' ? 'Costo Total' : 'Beneficio Total'}
              </h3>
              <p className={`text-3xl font-bold ${
                matchingType === 'min' ? 'text-green-700' : 'text-blue-700'
              }`}>
                {totalWeight}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Assignment Details */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Detalles de Asignación</h3>
        
        <div className="grid gap-4">
          {pairs.map((pair, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {pair.row} → {pair.col}
                  </div>
                  <div className="text-sm text-gray-600">
                    Asignación {index + 1}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900">
                  {pair.weight}
                </div>
                <div className="text-sm text-gray-600">
                  {matchingType === 'min' ? 'Costo' : 'Beneficio'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Table */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Matriz de Asignación</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-3 font-medium text-gray-600"></th>
                {colLabels.map((label, index) => (
                  <th key={index} className="text-center p-3 font-medium text-gray-600">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rowLabels.map((rowLabel, rowIndex) => (
                <tr key={rowIndex} className="border-b border-gray-100">
                  <td className="p-3 font-medium text-gray-700">{rowLabel}</td>
                  {colLabels.map((colLabel, colIndex) => {
                    const assignment = pairs.find(
                      pair => pair.row === rowLabel && pair.col === colLabel
                    );
                    return (
                      <td key={colIndex} className="p-3 text-center">
                        {assignment ? (
                          <div className="inline-flex items-center justify-center w-8 h-8 bg-primary-600 text-white rounded-full text-sm font-medium">
                            ✓
                          </div>
                        ) : (
                          <div className="w-8 h-8"></div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Results;