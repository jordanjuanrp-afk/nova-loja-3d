import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Dragão Articulado Neon',
    description: 'Um dragão majestoso com mais de 40 pontos de articulação, impresso em material biodegradável de alta qualidade.',
    price: 129.90,
    category: 'articulado',
    image: 'https://picsum.photos/seed/dragon/800/800',
    isNew: true,
    isBestSeller: true,
    material: 'PLA Premium',
    size: '45cm de comprimento',
    colors: ['Azul Neon', 'Roxo Galáxia', 'Verde Radioativo']
  },
  {
    id: '2',
    name: 'Robô Guardião X-1',
    description: 'Robô de combate articulado com design futurista e detalhes impressionantes.',
    price: 89.90,
    category: 'articulado',
    image: 'https://picsum.photos/seed/robot/800/800',
    isNew: true,
    material: 'PLA Reforçado',
    size: '15cm de altura',
    colors: ['Cinza Metálico', 'Vermelho Escarlate', 'Preto Fosco']
  },
  {
    id: '3',
    name: 'Dinossauro T-Rex Flex',
    description: 'O rei dos dinossauros em uma versão totalmente flexível e divertida.',
    price: 59.90,
    category: 'articulado',
    image: 'https://picsum.photos/seed/trex/800/800',
    isBestSeller: true,
    material: 'PLA Silk',
    size: '20cm de comprimento',
    colors: ['Verde Musgo', 'Laranja Vibrante', 'Marrom Terra']
  },
  {
    id: '4',
    name: 'Miniatura Herói Espacial',
    description: 'Personagem detalhado para colecionadores e jogadores de RPG.',
    price: 34.90,
    category: 'miniatura',
    image: 'https://picsum.photos/seed/hero/800/800',
    material: 'Resina de Alta Definição',
    size: '32mm',
    colors: ['Cinza Base', 'Pintado à Mão']
  },
  {
    id: '5',
    name: 'Quebra-Cabeça Geométrico 3D',
    description: 'Desafie sua mente com este quebra-cabeça complexo e educativo.',
    price: 45.00,
    category: 'educativo',
    image: 'https://picsum.photos/seed/puzzle/800/800',
    material: 'PLA Resistente',
    size: '10x10x10cm',
    colors: ['Multicolorido', 'Azul e Branco']
  },
  {
    id: '6',
    name: 'Luminária Foguete Personalizada',
    description: 'Uma luminária incrível que pode ser personalizada com seu nome.',
    price: 159.90,
    category: 'personalizado',
    image: 'https://picsum.photos/seed/rocket/800/800',
    isNew: true,
    material: 'PLA Translúcido',
    size: '25cm de altura',
    colors: ['Branco Gelo', 'Azul Espacial']
  }
];
