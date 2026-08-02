import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import type { ProductDetails } from '../../types/ProductDetails';
import {
  getProductDetails,
  getProducts,
  getSuggestedProducts,
} from '../../api/products';
import { Loader } from '../shared/components/Loader';
import { ProductsList } from '../shared/components/ProductsList';
import type { Product } from '../../types/Product';
import { useCart } from '../shared/context/CartContext';
import { useFavorites } from '../shared/context/FavoritesContext';

export const ProductDetailsPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [shortProduct, setShortProduct] = useState<Product | null>(null);
  const [suggested, setSuggested] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [image, setImage] = useState('');
  const [color, setColor] = useState('');
  const [capacity, setCapacity] = useState('');

  useEffect(() => {
    if (!productId) {
      return;
    }

    setIsLoading(true);
    Promise.all([getProductDetails(productId), getProducts()])
      .then(([found, allProducts]) => {
        setProduct(found);
        setShortProduct(
          allProducts.find(item => item.itemId === productId) ?? null,
        );
        if (found) {
          setImage(found.images[0]);
          setColor(found.color);
          setCapacity(found.capacity);
          getSuggestedProducts(found.category, productId).then(setSuggested);
        }
      })
      .catch(() => setProduct(null))
      .finally(() => setIsLoading(false));
  }, [productId]);
  if (isLoading) {
    return <Loader />;
  }

  if (!product) {
    return (
      <section className="page">
        <p>Product was not found</p>
      </section>
    );
  }

  const imageUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`;

  const handleAddToCart = () => {
    if (!shortProduct) {
      return;
    }

    addToCart(shortProduct);
  };

  return (
    <section className="page">
      <p className="breadcrumbs">
        <Link to="/">Home</Link> /{' '}
        <Link to={`/${product.category}`}>{product.category}</Link> /{' '}
        {product.name}
      </p>
      <button
        type="button"
        className="back-button"
        onClick={() => navigate(-1)}
      >
        Back
      </button>
      <h1 className="page__title">{product.name}</h1>
      <div className="details">
        <div>
          <img
            className="main-image"
            src={imageUrl(image)}
            alt={product.name}
          />
          <div className="thumbnails">
            {product.images.map(src => (
              <button type="button" key={src} onClick={() => setImage(src)}>
                <img src={imageUrl(src)} alt="" />
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="select-title">Available colors</p>
          {product.colorsAvailable.map(value => (
            <label className="radio-option" key={value}>
              <input
                type="radio"
                name="color"
                checked={color === value}
                onChange={() => setColor(value)}
              />
              <span className="radio-control" />
              {value}
            </label>
          ))}
          <p className="select-title">Select capacity</p>
          {product.capacityAvailable.map(value => (
            <label className="radio-option" key={value}>
              <input
                type="radio"
                name="capacity"
                checked={capacity === value}
                onChange={() => setCapacity(value)}
              />
              <span className="radio-control" />
              {value}
            </label>
          ))}

          <div className="price-row">
            <h2 className="price-current">${product.priceDiscount}</h2>
            <del className="price-old">${product.priceRegular}</del>
          </div>

          <div className="main-specs">
            <div className="spec-line">
              <span>Screen</span>
              <span>{product.screen}</span>
            </div>
            <div className="spec-line">
              <span>Resolution</span>
              <span>{product.resolution}</span>
            </div>
            <div className="spec-line">
              <span>Processor</span>
              <span>{product.processor}</span>
            </div>
            <div className="spec-line">
              <span>RAM</span>
              <span>{product.ram}</span>
            </div>
          </div>

          <div className="details-actions">
            <button
              type="button"
              className="add-to-cart"
              disabled={!shortProduct}
              onClick={handleAddToCart}
            >
              Add to cart
            </button>
            {shortProduct && (
              <button
                type="button"
                className={`details-favorite ${
                  isFavorite(shortProduct.itemId)
                    ? 'details-favorite-active'
                    : ''
                }`}
                aria-label="Toggle favorite"
                aria-pressed={isFavorite(shortProduct.itemId)}
                onClick={() => toggleFavorite(shortProduct)}
              >
                {isFavorite(shortProduct.itemId) ? '♥' : '♡'}
              </button>
            )}
          </div>
        </div>
      </div>
      <section className="details-section details-about">
        <h2>About</h2>
        {product.description.map(block => (
          <article key={block.title}>
            <h3>{block.title}</h3>
            {block.text.map(text => (
              <p key={text}>{text}</p>
            ))}
          </article>
        ))}
      </section>
      <section className="details-section details-specs">
        <h2>Tech specs</h2>
        <p>
          <span>Screen</span> <strong>{product.screen}</strong>
        </p>
        <p>
          <span>Resolution</span> <strong>{product.resolution}</strong>
        </p>
        <p>
          <span>Processor</span> <strong>{product.processor}</strong>
        </p>
        <p>
          <span>RAM</span> <strong>{product.ram}</strong>
        </p>
        {product.camera && (
          <p>
            <span>Camera</span> <strong>{product.camera}</strong>
          </p>
        )}
        {product.zoom && (
          <p>
            <span>Zoom</span> <strong>{product.zoom}</strong>
          </p>
        )}
        {product.cell.length > 0 && (
          <p>
            <span>Cell</span> <strong>{product.cell.join(', ')}</strong>
          </p>
        )}
      </section>
      {suggested.length > 0 && (
        <section>
          <h2>You may also like</h2>
          <ProductsList products={suggested} />
        </section>
      )}
    </section>
  );
};
