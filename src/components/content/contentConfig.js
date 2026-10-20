// Editable user-content types. field.type: text | textarea | date | number
export const CONTENT_TYPES = [
  { key: 'Post', label: 'Posts & stories', titleKey: 'title', fallbackKey: 'content', fields: [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'content', label: 'Content', type: 'textarea' },
    { key: 'location', label: 'Location', type: 'text' }] },
  { key: 'Opportunity', label: 'Offers', titleKey: 'title', fields: [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'organization', label: 'Organization', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'help_details', label: 'Help details', type: 'textarea' },
    { key: 'location', label: 'Location', type: 'text' }] },
  { key: 'ShabbatMeal', label: 'Shabbat meals', titleKey: 'location', fields: [
    { key: 'date', label: 'Date', type: 'date' },
    { key: 'location', label: 'Location', type: 'text' },
    { key: 'seats_available', label: 'Seats available', type: 'number' },
    { key: 'dietary_options', label: 'Dietary options', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' }] },
  { key: 'SosRequest', label: 'SOS requests', titleKey: 'title', fields: [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'location', label: 'Location', type: 'text' }] },
  { key: 'HealthRequest', label: 'Health requests', titleKey: 'title', fields: [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'location', label: 'Location', type: 'text' }] },
  { key: 'Group', label: 'Groups', titleKey: 'name', fields: [
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' }] },
  { key: 'Comment', label: 'Comments', titleKey: 'content', fields: [
    { key: 'content', label: 'Comment', type: 'textarea' }] },
  { key: 'Review', label: 'Reviews', titleKey: 'content', fields: [
    { key: 'rating', label: 'Rating (1-5)', type: 'number' },
    { key: 'content', label: 'Review', type: 'textarea' }] },
  { key: 'WorkshopInquiry', label: 'Workshops', titleKey: 'title', query: { inquiry_type: 'lead' }, fields: [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'city', label: 'City', type: 'text' },
    { key: 'workshop_date', label: 'Date', type: 'date' },
    { key: 'start_time', label: 'Start time', type: 'text' },
    { key: 'end_time', label: 'End time', type: 'text' },
    { key: 'supplies', label: 'Supplies', type: 'textarea' },
    { key: 'notes', label: 'Notes', type: 'textarea' }] },
];