import { useNavigate } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Breadcrumb } from './Breadcrumb'
import { Topbar } from './Topbar'

interface PageHeaderProps {
  title: string
  crumbs?: Array<{ label: string; to?: string }>
}

export function PageHeader({ title, crumbs = [] }: PageHeaderProps) {
  const navigate = useNavigate()
  const parentTo = [...crumbs].reverse().find((c) => c.to)?.to

  return (
    <>
      <Topbar />
      <div className="page-header">
        <Navbar variant="page-header" />
        <div className="page-header-content">
          {crumbs.length > 0 && <Breadcrumb crumbs={crumbs} />}
          <div className="page-title-row">
            {crumbs.length > 0 && (
              <button
                className="page-back-btn"
                onClick={() => (parentTo ? navigate(parentTo) : navigate(-1))}
                aria-label="Go back"
              >
                ←
              </button>
            )}
            <h1 className="page-header-title">{title}</h1>
          </div>
        </div>
      </div>
    </>
  )
}
