import { NavLink } from 'react-router-dom';

const navItems = [
  { path: '/feed', label: 'Feed', icon: '🏠' },
  { path: '/events', label: 'Events', icon: '📅' },
  { path: '/microjobs', label: 'Micro Jobs', icon: '💼' },
  { path: '/chat', label: 'Chat', icon: '💬' },
  { path: '/lost-donation', label: 'Lost & Donation', icon: '🔍' },
  { path: '/notifications', label: 'Notifications', icon: '🔔' },
  { path: '/profile', label: 'My Profile', icon: '👤' },
];

const Sidebar = () => {
  return (
    <aside className="hidden md:block w-64 fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 p-4">
      <div className="flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
