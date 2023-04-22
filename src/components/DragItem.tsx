import React from 'react';
import { useDrag } from '../context/DragContext';
import Style from '../types/Style';


type DragItemProps = {
  note: number;
  children: React.ReactNode;
  classes?: Style;
};

const DragItem:React.FC<DragItemProps> = ({ children, note }) => {
  const { isDragging, onDragStart } = useDrag();
  return (
    <div onPointerDown={(e) => onDragStart(e, note)}>
      <div className={`card ${isDragging === note ? 'dragging' : ''}`}>
        <div className="box">{children}</div>
      </div>
    </div>
  );
};

export default DragItem;
