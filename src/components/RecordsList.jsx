function RecordsList() {
  return (
    <section className="records-section" aria-labelledby="records-heading">
      <h2 id="records-heading" className="section-title" style={{ marginTop: '2rem' }}>
        Мои рекорды
      </h2>
      <ul className="records-list">
        <li className="record-item"><span className="record-dist">10 км</span><span className="record-time">42:18</span></li>
        <li className="record-item"><span className="record-dist">Полумарафон</span><span className="record-time">1:35:42</span></li>
        <li className="record-item"><span className="record-dist">Марафон</span><span className="record-time">3:28:15</span></li>
      </ul>
    </section>
  );
}

export default RecordsList;