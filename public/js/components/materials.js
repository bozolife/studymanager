// materials.js - Learning Materials Components
import { logDebug } from '../utils/debug.js';
import { fetchData, postData } from '../api.js';
import { closeModal } from '../ui/modal.js';
import { getCourses } from './courses.js';

// Store for materials data
let materials = [];

// Get all materials
export function getMaterials() {
  return materials;
}

// Load materials from API
export async function loadMaterials() {
  try {
    logDebug('Loading materials...');
    
    // Fetch materials from API
    materials = await fetchData('materials');
    logDebug(`Loaded ${materials.length} materials`);
    
    // Render materials in UI
    renderMaterials();
    return true;
  } catch (error) {
    logDebug(`Error loading materials: ${error.message}`);
    const materialsContainer = document.getElementById('materials-container');
    if (materialsContainer) {
      materialsContainer.innerHTML = '<p>Error loading materials. Please try again.</p>';
    }
    return false;
  }
}

// Load materials for a specific course
export async function loadMaterialsForCourse(courseId) {
  try {
    logDebug(`Loading materials for course ID: ${courseId}`);
    
    // Fetch materials from API
    const courseMaterials = await fetchData(`courses/${courseId}/materials`);
    logDebug(`Loaded ${courseMaterials.length} materials for course`);
    
    return courseMaterials;
  } catch (error) {
    logDebug(`Error loading materials for course: ${error.message}`);
    return [];
  }
}

// Render materials list
export function renderMaterials() {
  const materialsContainer = document.getElementById('materials-container');
  if (!materialsContainer) return;
  
  if (materials.length === 0) {
    materialsContainer.innerHTML = '<p>No learning materials found. Add your first material.</p>';
    return;
  }
  
  let html = '';
  materials.forEach(material => {
    const materialTypeIcon = getMaterialTypeIcon(material.type);
    
    html += `
      <div class="material-item">
        <div class="material-type-icon">
          <i class="${materialTypeIcon}"></i>
        </div>
        <div class="material-info">
          <span class="material-title">${material.title}</span>
          <span class="material-course">${material.course_name || 'Unknown Course'}</span>
          ${material.description ? `<p class="material-description">${material.description}</p>` : ''}
        </div>
        <div class="material-actions">
          ${material.url ? `<a href="${material.url}" target="_blank" class="btn btn-sm">Open</a>` : ''}
          <button class="btn btn-sm btn-danger" onclick="deleteMaterial(${material.id})">Delete</button>
        </div>
      </div>
    `;
  });
  
  materialsContainer.innerHTML = html;
  logDebug('Materials rendered');
}

// Get material type icon
function getMaterialTypeIcon(type) {
  switch (type) {
    case 'book':
      return 'fas fa-book';
    case 'article':
      return 'fas fa-newspaper';
    case 'video':
      return 'fas fa-video';
    case 'website':
      return 'fas fa-globe';
    case 'notes':
      return 'fas fa-sticky-note';
    case 'other':
    default:
      return 'fas fa-file';
  }
}

// Populate courses dropdown for material form
export function populateCoursesDropdownForMaterials() {
  const courseSelect = document.getElementById('material-course');
  if (!courseSelect) return;
  
  const courses = getCourses();
  
  let options = '<option value="">Select a course</option>';
  courses.forEach(course => {
    options += `<option value="${course.id}">${course.name} (${course.code})</option>`;
  });
  
  courseSelect.innerHTML = options;
  logDebug('Courses dropdown for materials populated');
}

// Add a new material
export async function addMaterial(materialData) {
  logDebug('Adding new material:');
  logDebug(materialData);
  
  try {
    // Post material to API
    const material = await postData('materials', materialData);
    logDebug('Material added successfully:');
    logDebug(material);
    
    // Reload materials to get updated data with course names
    await loadMaterials();
    
    // Close modal and reset form
    closeModal('add-material-modal');
    document.getElementById('add-material-form').reset();
    
    alert('Learning material added successfully!');
  } catch (error) {
    logDebug(`Error adding material: ${error.message}`);
    alert(`Error adding learning material: ${error.message}`);
  }
}

// Delete a material
export async function deleteMaterial(materialId) {
  if (!confirm('Are you sure you want to delete this learning material? This action cannot be undone.')) {
    return;
  }
  
  logDebug(`Deleting material ID: ${materialId}`);
  
  try {
    // Delete from API
    const response = await fetch(`/api/materials/${materialId}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete learning material');
    }
    
    // Remove from local array
    materials = materials.filter(material => material.id !== materialId);
    
    // Re-render UI
    renderMaterials();
    
    logDebug('Material deleted successfully');
    alert('Learning material deleted successfully');
  } catch (error) {
    logDebug(`Error deleting material: ${error.message}`);
    alert(`Error deleting learning material: ${error.message}`);
  }
}

// Make functions available globally for onclick handlers
window.deleteMaterial = deleteMaterial;