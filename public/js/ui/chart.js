// chart.js - Chart Initialization and Rendering
import { logDebug } from '../utils/debug.js';

// Initialize study time chart
export function initStudyTimeChart() {
  try {
    const ctx = document.getElementById('study-time-chart');
    if (!ctx) {
      logDebug('Study time chart canvas not found');
      return;
    }
    
    // Check if Chart is available
    if (typeof Chart === 'undefined') {
      logDebug('Chart.js library not loaded');
      return;
    }
    
    const ctxContext = ctx.getContext('2d');
    
    // Sample data - In a real app, this would come from an API
    const data = getSampleStudyData();
    
    new Chart(ctxContext, {
      type: 'line',
      data: data,
      options: getChartOptions()
    });
    
    logDebug('Study time chart initialized');
  } catch (error) {
    logDebug(`Error initializing chart: ${error.message}`);
    // Don't let chart errors stop the rest of the app
  }
}

// Get sample study data
function getSampleStudyData() {
  return {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Hours Studied',
      data: [2, 3.5, 1, 4.5, 2.5, 5, 1.5],
      backgroundColor: 'rgba(52, 152, 219, 0.3)',
      borderColor: 'rgba(52, 152, 219, 1)',
      borderWidth: 2,
      tension: 0.3,
      fill: true
    }]
  };
}

// Get chart options
function getChartOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Hours'
        }
      }
    }
  };
}