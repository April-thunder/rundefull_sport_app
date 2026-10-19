import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { shoeBrands, shoeModelsByBrand } from '../data/shoeModels';
import type { Shoe } from '../types';

interface AddShoeModalProps {
  shoes: Shoe[];
  onClose: () => void;
  onAdd: (shoe: Shoe) => void;
}

function AddShoeModal({ shoes, onClose, onAdd }: AddShoeModalProps) {
  const [brand, setBrand] = useState<string>('');
  const [model, setModel] = useState<string>('');
  const [customModel, setCustomModel] = useState<string>('');
  const [maxMileage, setMaxMileage] = useState<string>('');
  const [useCustomModel, setUseCustomModel] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleBrandChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setBrand(e.target.value);
    setModel('');
    setCustomModel('');
    setImagePreview(null);
  };

  const handleModelChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setModel(e.target.value);
    setCustomModel('');
    const imgPath = `/shoes/${brand.toLowerCase()}-${e.target.value.toLowerCase().replace(/ /g, '-')}.webp`;
    setImagePreview(imgPath);
  };

  const handleCustomModelChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCustomModel(e.target.value);
    setModel('');
    setImagePreview(null);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
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

    if (Array.isArray(shoes) && shoes.length > 0) {
      const isDuplicate = shoes.some(
        (shoe) =>
          shoe.brand.toLowerCase() === brand.toLowerCase() &&
          shoe.model.toLowerCase() === finalModel.toLowerCase()
      );
      if (isDuplicate) {
        alert(`Обувь "${brand} ${finalModel}" уже есть в списке.`);
        return;
      }
    }

    const newShoe: Shoe = {
      id: Date.now(),
      brand,
      model: finalModel,
      mileage: 0,
      maxMileage: parseFloat(maxMileage),
    };
    onAdd(newShoe);
    onClose();
  };

  const renderImage = () => {
    if (imagePreview) {
      return (
        <img
          src={imagePreview}
          alt={model}
          className="shoe-preview"
          onError={() => setImagePreview(null)}
        />
      );
    }
    return null;
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
              {shoeBrands.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </label>

          {isBrandSelected && (
            <>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="modelType"
                    checked={!useCustomModel}
                    onChange={() => setUseCustomModel(false)}
                  />
                  Выбрать из списка
                </label>
                <label>
                  <input
                    type="radio"
                    name="modelType"
                    checked={useCustomModel}
                    onChange={() => setUseCustomModel(true)}
                  />
                  Ввести вручную
                </label>
              </div>

              {!useCustomModel ? (
                <label>
                  Модель:
                  <select value={model} onChange={handleModelChange} required={!useCustomModel}>
                    <option value="">Выберите модель</option>
                    {shoeModelsByBrand[brand]?.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </label>
              ) : (
                <label>
                  Модель (вручную):
                  <input
                    type="text"
                    value={customModel}
                    onChange={handleCustomModelChange}
                    placeholder="Введите модель"
                    required={useCustomModel}
                  />
                </label>
              )}

              <div className="image-preview">{renderImage()}</div>
            </>
          )}

          <label>
            Максимальный пробег (км):
            <input
              type="number"
              step="10"
              value={maxMileage}
              onChange={(e) => setMaxMileage(e.target.value)}
              required
            />
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