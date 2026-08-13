import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

const DEFAULT_MENU_ITEMS = [
  {
    _id: 'm1',
    name: 'Truffle & Wild Mushroom Tagliatelle',
    description: 'Handcrafted egg pasta tossed in black truffle cream, forest mushrooms, and aged Parmigiano Reggiano.',
    price: 28,
    photo: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=800&q=80'
  },
  {
    _id: 'm2',
    name: 'Pan-Seared Sea Bass',
    description: 'Crispy skin Chilean sea bass over saffron risotto, braised baby fennel, and citrus beurre blanc.',
    price: 36,
    photo: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80'
  },
  {
    _id: 'm3',
    name: 'Roasted Beetroot & Goat Cheese Salad',
    description: 'Heritage beets, whipped French chevre, candied walnuts, wild arugula, and hibiscus reduction.',
    price: 19,
    photo: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80'
  },
  {
    _id: 'm4',
    name: 'Wagyu Beef Tenderloin',
    description: 'Prime Grade-A Wagyu with smoked potato puree, charred asparagus, and rich bone marrow jus.',
    price: 52,
    photo: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80'
  },
  {
    _id: 'm5',
    name: 'Artisanal Burrata & Heirloom Tomatoes',
    description: 'Pugliese burrata, vine-ripened tomatoes, opal basil oil, and 25-year aged Modena balsamic.',
    price: 22,
    photo: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=800&q=80'
  },
  {
    _id: 'm6',
    name: 'Dark Chocolate Fondant & Pistachio',
    description: '70% Valrhona warm molten chocolate cake paired with Sicilian pistachio gelato.',
    price: 16,
    photo: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80'
  }
];

export default function CustomerMenuPage() {
  const { user } = useAuth();
  const [menuItems, setMenuItems] = useState(DEFAULT_MENU_ITEMS);
  const [sentOrders, setSentOrders] = useState({});
  const [toastMessage, setToastMessage] = useState('');
  const [tableNumber] = useState(3);
  const isManager = user?.role === 'manager' || user?.work === 'manager';

  useEffect(() => {
    // Attempt to load items from DB if available
    api.get('/menu?limit=50')
      .then((res) => {
        if (res.data?.data && res.data.data.length > 0) {
          const dbItems = res.data.data.map((item, idx) => ({
            ...item,
            photo: item.photo || DEFAULT_MENU_ITEMS[idx % DEFAULT_MENU_ITEMS.length].photo
          }));
          // Combine DB items + DEFAULT_MENU_ITEMS without duplicate names
          const dbNames = new Set(dbItems.map((i) => i.name.toLowerCase().trim()));
          const filteredDefaults = DEFAULT_MENU_ITEMS.filter((i) => !dbNames.has(i.name.toLowerCase().trim()));
          setMenuItems([...dbItems, ...filteredDefaults]);
        }
      })
      .catch(() => {});
  }, []);

  const handleOrder = async (item) => {
    if (sentOrders[item._id]) return;

    try {
      await api.post('/order', {
        itemName: item.name,
        price: item.price,
        tableNumber: tableNumber,
        photo: item.photo
      });

      // Mark card as sent
      setSentOrders((prev) => ({ ...prev, [item._id]: true }));

      // Show toast
      setToastMessage(`"${item.name}" sent to the kitchen!`);

      // Hide toast after 3s
      setTimeout(() => {
        setToastMessage('');
      }, 3000);
    } catch {
      setToastMessage(`Failed to send "${item.name}". Please try again.`);
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  return (
    <div className="section-container">
      <div className="editorial-header">
        <h1>OUR MENU</h1>
        <p>Crafted with organic seasonal ingredients and timeless culinary artistry.</p>
        {isManager && (
          <div style={{ marginTop: '20px' }}>
            <Link to="/menu/add" className="btn-pill-solid" style={{ padding: '10px 24px', fontSize: '0.82rem', textDecoration: 'none', display: 'inline-block' }}>
              ➕ ADD NEW DISH
            </Link>
          </div>
        )}
      </div>

      <div className="menu-grid">
        {menuItems.map((item) => {
          const isSent = sentOrders[item._id];
          return (
            <div key={item._id} className="editorial-card">
              <div className="editorial-card-photo">
                <img src={item.photo} alt={item.name} />
              </div>
              <div className="editorial-card-body">
                <h3 className="editorial-card-title">{item.name}</h3>
                <p className="editorial-card-desc">{item.description || 'Delicious gourmet chef specialty.'}</p>
                <div className="editorial-card-footer">
                  <span className="editorial-card-price">${item.price}</span>
                  {isSent ? (
                    <span className="badge-sent">✓ Sent to Kitchen</span>
                  ) : (
                    <button
                      className="btn-pill-outline"
                      style={{ padding: '8px 20px', fontSize: '0.72rem' }}
                      onClick={() => handleOrder(item)}
                    >
                      ORDER THIS DISH
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {toastMessage && (
        <div className="toast-notification">
          ✨ {toastMessage}
        </div>
      )}
    </div>
  );
}
