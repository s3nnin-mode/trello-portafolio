import { useDroppable } from "@dnd-kit/core";
import { ReactNode } from "react";

interface DroppableProps {
    id: string
    children: ReactNode
}

export const Droppable = ({children, id}: DroppableProps) => {
    const {setNodeRef} = useDroppable({
      id: id,
    });
    
    return (
      <div ref={setNodeRef}>
        {children}
      </div>
    );
}