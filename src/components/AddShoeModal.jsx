import { useState } from 'react';
import { shoeBrands, shoeModelsByBrand } from '../data/shoeModels';

function AddShoeModal({ onClose, onAdd }) {
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [customModel, setCustomModel] = useState('');
  const [maxMileage, setMaxMileage] = useState('');
  const [useCustomModel, setUseCustomModel] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // При выборе бренда сбрасываем модель
  const handleBrandChange = (e) => {
    setBrand(e.target.value);
    setModel('');
    setCustomModel('');
    setImagePreview(null);
  };

  // При выборе модели из списка
  const handleModelChange = (e) => {
    setModel(e.target.value);
    setCustomModel('');
    // Попытка загрузить картинку: /shoes/бренд-модель.webp
    const imgPath = `/shoes/${brand.toLowerCase()}-${e.target.value.toLowerCase().replace(/ /g, '-')}.webp`;
    setImagePreview(imgPath);
  };

  // При ручном вводе модели
  const handleCustomModelChange = (e) => {
    setCustomModel(e.target.value);
    setModel('');
    setImagePreview(null); // заглушка
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!brand) {
      alert('Выберите фирму');
      return;
    }
    const finalModel = useCustomModel ? customModel.trim() : model;
    if (!finalModel) {
      alert('Выберите или введите модель');
      return;
    }
    if (!maxMileage || parseFloat(maxMileage) <= 0) {
      alert('Введите корректный максимальный пробег (км)');
      return;
    }

    const newShoe = {
      id: Date.now(),
      brand,
      model: finalModel,
      mileage: 0,
      maxMileage: parseFloat(maxMileage),
    };
    onAdd(newShoe);
    onClose();
  };

  // Заглушка картинки
  const renderImage = () => {
    if (imagePreview) {
      return <img src={imagePreview} alt={model} className="shoe-preview" onError={() => setImagePreview(null)} />;
    } else {
      return <div className="shoe-preview-placeholder">Изображение добавлю позже</div>;
    }
  };

  const isBrandSelected = !!brand;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Добавить обувь</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Фирма:
            <select value={brand} onChange={handleBrandChange} required>
              <option value="">Выберите фирму</option>
              {shoeBrands.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </label>

          {isBrandSelected && (
            <>
              <div className="radio-group">
                <label>
                  <input type="radio" name="modelType" checked={!useCustomModel} onChange={() => setUseCustomModel(false)} />
                  Выбрать из списка
                </label>
                <label>
                  <input type="radio" name="modelType" checked={useCustomModel} onChange={() => setUseCustomModel(true)} />
                  Ввести вручную
                </label>
              </div>

              {!useCustomModel ? (
                <label>
                  Модель:
                  <select value={model} onChange={handleModelChange} required={!useCustomModel}>
                    <option value="">Выберите модель</option>
                    {shoeModelsByBrand[brand]?.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </label>
              ) : (
                <label>
                  Модель (вручную):
                  <input type="text" value={customModel} onChange={handleCustomModelChange} placeholder="Введите модель" required={useCustomModel} />
                </label>
              )}

              <div className="image-preview">
                {renderImage()}
              </div>
            </>
          )}

          <label>
            Максимальный пробег (км):
            <input type="number" step="10" value={maxMileage} onChange={e => setMaxMileage(e.target.value)} required />
          </label>

          <div className="modal-buttons">
            <button type="submit">Сохранить</button>
            <button type="button" onClick={onClose}>Отмена</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddShoeModal;