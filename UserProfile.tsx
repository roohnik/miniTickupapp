import React from 'react';
import { User } from '../types';

interface UserProfileProps {
  user: User;
  onEditProfile: () => void;
  onLogout: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onEditProfile, onLogout }) => {
  return (
    <div className="p-4 border-t">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold">
          {user.name?.charAt(0) || 'U'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{user.name}</p>
          <p className="text-sm text-gray-500 truncate">{user.username}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onEditProfile}
          className="flex-1 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
        >
          ویرایش پروفایل
        </button>
        <button
          onClick={onLogout}
          className="flex-1 px-3 py-1.5 text-sm bg-red-100 text-red-700 hover:bg-red-200 rounded-lg"
        >
          خروج
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
