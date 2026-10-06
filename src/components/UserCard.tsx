import { useApp } from '../hooks/useApp';
import defaultAvatar from '../assets/default-avatar.png';

function UserCard() {
  const { user } = useApp();
  const photoSrc = user?.photo || defaultAvatar;

  return (
    <div className="user-photo-block">
      <div className="photo-wrapper">
        <img src={photoSrc} alt="Фото пользователя" />
      </div>
    </div>
  );
}

export default UserCard;