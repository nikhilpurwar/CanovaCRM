import React, { useState } from 'react'
import Modal from './Modal'
import './StatusModal.css'

const StatusModal = ({ open, onClose, onSave, lead }) => {
  const [tooltip, setTooltip] = useState(false)
  const [selected, setSelected] = useState(lead?.status || 'Ongoing')

  React.useEffect(()=>{
    setSelected(lead?.status || 'Ongoing')
    setTooltip(false)
  },[lead])

  if (!open) return null

  const handleSave = () => {
    if(onSave){
      const ok = onSave(selected)
      if(ok === false){
        setTooltip(true)
        return
      }
    }
    onClose && onClose()
  }

  return (
    <Modal title="Lead Status" onClose={onClose}>
      <div className="status-modal">
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <select className="status-select" value={selected} onChange={(e)=>setSelected(e.target.value)}>
            <option>Ongoing</option>
            <option>Closed</option>
          </select>
          <button className="info-btn" onClick={() => setTooltip(!tooltip)}>i</button>
        </div>

        {tooltip && <div className="status-tooltip">Lead can not be closed if scheduled</div>}

        <button className="status-save" onClick={handleSave}>Save</button>
      </div>
    </Modal>
  )
}

export default StatusModal
