import { Link } from 'react-router-dom'
import type { Product } from '../../types'

interface ProductCardHProps {
  product: Product
  onEnquiry: (product: { id: string; name: string }) => void
}

export function ProductCardH({ product, onEnquiry }: ProductCardHProps) {
  const img = product.images[0]

  return (
    <div className="prod-card-h">
      <div className="img-wrap">
        {img ? (
          <img
            src={img}
            alt={product.name}
            loading="lazy"
            onError={(e) => {
              ;(e.currentTarget as HTMLImageElement).style.display = 'none'
            }}
          />
        ) : (
          <div className="card-img-placeholder" />
        )}
      </div>
      <div className="info">
        <div>
          <div className="prod-name">{product.name}</div>
          <div className="prod-meta" style={{ marginTop: 12 }}>
            {product.shortDescription && (
              <div className="prod-meta-col">
                <p>{product.shortDescription.substring(0, 120)}…</p>
              </div>
            )}
          </div>
        </div>
        <div className="card-actions">
          <Link
            to={`/products/${product.slug}`}
            className="btn-primary"
            style={{ fontSize: 13, height: 36 }}
          >
            More Info
          </Link>
          <button
            className="btn-secondary"
            style={{ fontSize: 13, height: 36 }}
            onClick={() => onEnquiry({ id: product.id, name: product.name })}
          >
            Enquiry
          </button>
        </div>
      </div>
    </div>
  )
}
