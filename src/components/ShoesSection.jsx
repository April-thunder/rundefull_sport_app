function ShoesSection({ shoes, onAddShoe }) {
  // Функция определения цвета индикатора ресурса
  const getResourceColor = (mileage, maxMileage) => {
    if (!maxMileage) return 'green';
    const percent = (mileage / maxMileage) * 100;
    if (percent >= 90) return 'red';
    if (percent >= 60) return 'yellow';
    return 'green';
  };

  return (
    <>
      <div className="section-header">
        <h2 className="section-title">Моя обувь</h2>
        <button className="add-icon-btn" onClick={onAddShoe}>+</button>
      </div>
      <ul className="shoe-grid">
        {shoes.map(shoe => {
          const resourcePercent = shoe.maxMileage ? (shoe.mileage / shoe.maxMileage) * 100 : 0;
          const colorClass = getResourceColor(shoe.mileage, shoe.maxMileage);
          // Формируем путь к картинке (через public)
          const imgPath = `/shoes/${shoe.brand?.toLowerCase()}-${shoe.model?.toLowerCase().replace(/ /g, '-')}.webp`;

          return (
            <li key={shoe.id} className="shoe-card">
              <img
                src={imgPath}
                alt={shoe.model}
                style={{ width: '70px', height: '70px', objectFit: 'contain' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  const placeholder = e.target.nextElementSibling;
                  if (placeholder) placeholder.style.display = 'flex';
                }}
              />
              <div className="shoe-image-placeholder" style={{ display: 'none', width: '70px', height: '70px', background: '#f0f0f0', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#666', borderRadius: '8px' }}>
                Изображение добавлю позже
              </div>
              <div className="shoe-model">{shoe.brand} {shoe.model}</div>
              <div className="shoe-mileage">пробег: {shoe.mileage} км</div>
              <div className="shoe-resource">
                <span className={`resource-bar ${colorClass}`} style={{ width: `${Math.min(resourcePercent, 100)}%` }}></span>
                <span className="resource-text">{Math.round(resourcePercent)}% ресурса</span>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Блок рекомендуемой обуви (статический) */}
      <section className="shoe-category" aria-labelledby="rec-shoes-heading">
        <h2 id="rec-shoes-heading" className="section-title">Рекомендуемая обувь</h2>
        <ul className="shoe-grid">
          <li className="shoe-card">
            <div className="rec-shoe-header">Для длительных</div>
            <img src="https://cdn-icons-png.flaticon.com/512/33/33809.png" alt="" aria-hidden="true" style={{ width: '70px', height: '70px', objectFit: 'contain' }} />
            <div className="shoe-model">Saucony Triumph</div>
            <div className="shoe-mileage">➡️ ссылка на магазин</div>
          </li>
          <li className="shoe-card">
            <div className="rec-shoe-header">Для темповых</div>
            <img src="https://cdn-icons-png.flaticon.com/512/33/33809.png" alt="" aria-hidden="true" style={{ width: '70px', height: '70px', objectFit: 'contain' }} />
            <div className="shoe-model">Brooks Hyperion</div>
            <div className="shoe-mileage">➡️ ссылка на магазин</div>
          </li>
          <li className="shoe-card">
            <div className="rec-shoe-header">Соревновательная</div>
            <img src="https://cdn-icons-png.flaticon.com/512/33/33809.png" alt="" aria-hidden="true" style={{ width: '70px', height: '70px', objectFit: 'contain' }} />
            <div className="shoe-model">Nike Alphafly</div>
            <div className="shoe-mileage">➡️ ссылка на магазин</div>
          </li>
        </ul>
      </section>
    </>
  );
}

export default ShoesSection;