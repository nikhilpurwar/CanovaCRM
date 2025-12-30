import React from 'react'
import Modal from './Modal'
import './DateTimeModal.css'

const DateTimeModal = ({ open, onClose, onSave, lead }) => {
  const [date, setDate] = React.useState(lead?.scheduledDate || '')
  const [time, setTime] = React.useState(lead?.scheduledTime || '')

  React.useEffect(() => {
    setDate(lead?.scheduledDate || '')
    setTime(lead?.scheduledTime || '')
  }, [lead])

  if (!open) return null

  return (
    <Modal title="Date & Time" onClose={onClose}>
      <div className="dt-modal">
        <label>Date</label>
        <input placeholder="dd/mm/yy" className="dt-input" value={date} onChange={(e)=>setDate(e.target.value)} />

        <label>Time</label>
        <input placeholder="02:30PM" className="dt-input" value={time} onChange={(e)=>setTime(e.target.value)} />

        <button className="dt-save" onClick={() => { onSave && onSave({date,time}); onClose() }}>Save</button>
      </div>
    </Modal>
  )
}

export default DateTimeModal
