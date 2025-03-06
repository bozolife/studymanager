// debug.js - Debug Utilities
// Log message to debug console
export function logDebug(message) {
    console.log(message);
    const log = document.getElementById('debug-log');
    if (log) {
      const timestamp = new Date().toISOString().split('T')[1].substring(0, 8);
      if (typeof message === 'object') {
        log.innerHTML += `<pre>[${timestamp}] ${JSON.stringify(message, null, 2)}</pre>`;
      } else {
        log.innerHTML += `<p>[${timestamp}] ${message}</p>`;
      }
      
      // Auto-scroll to bottom
      log.scrollTop = log.scrollHeight;
    }
  }
  
  // Set debug status
  export function setDebugStatus(success, message) {
    const panel = document.getElementById('debug-panel');
    const status = document.getElementById('debug-status');
    
    if (panel && status) {
      if (success) {
        panel.classList.add('success');
        status.innerHTML = `✅ ${message}`;
      } else {
        panel.classList.remove('success');
        status.innerHTML = `❌ ${message}`;
      }
    }
  }
  
  // Initialize debug panel toggle
  export function initDebugPanel() {
    const toggleDebug = document.getElementById('toggle-debug');
    const debugPanel = document.getElementById('debug-panel');
    
    if (toggleDebug && debugPanel) {
      toggleDebug.addEventListener('click', function(e) {
        e.preventDefault();
        if (debugPanel.style.display === 'none') {
          debugPanel.style.display = 'block';
          toggleDebug.textContent = 'Hide Debug Panel';
        } else {
          debugPanel.style.display = 'none';
          toggleDebug.textContent = 'Show Debug Panel';
        }
      });
    }
    
    logDebug('Debug panel initialized');
  }