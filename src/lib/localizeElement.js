import { cloneElement, isValidElement } from 'react';

// Translate render-time UI copy, never values, IDs, callbacks, or saved records.
// translate="no" protects member-authored text and personal details.
export default function localizeElement(node, translate) {
  if (typeof node === 'string') return translate(node);
  if (Array.isArray(node)) return node.map(child => localizeElement(child, translate));
  if (!isValidElement(node) || node.props.translate === 'no') return node;
  const updates = {};
  if (typeof node.props.className === 'string') updates.className = node.props.className.replace(/\btext-left\b/g, 'text-start').replace(/\btext-right\b/g, 'text-end');
  if (node.type === 'input' && ['email', 'tel', 'url', 'password'].includes(node.props.type)) updates.dir = 'ltr';
  if (node.props.children !== undefined) updates.children = localizeElement(node.props.children, translate);
  for (const key of ['title', 'subtitle', 'label', 'placeholder', 'aria-label', 'alt', 'confirmText']) {
    if (typeof node.props[key] === 'string') updates[key] = translate(node.props[key]);
  }
  if (typeof node.type !== 'string' && Array.isArray(node.props.options)) {
    updates.options = node.props.options.map(option => typeof option === 'string'
      ? { value: option, label: translate(option) }
      : option && typeof option.label === 'string' ? { ...option, label: translate(option.label) } : option);
  }
  return cloneElement(node, updates);
}