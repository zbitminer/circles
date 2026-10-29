import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import ContentDraggableRow from '@/components/admin/ContentDraggableRow';
import useContentReordering from '@/components/admin/useContentReordering';

export default function ContentReorderList({ entity, items, onChange, children, className = '' }) {
  const { saving, message, reorder } = useContentReordering(entity, items, onChange);
  return <fieldset disabled={saving} className="min-w-0" aria-busy={saving}>
    <legend className="sr-only">Reorder {entity} items</legend>
    <p className="px-4 py-2 text-xs text-muted-foreground">Drag the grip to reorder; on mobile, press and hold it. With a keyboard, press Space, use arrow keys, then Space to drop.</p>
    <DragDropContext onDragEnd={reorder}>
      <Droppable droppableId={`content-${entity}`}>
        {provided => <div ref={provided.innerRef} {...provided.droppableProps} className={className}>
          {items.map((item, index) => <ContentDraggableRow key={item.id} item={item} index={index} disabled={saving}>{children(item)}</ContentDraggableRow>)}
          {provided.placeholder}
          {!items.length && <p className="px-4 py-6 text-center text-sm text-muted-foreground">No items yet.</p>}
        </div>}
      </Droppable>
    </DragDropContext>
    <p role="status" aria-live="polite" className="px-4 py-2 text-xs text-muted-foreground">{message || 'Changes save automatically.'}</p>
  </fieldset>;
}