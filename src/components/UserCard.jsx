import userPhoto from '../assets/user.webp';

function UserCard() {
  return (
    <div className="user-photo-block">
      <div className="photo-wrapper">
        <img
          src={userPhoto}
          alt="Фото пользователя"
        />
        <div className="photo-overlay">
          <button className="photo-btn add-photo" aria-label="Добавить фото">
            Добавить фото
          </button>
          <button className="photo-btn delete-photo" aria-label="Удалить фото">
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserCard;