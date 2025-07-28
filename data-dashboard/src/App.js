import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, ScatterChart, Scatter, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [chartType, setChartType] = useState('line');
  const [dataPoints, setDataPoints] = useState(50);
  const [noiseLevel, setNoiseLevel] = useState(20);
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({});
  const [matrixResult, setMatrixResult] = useState('');

  // NumPy-like functions
  const generateNormal = (mean, std, size) => 
    Array.from({length: size}, () => mean + std * (Math.random() - 0.5) * 2);
  
  const mean = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
  const std = arr => Math.sqrt(arr.reduce((sum, x) => sum + Math.pow(x - mean(arr), 2), 0) / arr.length);
  const correlate = (arr1, arr2) => {
    const mean1 = mean(arr1), mean2 = mean(arr2);
    const num = arr1.reduce((sum, val, i) => sum + (val - mean1) * (arr2[i] - mean2), 0);
    const den = Math.sqrt(arr1.reduce((sum, val) => sum + Math.pow(val - mean1, 2), 0) * 
                          arr2.reduce((sum, val) => sum + Math.pow(val - mean2, 2), 0));
    return num / den;
  };

  const generateData = () => {
    const productA = generateNormal(100, noiseLevel, dataPoints);
    const productB = generateNormal(80, noiseLevel * 0.8, dataPoints);
    const productC = generateNormal(60, noiseLevel * 0.6, dataPoints);
    const temperature = generateNormal(20, 8, dataPoints);
    const regions = ['North', 'South', 'East', 'West'];

    const newData = Array.from({length: dataPoints}, (_, i) => ({
      index: i + 1,
      productA: Math.max(0, Math.round(productA[i])),
      productB: Math.max(0, Math.round(productB[i])),
      productC: Math.max(0, Math.round(productC[i])),
      temperature: temperature[i].toFixed(1),
      region: regions[Math.floor(Math.random() * 4)],
      total: Math.round(productA[i] + productB[i] + productC[i])
    }));

    setData(newData);
    
    const totals = newData.map(d => d.total);
    const temps = newData.map(d => parseFloat(d.temperature));
    
    setStats({
      mean: mean(totals).toFixed(2),
      std: std(totals).toFixed(2),
      correlation: correlate(totals, temps).toFixed(3),
      count: dataPoints
    });
  };

  const runMatrixOps = () => {
    const A = [[1, 2], [3, 4]];
    const B = [[5, 6], [7, 8]];
    const product = A.map((row, i) => 
      B[0].map((_, j) => row.reduce((sum, val, k) => sum + val * B[k][j], 0))
    );
    
    const randomMatrix = Array.from({length: 3}, () => 
      Array.from({length: 3}, () => Math.random().toFixed(3))
    );
    
    setMatrixResult(`Matrix A × B = [[${product[0].join(', ')}], [${product[1].join(', ')}]]
Random 3×3 Matrix:
${randomMatrix.map(row => '[' + row.join(', ') + ']').join('\n')}`);
  };

  useEffect(() => {
    generateData();
  }, [dataPoints, noiseLevel]);

  const chartColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c'];
  
  const salesData = [
    { name: 'Product A', value: mean(data.map(d => d.productA)).toFixed(0) },
    { name: 'Product B', value: mean(data.map(d => d.productB)).toFixed(0) },
    { name: 'Product C', value: mean(data.map(d => d.productC)).toFixed(0) }
  ];

  const regionData = data.reduce((acc, d) => {
    acc[d.region] = (acc[d.region] || 0) + d.total;
    return acc;
  }, {});
  
  const pieData = Object.entries(regionData).map(([name, value]) => ({ name, value }));

  const renderChart = () => {
    const commonProps = { width: '100%', height: 300 };
    
    switch(chartType) {
      case 'bar':
        return (
          <ResponsiveContainer {...commonProps}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer {...commonProps}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                {pieData.map((_, index) => <Cell key={index} fill={chartColors[index]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      case 'scatter':
        return (
          <ResponsiveContainer {...commonProps}>
            <ScatterChart data={data}>
              <CartesianGrid />
              <XAxis dataKey="temperature" name="Temperature" />
              <YAxis dataKey="total" name="Sales" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name="Sales vs Temp" data={data} fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
        );
      default:
        return (
          <ResponsiveContainer {...commonProps}>
            <LineChart data={data.slice(0, 30)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="index" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="productA" stroke="#8884d8" strokeWidth={2} />
              <Line type="monotone" dataKey="productB" stroke="#82ca9d" strokeWidth={2} />
              <Line type="monotone" dataKey="productC" stroke="#ffc658" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 text-center">
          <h1 className="text-4xl font-bold mb-2">🚀 Interactive Data Dashboard</h1>
          <p className="text-lg opacity-90">NumPy + Pandas + React Analytics</p>
        </div>

        {/* Controls */}
        <div className="p-6 bg-gray-50 border-b">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Chart Type</label>
              <select 
                value={chartType} 
                onChange={(e) => setChartType(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option value="line">Line Chart</option>
                <option value="bar">Bar Chart</option>
                <option value="pie">Pie Chart</option>
                <option value="scatter">Scatter Plot</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Data Points: {dataPoints}</label>
              <input 
                type="range" 
                min="10" 
                max="100" 
                value={dataPoints}
                onChange={(e) => setDataPoints(parseInt(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Noise Level: {noiseLevel}</label>
              <input 
                type="range" 
                min="5" 
                max="50" 
                value={noiseLevel}
                onChange={(e) => setNoiseLevel(parseInt(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
            
            <div className="flex items-end">
              <button 
                onClick={runMatrixOps}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                🔢 Matrix Ops
              </button>
            </div>
          </div>
          
          <button 
            onClick={generateData}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            🎲 Generate New Data
          </button>
        </div>

        {/* Stats */}
        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl text-center">
            <div className="text-2xl font-bold">{stats.mean}</div>
            <div className="text-sm opacity-90">Mean Sales</div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl text-center">
            <div className="text-2xl font-bold">{stats.std}</div>
            <div className="text-sm opacity-90">Std Deviation</div>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-xl text-center">
            <div className="text-2xl font-bold">{stats.correlation}</div>
            <div className="text-sm opacity-90">Correlation</div>
          </div>
          <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-4 rounded-xl text-center">
            <div className="text-2xl font-bold">{stats.count}</div>
            <div className="text-sm opacity-90">Data Points</div>
          </div>
        </div>

        {/* Chart */}
        <div className="p-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
              📊 {chartType.charAt(0).toUpperCase() + chartType.slice(1)} Visualization
            </h3>
            {renderChart()}
          </div>
        </div>

        {/* Matrix Results */}
        {matrixResult && (
          <div className="p-6 pt-0">
            <div className="bg-gray-900 text-green-400 p-6 rounded-xl font-mono text-sm">
              <h4 className="text-lg font-bold mb-3 text-white">🔢 Matrix Operations Output:</h4>
              <pre className="whitespace-pre-wrap">{matrixResult}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;