import nikeImg from '../assets/nike-pegasus.webp';
import adidasImg from '../assets/adidas-adios.webp';
import hokaImg from '../assets/hoka-clifton.jpg';

function ShoesSection() {
  return (
    <>
      <section className="shoe-category" aria-labelledby="my-shoes-heading">
        <h2 id="my-shoes-heading" className="section-title">Моя обувь</h2>
        <ul className="shoe-grid">
          <li className="shoe-card">
            <img src={nikeImg} alt="" aria-hidden="true" />
            <div className="shoe-model">Nike Pegasus 40</div>
            <div className="shoe-mileage">пробег: 245 км</div>
          </li>
          <li className="shoe-card">
            <img src={adidasImg} alt="" aria-hidden="true" />
            <div className="shoe-model">Adidas Adios 7</div>
            <div className="shoe-mileage">пробег: 98 км</div>
          </li>
          <li className="shoe-card">
            <img src={hokaImg} alt="" aria-hidden="true" />
            <div className="shoe-model">Hoka Clifton 9</div>
            <div className="shoe-mileage">пробег: 312 км</div>
          </li>
        </ul>
      </section>

      <section className="shoe-category" aria-labelledby="rec-shoes-heading">
        <h2 id="rec-shoes-heading" className="section-title">Рекомендуемая обувь</h2>
        <ul className="shoe-grid">
          <li className="shoe-card">
            <div className="rec-shoe-header">Для длительных</div>
            <img src="https://cdn-icons-png.flaticon.com/512/33/33809.png" alt="" aria-hidden="true" />
            <div className="shoe-model">Saucony Triumph</div>
            <div className="shoe-mileage">➡️ ссылка на магазин</div>
          </li>
          <li className="shoe-card">
            <div className="rec-shoe-header">Для темповых</div>
            <img src="https://cdn-icons-png.flaticon.com/512/33/33809.png" alt="" aria-hidden="true" />
            <div className="shoe-model">Brooks Hyperion</div>
            <div className="shoe-mileage">➡️ ссылка на магазин</div>
          </li>
          <li className="shoe-card">
            <div className="rec-shoe-header">Соревновательная</div>
            <img src="https://cdn-icons-png.flaticon.com/512/33/33809.png" alt="" aria-hidden="true" />
            <div className="shoe-model">Nike Alphafly</div>
            <div className="shoe-mileage">➡️ ссылка на магазин</div>
          </li>
        </ul>
      </section>
    </>
  );
}

export default ShoesSection;