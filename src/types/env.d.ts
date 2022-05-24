declare module 'react-beautiful-dnd-test-utils' {
  export const mockGetComputedSpacing: () => void;
  export const mockDndElSpacing: (rtlUtils: any) => void;
  export const makeDnd: (args: any) => Promise;
  export const DND_DRAGGABLE_DATA_ATTR: string;
  export const DND_DIRECTION_DOWN: string;
  export const DND_DIRECTION_UP: string;
  export const DND_DIRECTION_RIGHT: string;
  export const DND_DIRECTION_LEFT: string;
}
