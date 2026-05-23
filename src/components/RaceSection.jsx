function RaceSection() {
  return (
    <>
      <h2 className="section-title">Ближайшее соревнование</h2>
      <article className="comp-card">
        <div className="comp-header">
          <strong>Московский марафон</strong>
          <button className="delete-race" aria-label="Удалить соревнование">✖</button>
        </div>
        <ul className="race-details">
          <li>📅 17 мая 2025</li>
          <li>📍 Москва</li>
          <li>🏅 42.2 км</li>
          <li>⏳ Осталось: 31 день</li>
        </ul>
      </article>
      <button className="add-race-btn">+ Добавить соревнование</button>
    </>
  );
}

export default RaceSection;