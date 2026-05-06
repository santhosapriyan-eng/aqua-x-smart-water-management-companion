/* Enhanced Map Page Styles */
@import "./base.css";

.map-container {
  position: relative;
  height: calc(100vh - 80px);
  width: 100%;
  overflow: hidden;
}

#map {
  height: 100%;
  width: 100%;
  background: var(--bg-dark);
}

/* Enhanced Map Controls */
.map-controls {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 320px;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: 15px;
  padding: 20px;
  z-index: 1000;
  box-shadow: var(--glass-shadow);
  transition: transform 0.3s ease;
  max-height: calc(100vh - 140px);
  overflow-y: auto;
}

.map-controls.active {
  transform: translateX(0);
}

.control-section {
  margin-bottom: 25px;
}

.control-section:last-child {
  margin-bottom: 0;
}

.control-section h3 {
  color: var(--text-light);
  margin-bottom: 15px;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.control-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 15px;
}

.control-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 12px 8px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid var(--glass-border);
  border-radius: 10px;
  color: var(--text-light);
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  min-height: 60px;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  border-color: var(--primary-light);
}

.control-btn.active {
  background: var(--primary-blue);
  border-color: var(--primary-blue);
  box-shadow: 0 4px 15px rgba(0, 102, 204, 0.3);
}

.control-btn.primary { background: var(--primary-blue); }
.control-btn.accent { background: var(--accent-teal); }
.control-btn.success { background: var(--success); }
.control-btn.info { background: var(--primary-blue); }
.control-btn.warning { background: var(--warning); color: var(--text-dark); }

.control-btn .btn-icon {
  font-size: 20px;
}

.control-btn .btn-text {
  font-size: 0.8rem;
  font-weight: 500;
}

/* Filter Groups */
.filter-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.filter-option:hover {
  background: rgba(255, 255, 255, 0.1);
}

.filter-indicator {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.filter-indicator.leak { background: #3498db; }
.filter-indicator.contamination { background: #e74c3c; }
.filter-indicator.low-pressure { background: #f39c12; }
.filter-indicator.maintenance { background: #9b59b6; }

.filter-option input:checked + .filter-indicator {
  border-color: var(--primary-light);
  transform: scale(1.1);
}

/* Toggle Groups */
.toggle-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.toggle-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.toggle-option:hover {
  background: rgba(255, 255, 255, 0.1);
}

.toggle-slider {
  width: 40px;
  height: 20px;
  background: var(--glass-border);
  border-radius: 10px;
  position: relative;
  transition: background-color 0.3s ease;
}

.toggle-slider::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  background: white;
  border-radius: 50%;
  transition: transform 0.3s ease;
}

.toggle-option input:checked + .toggle-slider {
  background: var(--primary-light);
}

.toggle-option input:checked + .toggle-slider::before {
  transform: translateX(