import { Link } from 'react-router-dom'

interface Crumb {
  label: string
  to?: string
}

interface BreadcrumbProps {
  crumbs: Crumb[]
}

export function Breadcrumb({ crumbs }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumb">
      <ol>
        <li>
          <Link to="/">Home</Link>
        </li>
        {crumbs.map((crumb, i) => (
          <li key={i}>
            {crumb.to && i < crumbs.length - 1 ? (
              <Link to={crumb.to}>{crumb.label}</Link>
            ) : (
              <span aria-current="page">{crumb.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
