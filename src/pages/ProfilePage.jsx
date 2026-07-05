import { useState, useRef } from 'react';
import { useApp } from '../hooks/useApp';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import defaultAvatar from '../assets/default-avatar.png';

function ProfilePage() {
  const { user, updateUser, logout } = useApp();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(user?.photo || null);
  const [isPhotoChanged, setIsPhotoChanged] = useState(false);
  const fileInputRef = useRef(null);

  const photoSrc = photoPreview || defaultAvatar;

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm({
    defaultValues: {
      name: user?.name || '',
      age: user?.age || '',
      weight: user?.weight || '',
    }
  });

  // Кнопка активна, если изменены поля формы ИЛИ загружено/удалено фото
  const isFormDirty = isDirty || isPhotoChanged;

  const onSubmit = (data) => {
    setIsSaving(true);
    setTimeout(() => {
      updateUser({
        ...data,
        age: parseInt(data.age, 10),
        weight: parseFloat(data.weight),
        photo: photoPreview,
      });
      setIsSaving(false);
      setIsPhotoChanged(false);
      toast.success('Профиль обновлён!');
      reset(data);
    }, 800);
  };

  const handleCancel = () => {
    reset({
      name: user?.name || '',
      age: user?.age || '',
      weight: user?.weight || '',
    });
    setPhotoPreview(user?.photo || null);
    setIsPhotoChanged(false);
    toast('Изменения отменены', { icon: '↩️' });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
      setIsPhotoChanged(true);
      toast.success('Фото загружено, нажмите «Сохранить»');
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    setIsPhotoChanged(true);
  };

  const handleLogout = () => {
    if (window.confirm('Вы уверены, что хотите выйти?')) {
      logout();
      toast.success('Вы вышли из системы');
      navigate('/login');
    }
  };

  return (
    <div className="profile-page">
      <h2 className="page-title">Профиль</h2>
      <div className="profile-card">
        <div className="profile-photo-section">
          <img src={photoSrc} alt="Фото профиля" className="profile-photo" />
          <div className="photo-actions">
            <button onClick={() => fileInputRef.current.click()}>Выбрать фото</button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            {photoPreview && (
              <button onClick={handleRemovePhoto}>Удалить</button>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="profile-form">
          <label>
            Имя
            <input {...register('name', { required: 'Имя обязательно' })} placeholder="Ваше имя" />
            {errors.name && <span className="field-error">{errors.name.message}</span>}
          </label>
          <label>
            Возраст
            <input
              type="number"
              {...register('age', {
                required: 'Возраст обязателен',
                min: { value: 1, message: 'Минимум 1 год' },
                max: { value: 120, message: 'Максимум 120 лет' },
              })}
              placeholder="34"
            />
            {errors.age && <span className="field-error">{errors.age.message}</span>}
          </label>
          <label>
            Вес (кг)
            <input
              type="number"
              step="0.1"
              {...register('weight', {
                required: 'Вес обязателен',
                min: { value: 20, message: 'Минимум 20 кг' },
                max: { value: 300, message: 'Максимум 300 кг' },
              })}
              placeholder="72.5"
            />
            {errors.weight && <span className="field-error">{errors.weight.message}</span>}
          </label>
          <div className="form-actions">
            <button type="submit" disabled={isSaving || !isFormDirty}>
              {isSaving ? 'Сохраняем...' : 'Сохранить'}
            </button>
            <button type="button" onClick={handleCancel} disabled={!isFormDirty}>
              Отмена
            </button>
          </div>
        </form>

        <button className="logout-btn" onClick={handleLogout}>Выйти из профиля</button>
      </div>
    </div>
  );
}

export default ProfilePage;