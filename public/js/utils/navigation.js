// navigation.js - Page Navigation
import { logDebug } from './debug.js';

// Initialize navigation
export function initNavigation() {
  const pageLinks = document.querySelectorAll('nav a');
  const pages = document.querySelectorAll('.page');
  
  pageLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const pageId = link.getAttribute('data-page');
      navigateToPage(pageId, link, pageLinks, pages);
    });
  });
  
  logDebug('Navigation initialized');
}

// Navigate to a specific page
export function navigateToPage(pageId, clickedLink, allLinks, allPages) {
  logDebug(`Navigating to ${pageId}`);
  
  // Hide all pages
  allPages.forEach(page => page.classList.remove('active'));
  
  // Show selected page
  document.getElementById(pageId).classList.add('active');
  
  // Update active link
  allLinks.forEach(l => l.classList.remove('active'));
  clickedLink.classList.add('active');
}