import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Bell, X } from 'lucide-react';

export default function NotificationBell({ currentUser }) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    loadNotifications();
    // Proactively check for matching opportunities based on profile causes
    checkMatchingOpportunities();
    const unsubscribe = base44.entities.Notification.subscribe((event) => {
      if (event.data.user_id === currentUser.id) {
        loadNotifications();
      }
    });
    return unsubscribe;
  }, [currentUser]);

  const loadNotifications = async () => {
    const notifs = await base44.entities.Notification.filter(
      { user_id: currentUser.id },
      '-created_date',
      20
    );
    setNotifications(notifs);
  };

  const checkMatchingOpportunities = async () => {
    try {
      const profiles = await base44.entities.VolunteerProfile.filter({ user_id: currentUser.id });
      const profile = profiles[0];
      if (profile && profile.causes && profile.causes.length > 0) {
        await base44.functions.invoke('notifyMatchingOpportunities', { data: { user_id: currentUser.id, causes: profile.causes } });
        loadNotifications();
      }
    } catch {}
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
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="relative p-2 rounded-lg hover:opacity-80 transition-opacity"
        style={{ background: '#FAF7EE' }}>
        
        
        {unreadCount > 0 &&
        <span
          className="absolute top-0 right-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
          style={{ background: '#C9A84C', color: '#fff' }}>
          
            {unreadCount}
          </span>
        }
      </button>

      {showPanel &&
      <div
        className="absolute right-0 mt-2 w-80 rounded-2xl shadow-xl overflow-hidden z-50"
        style={{ background: '#FAF7EE', border: '1px solid #C9A84C' }}>
        
          <div className="p-4 border-b font-semibold flex items-center justify-between" style={{ borderColor: '#C9A84C', color: '#1A2744' }}>
            Notifications
            <button onClick={() => setShowPanel(false)}><X className="w-4 h-4" /></button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ?
          <div className="p-4 text-center text-sm" style={{ color: '#6b5c3e' }}>No notifications</div> :

          notifications.map((notif) =>
          <div
            key={notif.id}
            onClick={() => handleClick(notif)}
            className="p-4 border-b cursor-pointer transition-colors hover:opacity-80"
            style={{
              borderColor: '#C9A84C',
              background: notif.is_read ? 'transparent' : '#f0e8d0'
            }}>
            
                  <p className="font-semibold text-sm" style={{ color: '#1A2744' }}>{notif.title}</p>
                  <p className="text-xs mt-1" style={{ color: '#6b5c3e' }}>{notif.message}</p>
                </div>
          )
          }
          </div>
        </div>
      }
    </div>);

}