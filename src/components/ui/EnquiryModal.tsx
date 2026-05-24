import { useEnquiryModal } from '../../contexts/EnquiryModalContext'

export function EnquiryModal() {
  const { isOpen, product, closeModal } = useEnquiryModal()

  if (!isOpen) return null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    alert('Thank you! Your enquiry has been submitted. We will contact you within 1–2 business days.')
    closeModal()
  }

  return (
    <div className="modal-overlay open" onClick={(e) => e.target === e.currentTarget && closeModal()}>
      <div className="modal-box enquiry-modal-box">
        <button className="modal-close" onClick={closeModal} aria-label="Close">
          &times;
        </button>
        <h2 className="modal-title">Product Enquiry</h2>
        {product && (
          <p style={{ fontSize: 14, color: '#666', marginBottom: 20 }}>Regarding: {product.name}</p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Name</label>
              <input type="text" placeholder="Your name" required />
            </div>
            <div className="form-group">
              <label>Company</label>
              <input type="text" placeholder="Company name" />
            </div>
          </div>
          <div className="form-row" style={{ marginTop: 10 }}>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="email@company.com" required />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input type="tel" placeholder="+65 xxxx xxxx" />
            </div>
          </div>
          <div className="form-group" style={{ marginTop: 10 }}>
            <label>Message</label>
            <textarea
              placeholder="Tell us your requirements…"
              defaultValue={product ? `I would like to enquire about: ${product.name}` : ''}
            />
          </div>
          <button
            type="submit"
            className="btn-primary"
            style={{ marginTop: 16, width: '100%', height: 44, fontSize: 15 }}
          >
            Send Enquiry
          </button>
        </form>
      </div>
    </div>
  )
}
