import mitt from 'mitt';

type Events = {
  'native-drop': string[];
  'native-drag-enter': void;
  'native-drag-leave': void;
};

export const bus = mitt<Events>();
