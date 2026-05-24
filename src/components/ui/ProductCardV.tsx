import { Link } from 'react-router-dom'
import type { Product } from '../../types'

interface ProductCardVProps {
  product: Product
  onEnquiry?: (product: { id: string; name: string }) => void
}

export function ProductCardV({ product, onEnquiry }: ProductCardVProps) {
  const img = product.images[0]

  return (
    <div className="prod-card-v">
      <Link to={`/products/${product.slug}`} style={{ display: 'contents' }}>
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
        <div className="card-label">{product.name}</div>
      </Link>
      {onEnquiry && (
        <button
          className="btn-secondary card-enquiry-btn"
          onClick={() => onEnquiry({ id: product.id, name: product.name })}
        >
          Enquiry
        </button>
      )}
    </div>
  )
}
