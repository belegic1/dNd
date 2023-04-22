import { useState, useRef } from 'react';
import { DragContext } from '../context/DragContext';
import User from '../types/User';
import Style from '../types/Style';

type DragAreaProps = {
  items: User[];
  onChange: (items: User[]) => void;
  children: React.ReactNode;
  classes?: Style;
};

const DragArea:React.FC<DragAreaProps> = ({ classes,  items, onChange, children }) => {
  const [data, setData] = useState(items);
  const [isDragging, setIsDragging] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  function onDragStart(e: React.PointerEvent<HTMLDivElement>, index: number) {
    if (!detectLeftButton(e)) return;
    setIsDragging(index);
    const container = containerRef.current;
    if (!container) return;
    const items = [...container.children];
    // const items = [...container.childNodes];
    const dragItem = items[index] as HTMLDivElement;
    const itemsBellowDragItem = items.slice(index + 1);
    const notDragItems = items.filter((_, i) => i !== index);
    const dragData = data[index];
    let newData = [...data];

    const dragBoundryRect = dragItem.getBoundingClientRect();
    const space =
      items[1].getBoundingClientRect().top -
      items[0].getBoundingClientRect().bottom;

    dragItem.style.position = 'fixed';
    dragItem.style.zIndex = '5000';
    dragItem.style.width = dragBoundryRect.width + 'px';
    dragItem.style.height = dragBoundryRect.height + 'px';
    dragItem.style.top = dragBoundryRect.top + 'px';
    dragItem.style.left = dragBoundryRect.left + 'px';
    dragItem.style.cursor = 'grabbing';

    const div = document.createElement('div');
    div.id = 'div-temp';
    div.style.width = dragBoundryRect.width + 'px';
    div.style.height = dragBoundryRect.height + 'px';
    div.style.pointerEvents = 'none';
    container.appendChild(div);

    const distance = dragBoundryRect.height + space;

    itemsBellowDragItem.forEach((item) => {
      (item as HTMLDivElement).style.transform = `translateY(${distance}px)`;
    });

    const x = e.clientX;
    const y = e.clientY;

    document.onpointermove = onDragEnter;
    function onDragEnter(e:any) {
      const posX = e.clientX - x;
      const posY = e.clientY - y;
      dragItem.style.transform = `translate(${posX}px, ${posY}px)`;

      notDragItems.forEach((item) => {
        const rect1 = dragItem.getBoundingClientRect();
        const rect2 = item.getBoundingClientRect();
        const isOverlapping =
          rect1.y < rect2.y + rect2.height / 2 &&
          rect1.y + rect1.height / 2 > rect2.y;

        if (isOverlapping) {
          if (item.getAttribute('style')) {
            (item as HTMLDivElement).style.transform = '';
            index++;
          } else {
            (
              item as HTMLDivElement
            ).style.transform = `translateY(${distance}px)`;
            index--;
          }

          newData = data.filter((item) => item.id !== dragData.id);
          newData.splice(index, 0, dragData);
        }
      });
    }

    document.onpointerup = onDragEnd;
    function onDragEnd() {
      document.onpointerup = null;
      document.onpointermove = null;
      setIsDragging(null);
      dragItem.setAttribute("style" , "") ;
      container?.removeChild(div);
      items.forEach((item) => item.setAttribute("style", ""));
      setData(newData);
      onChange(newData);
    }
  }
 
  function detectLeftButton(e:any) {
    e = e || window.event;
    if ('buttons' in e) {
      return e.buttons === 1;
    }
    const button = e.witch || e.button;
    return button === 1;
  }



  return (
    <DragContext.Provider
      value={{
        data,
        isDragging,
        onDragStart,
      }}
    >
      <div ref={containerRef} className='container'>{children}</div>
    </DragContext.Provider>
  );
};

export default DragArea;
