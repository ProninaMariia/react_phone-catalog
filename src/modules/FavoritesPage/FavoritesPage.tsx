import { ProductsList } from '../shared/components/ProductsList';
import { useFavorites } from '../shared/context/FavoritesContext';

export const FavoritesPage = () => {
  const { favorites } = useFavorites();

  return (
    <section className="page">
      <h1 className="page__title">Favorites</h1>
      <p className="page__count">{favorites.length} items</p>
      {favorites.length ? (
        <ProductsList products={favorites} />
      ) : (
        <p className="page__empty">You have no favorite products yet</p>
      )}
    </section>
  );
};
