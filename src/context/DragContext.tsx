import { createContext, useContext } from 'react';

export const DragContext = createContext<any | null>(null);

export const useDrag = () => useContext(DragContext);
