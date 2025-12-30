import React from 'react'
import Modal from './Modal'
import './FilterModal.css'

const FilterModal = ({ open, onClose, value = 'All', onChange, onSave }) => {
  if (!open) return null

  return (
    <Modal title="Filter" onClose={onClose}>
      <div className="filter-modal">
        <label className="filter-label">Select</label>
        <div className="filter-dropdown">
          <select value={value} onChange={(e) => onChange && onChange(e.target.value)}>
            <option value="Today">Today</option>
            <option value="All">All</option>
          </select>
        </div>

        <button className="filter-save" onClick={() => { onSave && onSave(value); onClose() }}>Save</button>
      </div>
    </Modal>
  )
}

export default FilterModal
