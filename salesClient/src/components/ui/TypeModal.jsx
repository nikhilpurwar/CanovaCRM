import React from 'react'
import Modal from './Modal'
import './TypeModal.css'

const TypeModal = ({ open, onClose, onSelect, lead }) => {
  if (!open) return null

  return (
    <Modal title="Type" onClose={onClose}>
      <div className="type-modal">
        <button className="type-pill hot" onClick={() => { onSelect && onSelect('Hot', lead); onClose() }}>Hot</button>
        <button className="type-pill warm" onClick={() => { onSelect && onSelect('Warm', lead); onClose() }}>Warm</button>
        <button className="type-pill cold" onClick={() => { onSelect && onSelect('Cold', lead); onClose() }}>Cold</button>
      </div>
    </Modal>
  )
}

export default TypeModal
