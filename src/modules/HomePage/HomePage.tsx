import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../../api/products';
import type { Product } from '../../types/Product';
import { Loader } from '../shared/components/Loader';
import { ProductsList } from '../shared/components/ProductsList';

const banners = [
  'img/banner-phones.png',
  'img/banner-tablets.png',
  'img/banner-accessories.png',
];

const categoryMeta: Record<string, { title: string; image: string }> = {
  phones: {
    title: 'Mobile phones',
    image: 'img/category-phones.png',
  },
  tablets: {
    title: 'Tablets',
    image: 'img/category-tablets.png',
  },
  accessories: {
    title: 'Accessories',
    image: 'img/category-accessories.png',
  },
};

export const HomePage = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(
      () => setActiveSlide(current => (current + 1) % banners.length),
      5000,
    );

    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => setError(true));
  }, []);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      phones: 0,
      tablets: 0,
      accessories: 0,
    };

    products.forEach(product => {
      if (counts[product.category] !== undefined) {
        counts[product.category]++;
      }
    });

    return counts;
  }, [products]);

  const hotPrices = useMemo(
    () =>
      [...products]
        .sort((a, b) => b.fullPrice - b.price - (a.fullPrice - a.price))
        .slice(0, 8),
    [products],
  );
  const brandNew = useMemo(
    () => [...products].sort((a, b) => b.year - a.year).slice(0, 8),
    [products],
  );

  return (
    <div className="page home">
      <h1 className="visually-hidden">Product Catalog</h1>

      <h2 className="home__section-title">Welcome to Nice Gadgets!</h2>

      <div className="slider">
        <button
          type="button"
          aria-label="Previous slide"
          onClick={() =>
            setActiveSlide(
              current => (current - 1 + banners.length) % banners.length,
            )
          }
        >
          ‹
        </button>
        <img src={banners[activeSlide]} alt="Promotion" />
        <button
          type="button"
          aria-label="Next slide"
          onClick={() =>
            setActiveSlide(current => (current + 1) % banners.length)
          }
        >
          ›
        </button>
        <div className="dots">
          {banners.map((banner, index) => (
            <button
              type="button"
              aria-label={`Show slide ${index + 1}`}
              className={index === activeSlide ? 'active' : ''}
              key={banner}
              onClick={() => setActiveSlide(index)}
            />
          ))}
        </div>
      </div>

      <section>
        <h2 className="home__section-title">Hot prices</h2>
        {error ? (
          <p className="home__error">Something went wrong</p>
        ) : products.length ? (
          <ProductsList products={hotPrices} />
        ) : (
          <Loader />
        )}
      </section>

      <section>
        <h2 className="home__section-title">Shop by category</h2>
        <div className="categories">
          {(['phones', 'tablets', 'accessories'] as const).map(category => {
            const meta = categoryMeta[category];
            const count = categoryCounts[category] ?? 0;

            return (
              <Link
                to={`/${category}`}
                className="category-card"
                key={category}
              >
                <div className="category-card__image-wrapper">
                  <img
                    src={meta.image}
                    alt={meta.title}
                    className="category-card__image"
                  />
                </div>
                <h3 className="category-card__title">{meta.title}</h3>
                <p className="category-card__count">{count} models</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="home__section-title">Brand new</h2>
        {products.length ? (
          <ProductsList products={brandNew} />
        ) : (
          !error && <Loader />
        )}
      </section>
    </div>
  );
};
