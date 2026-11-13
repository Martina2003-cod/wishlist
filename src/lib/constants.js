export const CATEGORIES = ['Ropa', 'Abrigos', 'Calzado', 'Carteras', 'Accesorios', 'Belleza'];

export const PRIORITIES = [
  { value: 'alta', label: 'Alta' },
  { value: 'media', label: 'Media' },
  { value: 'baja', label: 'Baja' },
];

export const PRIORITY_RANK = { alta: 0, media: 1, baja: 2 };

export const STATUS = {
  pending: 'Pendiente',
  purchased: 'Comprado',
};

export const SORTS = [
  { value: 'recent', label: 'Más recientes' },
  { value: 'priority', label: 'Prioridad' },
  { value: 'price-asc', label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
];

export const EMPTY_ITEM = {
  name: '',
  brand: '',
  price: '',
  category: '',
  imageUrl: '',
  link: '',
  priority: 'media',
};
