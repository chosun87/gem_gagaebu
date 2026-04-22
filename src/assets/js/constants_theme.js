import laraIcon from '@/assets/images/themes/lara.png';
import bootstrapIcon from '@/assets/images/themes/bootstrap.svg';
import materialIcon from '@/assets/images/themes/material.svg';
import sohoIcon from '@/assets/images/themes/soho.png';
import vivaIcon from '@/assets/images/themes/viva.svg';
import fluentIcon from '@/assets/images/themes/fluent.png';
import miraIcon from '@/assets/images/themes/mira.jpg';
import nanoIcon from '@/assets/images/themes/nano.jpg';

export const THEME_NODES = [
  {
    key: 'lara',
    label: 'Lara 계열',
    iconUrl: laraIcon,
    selectable: false,
    children: [
      { key: 'lara-{MODE}-cyan', label: '라라 시안', color: '#06b6d4' },
      { key: 'lara-{MODE}-teal', label: '라라 틸', color: '#14b8a6' },
      { key: 'lara-{MODE}-blue', label: '라라 블루', color: '#3b82f6' },
      { key: 'lara-{MODE}-indigo', label: '라라 인디고', color: '#6366f1' },
      { key: 'lara-{MODE}-purple', label: '라라 퍼플', color: '#8b5cf6' },
      { key: 'lara-{MODE}-amber', label: '라라 앰버', color: '#f59e0b' },
      { key: 'lara-{MODE}-green', label: '라라 그린', color: '#10b981' },
      { key: 'lara-{MODE}-pink', label: '라라 핑크', color: '#ec4899' },
    ]
  },
  {
    key: 'bootstrap',
    label: '부트스트랩',
    iconUrl: bootstrapIcon,
    selectable: false,
    children: [
      { key: 'bootstrap4-{MODE}-blue', label: 'BS4 블루', color: '#007bff' },
      { key: 'bootstrap4-{MODE}-purple', label: 'BS4 퍼플', color: '#883cae' },
    ]
  },
  {
    key: 'material',
    label: '머티리얼 디자인',
    iconUrl: materialIcon,
    selectable: false,
    children: [
      { key: 'md-{MODE}-indigo', label: 'MD 인디고', color: '#3f51b5' },
      { key: 'md-{MODE}-deeppurple', label: 'MD 퍼플', color: '#673ab7' },
    ]
  },
  {
    key: 'soho',
    label: 'Soho',
    iconUrl: sohoIcon,
    selectable: false,
    children: [
      { key: 'soho-{MODE}', label: '소호', color: '#7254f3' },
    ]
  },
  {
    key: 'viva',
    label: 'Viva',
    iconUrl: vivaIcon,
    selectable: false,
    children: [
      { key: 'viva-{MODE}', label: '비바', color: '#5472d4' },
    ]
  },
  {
    key: 'fluent',
    label: 'Fluent',
    iconUrl: fluentIcon,
    selectable: false,
    children: [
      { key: 'fluent-{MODE}', label: '플루언트', color: '#0078d4' },
    ]
  },
  {
    key: 'mira',
    label: 'Mira',
    iconUrl: miraIcon,
    selectable: false,
    children: [
      { key: 'mira', label: '미라 (Mira)', color: '#5e81ac', darkMode: false },
    ]
  },
  {
    key: 'nano',
    label: 'Nano',
    iconUrl: nanoIcon,
    selectable: false,
    children: [
      { key: 'nano', label: '나노 (Nano)', color: '#1174c0', darkMode: false },
    ]
  }
];

export const INPUT_STYLE_OPTIONS = [
  { label: 'Outlined', value: 'outlined' },
  { label: 'Filled', value: 'filled' }
];

export const SCALES = [12, 13, 14, 15, 16];
