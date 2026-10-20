// Editable user-content types. field.type: text | textarea | date | number
export const CONTENT_TYPES = [
  { key: 'Post', label: 'Posts & stories', titleKey: 'title', fallbackKey: 'content', fields: [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'content', label: 'Content', type: 'textarea', required: true },
    { key: 'location', label: 'Location', type: 'text', default: 'Safed, Israel' },
    { key: 'image_url', label: 'Image', type: 'text' }] },
  { key: 'Opportunity', label: 'Offers', titleKey: 'title', fields: [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'organization', label: 'Organization', type: 'text', required: true, default: 'Community Member' },
    { key: 'cause_category', label: 'Category', type: 'select', required: true, default: 'Companionship',
      options: ['Companionship', 'Food', 'Home', 'Skill Sharing', 'Technology', 'Transportation', 'Creative Workshops', 'Consultants', 'Wellness', 'Other'] },
    { key: 'description', label: 'Description', type: 'textarea', required: true },
    { key: 'help_details', label: 'Help details', type: 'textarea' },
    { key: 'location', label: 'Location', type: 'text', default: 'Safed, Israel' },
    { key: 'image_url', label: 'Image', type: 'text' }] },
  { key: 'ShabbatMeal', label: 'Shabbat meals', titleKey: 'location', fallbackKey: 'host_name', fields: [
    { key: 'host_name', label: 'Host name', type: 'text', required: true },
    { key: 'date', label: 'Date', type: 'date', required: true },
    { key: 'location', label: 'Location', type: 'text', required: true, default: 'Safed, Israel' },
    { key: 'seats_available', label: 'Seats available', type: 'number', required: true, default: 4 },
    { key: 'dietary_options', label: 'Dietary options', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' }] },
  { key: 'SosRequest', label: 'SOS requests', titleKey: 'title', fields: [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'contact_name', label: 'Contact name', type: 'text', required: true },
    { key: 'cause_category', label: 'Category', type: 'select', default: 'Other',
      options: ['Companionship', 'Food', 'Home', 'Skill Sharing', 'Technology', 'Transportation', 'Other'] },
    { key: 'description', label: 'Description', type: 'textarea', required: true },
    { key: 'location', label: 'Location', type: 'text', default: 'Safed, Israel' }] },
  { key: 'HealthRequest', label: 'Health requests', titleKey: 'title', fields: [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'contact_name', label: 'Contact name', type: 'text', required: true },
    { key: 'health_category', label: 'Category', type: 'select', required: true, default: 'wellness',
      options: ['medical', 'mental_health', 'wellness'] },
    { key: 'description', label: 'Description', type: 'textarea', required: true },
    { key: 'location', label: 'Location', type: 'text', default: 'Safed, Israel' }] },
  { key: 'Group', label: 'Groups', titleKey: 'name', fields: [
    { key: 'name', label: 'Name', type: 'text', required: true },
    { key: 'category', label: 'Category', type: 'select', default: 'Companionship',
      options: ['Companionship', 'Food', 'Home', 'Skill Sharing', 'Technology', 'Transportation', 'Wellness', 'Other'] },
    { key: 'description', label: 'Description', type: 'textarea' }] },
  { key: 'Comment', label: 'Comments', titleKey: 'content', fields: [
    { key: 'content', label: 'Comment', type: 'textarea', required: true }] },
  { key: 'Review', label: 'Reviews', titleKey: 'content', fields: [
    { key: 'rating', label: 'Rating (1-5)', type: 'number', required: true },
    { key: 'content', label: 'Review', type: 'textarea', required: true }] },
  { key: 'WorkshopInquiry', label: 'Workshops', titleKey: 'title', fallbackKey: 'first_name', query: { inquiry_type: 'lead' }, fields: [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'first_name', label: 'First name', type: 'text', required: true },
    { key: 'last_name', label: 'Last name', type: 'text', required: true },
    { key: 'phone', label: 'Phone', type: 'text', required: true },
    { key: 'email', label: 'Email', type: 'email', required: true },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'city', label: 'City', type: 'text', default: 'Safed, Israel' },
    { key: 'workshop_date', label: 'Date', type: 'date' },
    { key: 'start_time', label: 'Start time', type: 'text' },
    { key: 'end_time', label: 'End time', type: 'text' },
    { key: 'supplies', label: 'Supplies', type: 'textarea' },
    { key: 'notes', label: 'Notes', type: 'textarea' },
    { key: 'image_url', label: 'Image', type: 'text' }] },
];