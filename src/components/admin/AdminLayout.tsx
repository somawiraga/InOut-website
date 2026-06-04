import { useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useAdminAuth } from '../../contexts/AdminAuthContext'
import productGroups from '../../data/product-groups.json'
import '../../styles/admin.css'

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { session, signOut } = useAdminAuth()
  const { category } = useParams<{ category: string }>()
  const [openCategory, setOpenCategory] = useState<string | null>(category ?? productGroups[0]?.slug ?? null)

  async function handleSignOut() {
    await signOut()
    toast.success('Signed out')
  }

  return (
    <div className="admin-root">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-logo">InOut Admin</div>
          <div className="admin-sidebar-sub">Product Management</div>
        </div>

        <nav className="admin-sidebar-nav">
          {productGroups.map(group => (
            <div key={group.id}>
              <button
                className={`admin-category-btn${openCategory === group.slug ? ' active' : ''}`}
                onClick={() => setOpenCategory(openCategory === group.slug ? null : group.slug)}
              >
                {group.name}
                <span className={`admin-category-chevron${openCategory === group.slug ? ' open' : ''}`}>
                  ▼
                </span>
              </button>

              {openCategory === group.slug && (
                <div className="admin-subcategory-list">
                  {group.subcategories.map(sub => (
                    <NavLink
                      key={sub.id}
                      to={`/admin/products/${group.slug}/${sub.slug}`}
                      className={({ isActive }) =>
                        `admin-subcategory-link${isActive ? ' active' : ''}`
                      }
                    >
                      {sub.name}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-email">{session?.user.email}</div>
          <button className="admin-signout-btn" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="admin-main">
        {children}
      </main>
    </div>
  )
}
