import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { X } from 'lucide-react';

export default function NotificationBell({ currentUser }) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    loadNotifications();
    const unsubscribe = base44.entities.Notification.subscribe((event) => {
      if (event.data.user_id === currentUser.id) {
        loadNotifications();
      }
    });
    return unsubscribe;
  }, [currentUser]);

  const loadNotifications = async () => {
    try {
      const notifs = await base44.entities.Notification.filter(
        { user_id: currentUser.id },
        '-created_date',
        20
      );
      setNotifications(notifs);
    } catch {
      setNotifications([]);
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleMarkAsRead = async (notifId) => {
    await base44.entities.Notification.update(notifId, { is_read: true });
    loadNotifications();
  };

  const handleClick = async (notif) => {
    handleMarkAsRead(notif.id);
    setShowPanel(false);
    if (notif.type === 'new_opportunity' && notif.related_id) {
      navigate(`/opportunities?opportunity=${notif.related_id}`);
    }
  };

  return (
    <div className="relative">
      












      

      {showPanel &&
      <div
        className="absolute right-0 mt-2 w-80 rounded-2xl shadow-xl overflow-hidden z-50"
        style={{ background: '#fcfaf8', border: '1px solid #bd4c0f' }}>
        
          <div className="p-4 border-b font-semibold flex items-center justify-between" style={{ borderColor: '#bd4c0f', color: '#141414' }}>
            Notifications
            <button onClick={() => setShowPanel(false)}><X className="w-4 h-4" /></button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ?
          <div className="p-4 text-center text-sm" style={{ color: '#6b7280' }}>No notifications</div> :

          notifications.map((notif) =>
          <div
            key={notif.id}
            onClick={() => handleClick(notif)}
            className="p-4 border-b cursor-pointer transition-colors hover:opacity-80"
            style={{
              borderColor: '#bd4c0f',
              background: notif.is_read ? 'transparent' : '#fbe8d4'
            }}>
            
                  <p className="font-semibold text-sm" style={{ color: '#141414' }}>{notif.title}</p>
                  <p className="text-xs mt-1" style={{ color: '#6b7280' }}>{notif.message}</p>
                </div>
          )
          }
          </div>
        </div>
      }
    </div>);

}