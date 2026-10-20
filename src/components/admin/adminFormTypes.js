export const EVENT_TYPE = {
  key: 'Event',
  label: 'Event',
  fields: [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'description', label: 'Description', type: 'textarea', required: true },
    { key: 'date', label: 'Date & time', type: 'datetime-local', required: true },
    { key: 'location', label: 'Location', type: 'text', required: true, default: 'Safed, Israel' },
    { key: 'cause_category', label: 'Category', type: 'select', required: true, default: 'Other',
      options: ['Arts & Crafts', 'Personal Development', 'Languages', 'Health & Wellness', 'Music', 'Cooking', 'Support Groups', 'Other'] },
    { key: 'capacity', label: 'Capacity', type: 'number' },
    { key: 'image_url', label: 'Image URL', type: 'text' },
    { key: 'status', label: 'Status', type: 'select', required: true, default: 'upcoming', options: ['upcoming', 'ongoing', 'completed', 'cancelled'] },
  ],
};

export const WORKSHOP_TYPE = {
  key: 'WorkshopInquiry',
  label: 'Workshop',
  fields: [
    { key: 'title', label: 'Workshop title', type: 'text', required: true },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'first_name', label: 'Leader first name', type: 'text', required: true },
    { key: 'last_name', label: 'Leader last name', type: 'text', required: true },
    { key: 'phone', label: 'Phone', type: 'text', required: true },
    { key: 'email', label: 'Email', type: 'email', required: true },
    { key: 'city', label: 'City', type: 'text', default: 'Safed, Israel' },
    { key: 'workshop_date', label: 'Date', type: 'date' },
    { key: 'start_time', label: 'Start time', type: 'time' },
    { key: 'end_time', label: 'End time', type: 'time' },
    { key: 'format', label: 'Format', type: 'select', options: ['In-person', 'Zoom', 'Both'] },
    { key: 'image_url', label: 'Image URL', type: 'text' },
    { key: 'status', label: 'Status', type: 'select', required: true, default: 'new', options: ['new', 'contacted', 'scheduled', 'completed'] },
  ],
};