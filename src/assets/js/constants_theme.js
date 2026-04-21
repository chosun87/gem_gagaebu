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
      { key: 'lara-light-cyan', label: '라라 라이트 시안', color: '#06b6d4' },
      { key: 'lara-light-teal', label: '라라 라이트 틸', color: '#14b8a6' },
      { key: 'lara-light-blue', label: '라라 라이트 블루', color: '#3b82f6' },
      { key: 'lara-light-indigo', label: '라라 라이트 인디고', color: '#6366f1' },
      { key: 'lara-light-purple', label: '라라 라이트 퍼플', color: '#a855f7' },
      { key: 'lara-light-amber', label: '라라 라이트 앰버', color: '#f59e0b' },
      { key: 'lara-light-green', label: '라라 라이트 그린', color: '#22c55e' },
      { key: 'lara-light-pink', label: '라라 라이트 핑크', color: '#ec4899' },
    ]
  },
  {
    key: 'bootstrap',
    label: '부트스트랩',
    iconUrl: bootstrapIcon,
    selectable: false,
    children: [
      { key: 'bootstrap4-light-blue', label: 'BS4 라이트 블루', color: '#007bff' },
      { key: 'bootstrap4-light-purple', label: 'BS4 라이트 퍼플', color: '#6f42c1' },
    ]
  },
  {
    key: 'material',
    label: '머티리얼 디자인',
    iconUrl: materialIcon,
    selectable: false,
    children: [
      { key: 'md-light-indigo', label: 'MD 라이트 인디고', color: '#3f51b5' },
      { key: 'md-light-deeppurple', label: 'MD 라이트 퍼플', color: '#673ab7' },
    ]
  },
  {
    key: 'soho',
    label: 'Soho',
    iconUrl: sohoIcon,
    selectable: false,
    children: [
      { key: 'soho-light', label: '소호 라이트', color: '#495057' },
    ]
  },
  {
    key: 'viva',
    label: 'Viva',
    iconUrl: vivaIcon,
    selectable: false,
    children: [
      { key: 'viva-light', label: '비바 라이트', color: '#4f46e5' },
    ]
  },
  {
    key: 'fluent',
    label: 'Fluent',
    iconUrl: fluentIcon,
    selectable: false,
    children: [
      { key: 'fluent-light', label: '플루언트 라이트', color: '#0078d4' },
    ]
  },
  {
    key: 'mira',
    label: 'Mira',
    iconUrl: miraIcon,
    selectable: false,
    children: [
      { key: 'mira', label: '미라 (Mira)', color: '#10b981' },
    ]
  },
  {
    key: 'nano',
    label: 'Nano',
    iconUrl: nanoIcon,
    selectable: false,
    children: [
      { key: 'nano', label: '나노 (Nano)', color: '#10b981' },
    ]
  }
];

export const INPUT_STYLE_OPTIONS = [
  { label: 'Outlined', value: 'outlined' },
  { label: 'Filled', value: 'filled' }
];

export const SCALES = [12, 13, 14, 15, 16];
