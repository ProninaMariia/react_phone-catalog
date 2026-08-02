import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../../api/products';
import type { Product } from '../../types/Product';
import { Loader } from '../shared/components/Loader';
import { ProductsList } from '../shared/components/ProductsList';

const banners = [
  {
    src: 'img/banner-main.png',
    alt: 'Promotion',
  },
  {
    src: 'img/banner-phones.png',
    alt: 'Phones promotion',
  },
  {
    src: 'img/banner-tablets.png',
    alt: 'Tablets promotion',
  },
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
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const goToPrevSlide = useCallback(() => {
    setActiveSlide(current => (current - 1 + banners.length) % banners.length);
  }, []);

  const goToNextSlide = useCallback(() => {
    setActiveSlide(current => (current + 1) % banners.length);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(goToNextSlide, 5000);

    return () => window.clearInterval(timer);
  }, [goToNextSlide]);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => setError(true));
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNextSlide();
      } else {
        goToPrevSlide();
      }
    }
  };

  const hotPrices = useMemo(() => {
    const wanted = [
      'apple-iphone-11-pro-64gb-midnightgreen',
      'apple-iphone-11-64gb-gold',
      'apple-iphone-11-64gb-purple',
      'apple-iphone-11-64gb-red',
    ];

    return products.filter(p => wanted.includes(p.itemId));
  }, [products]);

  const brandNew = useMemo(() => {
    const seen = new Set<string>();

    return [...products]
      .filter(
        p =>
          p.category === 'phones' && p.itemId.startsWith('apple-iphone-14-pro'),
      )
      .sort((a, b) => a.capacity.length - b.capacity.length)
      .filter(p => {
        const key = `${p.capacity}-${p.color}`;

        if (seen.has(key)) {
          return false;
        }

        seen.add(key);

        return true;
      })
      .slice(0, 4);
  }, [products]);

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

  return (
    <div className="page home">
      <h1 className="visually-hidden">Product Catalog</h1>

      <h2 className="home__section-title">Welcome to Nice Gadgets!</h2>

      <div
        className="slider"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <button
          type="button"
          aria-label="Previous slide"
          onClick={goToPrevSlide}
        >
          ‹
        </button>
        <img src={banners[activeSlide].src} alt={banners[activeSlide].alt} />
        <button type="button" aria-label="Next slide" onClick={goToNextSlide}>
          ›
        </button>
        <div className="dots">
          {banners.map((banner, index) => (
            <button
              type="button"
              aria-label={`Show slide ${index + 1}`}
              className={index === activeSlide ? 'active' : ''}
              key={banner.src}
              onClick={() => setActiveSlide(index)}
            />
          ))}
        </div>
      </div>

      <section>
        <h2 className="home__section-title">Brand new models</h2>
        {products.length ? (
          <ProductsList products={brandNew} />
        ) : (
          !error && <Loader />
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
        <h2 className="home__section-title">Hot prices</h2>
        {error ? (
          <p className="home__error">Something went wrong</p>
        ) : products.length ? (
          <ProductsList products={hotPrices} />
        ) : (
          <Loader />
        )}
      </section>
    </div>
  );
};
