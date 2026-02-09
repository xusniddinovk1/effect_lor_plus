/* ========= DATA ========= */
// PIN Code Configuration
const CORRECT_PIN = '1234'; // Change this to your desired PIN

// Disease categories for Adults and Children
const diseaseCategories = {
    KATTALAR: ['BURUN', 'TOMOQ', 'QULOQ', 'ARALASH'],
    BOLALAR: ['BURUN', 'TOMOQ', 'QULOQ', 'ARALASH'],
  };
  
  let selectedCategory = null;
  let selectedDisease = null;
  
  /* ========= PIN LOGIN ========= */
  function checkPin() {
    const pinInput = document.getElementById('pinInput');
    const pinError = document.getElementById('pinError');
    const pinModal = document.getElementById('pinModal');
    const mainContainer = document.getElementById('mainContainer');
    
    const enteredPin = pinInput.value.trim();
    
    if (enteredPin === '') {
      pinError.textContent = 'Iltimos, PIN kodni kiriting.';
      pinError.style.display = 'block';
      return;
    }
    
    if (enteredPin === CORRECT_PIN) {
      // Correct PIN - hide modal and show main content
      pinModal.style.display = 'none';
      mainContainer.style.display = 'block';
      // Store authentication in sessionStorage
      sessionStorage.setItem('pinAuthenticated', 'true');
    } else {
      // Wrong PIN
      pinError.textContent = 'Noto\'g\'ri PIN kod. Qayta urinib ko\'ring.';
      pinError.style.display = 'block';
      pinInput.value = '';
      pinInput.focus();
    }
  }
  
  // Allow Enter key to submit PIN
  document.addEventListener('DOMContentLoaded', () => {
    const pinInput = document.getElementById('pinInput');
    if (pinInput) {
      pinInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          checkPin();
        }
      });
    }
    
    // Check if already authenticated in this session
    if (sessionStorage.getItem('pinAuthenticated') === 'true') {
      document.getElementById('pinModal').style.display = 'none';
      document.getElementById('mainContainer').style.display = 'block';
    }
  });
  
  /* ========= INIT ========= */
  document.addEventListener('DOMContentLoaded', () => {
    // Category button click handlers
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach((button) => {
      button.addEventListener('click', function () {
        selectCategory(this.dataset.category, this);
      });
    });
  
    // Agar birinchi dori item bo‘lsa (HTML’da bor), remove tugmasi bossa ishlaydi
    // (HTML’da onclick bor, shuning uchun bu shart emas)
  });
  
  /* ========= CATEGORY ========= */
  function selectCategory(category, btnEl) {
    selectedCategory = category;
    selectedDisease = null;
  
    // Update active state (category)
    document.querySelectorAll('.category-btn').forEach((btn) => btn.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');
  
    // Show disease section
    const diseaseSection = document.getElementById('diseaseSection');
    diseaseSection.classList.remove('hidden');
  
    // Hide prescription until disease chosen
    const prescriptionSection = document.getElementById('prescriptionSection');
    prescriptionSection.classList.add('hidden');
  
    // Populate disease buttons
    const diseaseButtons = document.getElementById('diseaseButtons');
    diseaseButtons.innerHTML = '';
  
    (diseaseCategories[category] || []).forEach((disease) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'disease-btn';
      button.textContent = disease;
  
      button.addEventListener('click', function () {
        selectDisease(disease, this);
      });
  
      diseaseButtons.appendChild(button);
    });
  }
  
  /* ========= DISEASE ========= */
  function selectDisease(disease, btnEl) {
    selectedDisease = disease;
  
    // Update active state (disease)
    document.querySelectorAll('.disease-btn').forEach((btn) => btn.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');
  
    // Show prescription form
    const prescriptionSection = document.getElementById('prescriptionSection');
    prescriptionSection.classList.remove('hidden');
  
    // Update form fields
    const categoryPretty = selectedCategory
      ? selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1).toLowerCase()
      : '';
  
    document.getElementById('selectedCategory').value = categoryPretty;
    document.getElementById('selectedDisease').value = disease;
  
    // Scroll to form
    prescriptionSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  
  /* ========= MEDICINES ========= */
  function addMedicine() {
    const container = document.getElementById('medicinesContainer');
    const medicineIndex = container.querySelectorAll('.medicine-item').length;
  
    const medicineItem = document.createElement('div');
    medicineItem.className = 'medicine-item';
    medicineItem.setAttribute('data-medicine-index', medicineIndex);
  
    medicineItem.innerHTML = `
      <div class="form-row">
        <div class="form-group">
          <label>DORINING NOMI</label>
          <input type="text" class="medicine-name" placeholder="DORI NOMINI KIRITING" required>
        </div>
  
        <div class="form-group">
          <label>DOZASI</label>
          <input type="text" class="medicine-dosage" placeholder="e.g., 500mg">
        </div>
  
        <div class="form-group">
          <label>MAHAL</label>
          <select class="medicine-frequency" required>
            <option value="">MAHALNI TANLANG</option>
            <option value="BIR MAHAL">BIR MAHAL</option>
            <option value="IKKI MAHAL">IKKI MAHAL</option>
            <option value="UCH MAHAL">UCH MAHAL</option>
            <option value="TO'RT MAHAL">TO'RT MAHAL</option>
            <option value="HAR 6 SOAT">HAR 6 SOAT</option>
            <option value="HAR 8 SOAT">HAR 8 SOAT</option>
            <option value="HOLATIGA QARAB">HOLATIGA QARAB</option>
          </select>
        </div>
  
        <div class="form-group">
          <label>DAVOMIYLIGI</label>
          <input type="text" class="medicine-duration" placeholder="e.g., 7 KUN" required>
        </div>
  
        <button type="button" class="remove-medicine-btn">O'CHIRISH</button>
      </div>
    `;
  
    container.appendChild(medicineItem);
  
    // Remove handler
    medicineItem.querySelector('.remove-medicine-btn').addEventListener('click', function () {
      removeMedicine(this);
    });
  
    // Scroll to new medicine item
    medicineItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  
  function removeMedicine(button) {
    const medicineItem = button.closest('.medicine-item');
    const container = document.getElementById('medicinesContainer');
  
    if (!medicineItem || !container) return;
  
    // Don't allow removing if it's the only medicine item
    if (container.querySelectorAll('.medicine-item').length > 1) {
      medicineItem.remove();
    } else {
      alert("Kamida bitta dori bo'lishi kerak. Avval boshqa dori qo'shing.");
    }
  }
  
  /* ========= RESET ========= */
  function resetForm() {
    if (!confirm("Formani tozalashni xohlaysizmi? Barcha ma'lumotlar o'chadi.")) return;
  
    selectedCategory = null;
    selectedDisease = null;
  
    // Remove active states
    document.querySelectorAll('.category-btn').forEach((btn) => btn.classList.remove('active'));
    document.querySelectorAll('.disease-btn').forEach((btn) => btn.classList.remove('active'));
  
    // Hide sections
    document.getElementById('diseaseSection').classList.add('hidden');
    document.getElementById('prescriptionSection').classList.add('hidden');
  
    // Clear fields
    document.getElementById('patientName').value = '';
    document.getElementById('patientAge').value = '';
    document.getElementById('selectedCategory').value = '';
    document.getElementById('selectedDisease').value = '';
    document.getElementById('instructions').value = '';
  
    // Reset disease buttons area
    const diseaseButtons = document.getElementById('diseaseButtons');
    diseaseButtons.innerHTML = '';
  
    // Reset medicines to exactly ONE empty item (rebuild)
    const container = document.getElementById('medicinesContainer');
  
    container.innerHTML = `
      <h3>DORILAR RO'YHATI</h3>
      <div class="medicine-item" data-medicine-index="0">
        <div class="form-row">
          <div class="form-group">
            <label>DORINING NOMI</label>
            <input type="text" class="medicine-name" placeholder="DORI NOMINI KIRITING" required>
          </div>
  
          <div class="form-group">
            <label>DOZASI</label>
            <input type="text" class="medicine-dosage" placeholder="e.g., 500mg">
          </div>
  
          <div class="form-group">
            <label>MAHAL</label>
            <select class="medicine-frequency" required>
              <option value="">MAHALNI TANLANG</option>
              <option value="BIR MAHAL">BIR MAHAL</option>
              <option value="IKKI MAHAL">IKKI MAHAL</option>
              <option value="UCH MAHAL">UCH MAHAL</option>
              <option value="TO'RT MAHAL">TO'RT MAHAL</option>
              <option value="HAR 6 SOAT">HAR 6 SOAT</option>
              <option value="HAR 8 SOAT">HAR 8 SOAT</option>
              <option value="HOLATIGA QARAB">HOLATIGA QARAB</option>
            </select>
          </div>
  
          <div class="form-group">
            <label>DAVOMIYLIGI</label>
            <input type="text" class="medicine-duration" placeholder="e.g., 7 KUN" required>
          </div>
  
          <button type="button" class="remove-medicine-btn">O'CHIRISH</button>
        </div>
      </div>
    `;
  
    // remove handler for rebuilt first item
    container.querySelector('.remove-medicine-btn').addEventListener('click', function () {
      removeMedicine(this);
    });
  
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  /* ========= PRINT ========= */
  function printPrescription() {
    // Basic validation
    const patientName = document.getElementById('patientName').value.trim();
    const patientAge = document.getElementById('patientAge').value.trim();
  
    if (!patientName || !patientAge) {
      alert("Iltimos, ism-familiya va yoshni kiriting.");
      return;
    }
    if (!selectedCategory || !selectedDisease) {
      alert("Iltimos, bo'lim va kasallik turini tanlang.");
      return;
    }
  
    // Collect medicines
    const medicineItems = document.querySelectorAll('.medicine-item');
    const medicines = [];
  
    medicineItems.forEach((item) => {
      const name = item.querySelector('.medicine-name')?.value.trim() || '';
      const dosage = item.querySelector('.medicine-dosage')?.value.trim() || '';
      const frequency = item.querySelector('.medicine-frequency')?.value || '';
      const duration = item.querySelector('.medicine-duration')?.value.trim() || '';
  
      // dosage optional, qolganlari kerak
      if (name && frequency && duration) {
        medicines.push({ name, dosage, frequency, duration });
      }
    });
  
    if (medicines.length === 0) {
      alert("Kamida bitta dori: Nomi + Mahal + Davomiyligi to'liq bo'lishi kerak.");
      return;
    }
  
    // Fill print template
    const now = new Date();
  
    document.getElementById('printDate').textContent = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  
    document.getElementById('printPatientName').textContent = patientName;
    document.getElementById('printPatientAge').textContent = patientAge;
  
    const categoryPretty = selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1).toLowerCase();
    document.getElementById('printCategory').textContent = categoryPretty;
  
    document.getElementById('printDisease').textContent = selectedDisease;
  
    document.getElementById('printFooterDate').textContent = now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  
    // Populate medicines table (4 columns)
    const medicinesBody = document.getElementById('printMedicinesBody');
    medicinesBody.innerHTML = '';
  
    medicines.forEach((m) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${escapeHtml(m.name)}</td>
        <td>${escapeHtml(m.dosage)}</td>
        <td>${escapeHtml(m.frequency)}</td>
        <td>${escapeHtml(m.duration)}</td>
      `;
      medicinesBody.appendChild(row);
    });
  
    // Instructions
    const instructions = document.getElementById('instructions').value.trim();
    const instructionsDiv = document.getElementById('printInstructions');
    const instructionsText = document.getElementById('printInstructionsText');
  
    if (instructions) {
      instructionsText.textContent = instructions;
      instructionsDiv.style.display = 'block';
    } else {
      instructionsDiv.style.display = 'none';
    }
  
    window.print();
  }
  
  /* ========= HELPERS ========= */
  function escapeHtml(str) {
    return String(str ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }
  