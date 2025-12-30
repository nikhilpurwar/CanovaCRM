import React from 'react'
import './Modal.css'

const Modal = ({ title, children, onClose }) => {
  return (
    <div className="crm-modal-backdrop" onClick={onClose}>
      <div className="crm-modal" onClick={(e) => e.stopPropagation()}>
        {title && <div className="crm-modal-title">{title}</div>}
        <div className="crm-modal-body">{children}</div>
      </div>
    </div>
  )
}

export default Modal
