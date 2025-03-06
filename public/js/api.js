// api.js - API Communication Module
import { logDebug, setDebugStatus } from './utils/debug.js';

// API base URL
export const API_URL = 'http://localhost:3000/api';

// Test API connectivity
export async function testAPI() {
  try {
    // Test courses endpoint
    const response = await fetch(`${API_URL}/courses`);
    if (response.ok) {
      setDebugStatus(true, 'API connection successful');
      return true;
    } else {
      setDebugStatus(false, `API error: ${response.status} ${response.statusText}`);
      return false;
    }
  } catch (error) {
    setDebugStatus(false, `API connection failed: ${error.message}`);
    return false;
  }
}

// Generic GET request
export async function fetchData(endpoint) {
  try {
    logDebug(`Fetching data from ${endpoint}...`);
    const response = await fetch(`${API_URL}/${endpoint}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    logDebug(`Successfully fetched data from ${endpoint}`);
    return data;
  } catch (error) {
    logDebug(`Error fetching from ${endpoint}: ${error.message}`);
    throw error;
  }
}

// Generic POST request
export async function postData(endpoint, data) {
  try {
    logDebug(`Posting data to ${endpoint}...`);
    const response = await fetch(`${API_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const responseData = await response.json();
    logDebug(`Successfully posted data to ${endpoint}`);
    return responseData;
  } catch (error) {
    logDebug(`Error posting to ${endpoint}: ${error.message}`);
    throw error;
  }
}