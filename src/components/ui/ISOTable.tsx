const fedRows = ['1', '10', '100', '1K', '10K', '100K']
const isoRows = ['3', '4', '5', '6', '7', '8']
const gmpRows = ['A/B', 'C', 'D']
const highlightedFed = [3, 4, 5]
const highlightedIso = [3, 4, 5]

export function ISOTable() {
  return (
    <div className="iso-table">
      <div className="iso-row">
        <div className="iso-cell header">FED</div>
        {fedRows.map((v, i) => (
          <div key={v} className={`iso-cell${highlightedFed.includes(i) ? ' highlight' : ''}`}>
            {v}
          </div>
        ))}
      </div>
      <div className="iso-row">
        <div className="iso-cell header">ISO</div>
        {isoRows.map((v, i) => (
          <div key={v} className={`iso-cell${highlightedIso.includes(i) ? ' highlight' : ''}`}>
            {v}
          </div>
        ))}
      </div>
      <div className="iso-row">
        <div className="iso-cell header">GMP</div>
        <div className="iso-cell wide">{gmpRows[0]}</div>
        <div className="iso-cell highlight">{gmpRows[1]}</div>
        <div className="iso-cell highlight">{gmpRows[2]}</div>
      </div>
    </div>
  )
}
