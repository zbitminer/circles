import { createPortal } from 'react-dom';
import { Draggable } from '@hello-pangea/dnd';
import { GripVertical } from 'lucide-react';

export default function ContentDraggableRow({ item, index, disabled, children }) {
  return <Draggable draggableId={item.id} index={index} isDragDisabled={disabled} disableInteractiveElementBlocking>
    {(provided, snapshot) => {
      const row = <div ref={provided.innerRef} {...provided.draggableProps} className={`flex min-w-0 items-center border-b border-border bg-card ${snapshot.isDragging ? 'rounded-xl shadow-lg ring-2 ring-primary' : ''}`}>
        <button type="button" {...provided.dragHandleProps} aria-label={`Reposition ${item.title || item.content?.slice(0, 40) || 'item'}`} className="ms-1 flex h-11 w-11 shrink-0 touch-none items-center justify-center rounded-lg text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing">
          <GripVertical className="h-5 w-5" aria-hidden="true" />
        </button>
        <div className="min-w-0 flex-1">{children}</div>
      </div>;
      return snapshot.isDragging ? createPortal(row, document.body) : row;
    }}
  </Draggable>;
}