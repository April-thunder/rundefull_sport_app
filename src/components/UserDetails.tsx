import { useApp } from '../hooks/useApp';

function UserDetails() {
  const { user } = useApp();

  return (
    <div className="user-details">
      <dl className="info-list">
        <div className="info-field">
          <dt>Имя</dt>
          <dd>{user.name || '—'}</dd>
        </div>
        <div className="info-field">
          <dt>Возраст</dt>
          <dd>{user.age || '—'} лет</dd>
        </div>
        <div className="info-field">
          <dt>Вес</dt>
          <dd>{user.weight || '—'} кг</dd>
        </div>
      </dl>
    </div>
  );
}

export default UserDetails;