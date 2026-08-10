export default function MenuCard({ item, index }) {
  const tasteClass = `badge-${item.taste}`;

  return (
    <div
      className={`menu-card animate-in stagger-${(index % 6) + 1}`}
      id={`menu-card-${item._id}`}
    >
      <div className="menu-card-image">
        {item.photo ? (
          <img src={item.photo} alt={item.name} />
        ) : (
          <span className="placeholder-icon">🍽️</span>
        )}
      </div>
      <div className="menu-card-body">
        <h3>{item.name}</h3>
        <div className="menu-card-meta">
          <span className="menu-card-price">₹{item.price}</span>
          <span className={`badge ${tasteClass}`}>{item.taste}</span>
          {item.is_drink && <span className="badge badge-drink">Drink</span>}
        </div>
        <div className="menu-card-details">
          <span>{item.number_of_orders || 0} orders</span>
        </div>
        {item.ingredients?.length > 0 && (
          <div className="menu-card-ingredients">
            Ingredients: {item.ingredients.join(', ')}
          </div>
        )}
      </div>
    </div>
  );
}
