import { Link } from 'react-router-dom'

const informationLinks = [
  { label: 'Resources', to: '/resources' },
  { label: 'About Us', to: '/about' },
  { label: 'Contact Us', to: '/contact' },
]

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-col footer-info">
        <div>
          <p className="col-title">INOUT ENTERPRISE PTE LTD</p>
          <p>28D Woodlands Industrial Park E5 Blk 1, #09-51</p>
          <p>Harvest@Woodlands</p>
          <p>Singapore 757322</p>
        </div>
        <div>
          <p>Phone: (65) 6276 6123</p>
          <a href="mailto:sales@inout.com.sg">sales@inout.com.sg</a>
        </div>
        <p className="footer-copy">© inout.com.sg all rights reserved</p>
      </div>
      <div className="footer-col">
        <p className="col-title">INFORMATION</p>
        {informationLinks.map((l) => (
          <Link key={l.to} to={l.to}>
            {l.label}
          </Link>
        ))}
      </div>
    </footer>
  )
}
