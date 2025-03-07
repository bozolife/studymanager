/**
 * Pixelated Charts
 * Custom Chart.js configuration for pixelated 3D visuals
 */

// Initialize all charts with pixelated styling
export function initializePixelCharts() {
    document.addEventListener('DOMContentLoaded', () => {
      // Override Chart.js defaults for pixelated style
      if (window.Chart) {
        setPixelChartDefaults();
        
        // Initialize study time chart
        initStudyTimeChart();
      } else {
        console.error('Chart.js not loaded');
      }
    });
  }
  
  // Set pixelated theme defaults for all charts
  function setPixelChartDefaults() {
    Chart.defaults.font.family = "'Inter', 'Roboto', sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.color = '#333';
    Chart.defaults.layout.padding = 10;
    Chart.defaults.elements.bar.borderWidth = 2;
    Chart.defaults.elements.line.borderWidth = 3;
    Chart.defaults.elements.point.radius = 5;
    Chart.defaults.elements.point.hitRadius = 10;
    Chart.defaults.elements.point.borderWidth = 2;
    
    // Custom plugin for pixelated styling
    const pixelatedPlugin = {
      id: 'pixelated',
      beforeDraw: (chart) => {
        const ctx = chart.ctx;
        ctx.imageSmoothingEnabled = false; // This makes things pixelated
        ctx.mozImageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.msImageSmoothingEnabled = false;
      }
    };
    
    // Add plugin to Chart.js defaults
    Chart.register(pixelatedPlugin);
  }
  
  // Initialize study time chart
  function initStudyTimeChart() {
    const ctx = document.getElementById('study-time-chart');
    if (!ctx) return;
    
    // Sample data - replace with real data in production
    const data = {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Study Hours',
          data: [2.5, 3.7, 1.2, 4.0, 2.8, 6.1, 3.4],
          backgroundColor: createGradient(ctx, '#4361ee', '#3f37c9'),
          borderColor: '#1a1a2e',
          borderWidth: 2,
          barThickness: 15,
          borderRadius: 0 // Sharp edges for pixel style
        }
      ]
    };
    
    // Chart configuration with 3D pixelated style
    const chart = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        animation: {
          duration: 1000,
          easing: 'easeOutQuart'
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#1a1a2e',
            titleFont: {
              family: "'Press Start 2P', monospace",
              size: 10
            },
            bodyFont: {
              family: "'Inter', sans-serif",
              size: 12
            },
            padding: 10,
            cornerRadius: 0, // Sharp corners for pixel style
            titleMarginBottom: 8,
            callbacks: {
              label: function(context) {
                return `${context.raw} hours`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            border: {
              width: 2,
              color: '#1a1a2e'
            },
            ticks: {
              font: {
                family: "'Inter', sans-serif"
              }
            }
          },
          y: {
            grid: {
              color: 'rgba(0, 0, 0, 0.05)',
              lineWidth: 1
            },
            border: {
              width: 2,
              color: '#1a1a2e'
            },
            ticks: {
              font: {
                family: "'Inter', sans-serif"
              },
              callback: function(value) {
                return value + 'h';
              }
            }
          }
        }
      }
    });
    
    // Add 3D shadow effect to bars
    addShadowEffect(chart);
  }
  
  // Create gradient for chart backgrounds
  function createGradient(ctx, colorStart, colorEnd) {
    if (!ctx) return colorStart;
    
    const chartArea = ctx.parentNode.getBoundingClientRect();
    const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, chartArea.height);
    gradient.addColorStop(0, colorStart);
    gradient.addColorStop(1, colorEnd);
    return gradient;
  }
  
  // Add 3D shadow effect to chart bars
  function addShadowEffect(chart) {
    const originalDraw = chart.draw;
    
    chart.draw = function() {
      const ctx = chart.ctx;
      
      // Draw shadow first
      chart.data.datasets.forEach((dataset, i) => {
        const meta = chart.getDatasetMeta(i);
        
        meta.data.forEach((bar) => {
          const { x, y, width, height } = bar.getProps(['x', 'y', 'width', 'height']);
          
          if (!height) return; // Skip if no height (e.g., value is 0)
          
          ctx.save();
          ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
          ctx.fillRect(x + 3, y + 3, width, height);
          ctx.restore();
        });
      });
      
      // Draw the chart as usual
      originalDraw.apply(this, arguments);
      
      // Add pixel highlights to bars
      chart.data.datasets.forEach((dataset, i) => {
        const meta = chart.getDatasetMeta(i);
        
        meta.data.forEach((bar) => {
          const { x, y, width, height } = bar.getProps(['x', 'y', 'width', 'height']);
          
          if (!height) return; // Skip if no height
          
          // Add highlight at the top
          ctx.save();
          ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.fillRect(x, y, width, 2);
          ctx.fillRect(x, y, 2, height);
          ctx.restore();
        });
      });
    };
  }
  
  // Export function to create custom pixelated chart
  export function createPixelatedChart(elementId, type, data, options = {}) {
    const ctx = document.getElementById(elementId);
    if (!ctx) {
      console.error(`Element with id '${elementId}' not found`);
      return null;
    }
    
    // Merge options with pixelated defaults
    const mergedOptions = {
      responsive: true,
      animation: {
        duration: 800,
        easing: 'easeOutQuart'
      },
      plugins: {
        tooltip: {
          backgroundColor: '#1a1a2e',
          titleFont: {
            family: "'Press Start 2P', monospace",
            size: 10
          },
          bodyFont: {
            family: "'Inter', sans-serif",
            size: 12
          },
          padding: 10,
          cornerRadius: 0
        },
        legend: {
          labels: {
            font: {
              family: "'Inter', sans-serif"
            },
            boxWidth: 15,
            boxHeight: 15
          }
        }
      },
      ...options
    };
    
    const chart = new Chart(ctx, {
      type: type,
      data: data,
      options: mergedOptions
    });
    
    // Add shadow effect if it's a bar chart
    if (type === 'bar') {
      addShadowEffect(chart);
    }
    
    return chart;
  }