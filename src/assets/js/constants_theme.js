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
    key: 'tailwind',
    label: 'Tailwind',
    iconUrl: null,
    selectable: false,
    children: [
      { key: 'tailwind-light', label: 'Tailwind', color: '#4f46e5', singleMode: 'light' },
    ]
  },
  {
    key: 'fluent',
    label: 'Fluent',
    iconUrl: fluentIcon,
    selectable: false,
    children: [
      { key: 'fluent-light', label: '플루언트', color: '#0078d4', singleMode: 'light' },
    ]
  },
  {
    key: 'mira',
    label: 'Mira',
    iconUrl: miraIcon,
    selectable: false,
    children: [
      { key: 'mira', label: '미라 (Mira)', color: '#5e81ac', singleMode: 'light' },
    ]
  },
  {
    key: 'nano',
    label: 'Nano',
    iconUrl: nanoIcon,
    selectable: false,
    children: [
      { key: 'nano', label: '나노 (Nano)', color: '#1174c0', singleMode: 'light' },
    ]
  },
  {
    key: 'nova',
    label: 'Nova',
    iconUrl: null,
    selectable: false,
    children: [
      { key: 'nova', label: '노바 (Nova)', color: '#007ad9', singleMode: 'light' },
      { key: 'nova-accent', label: '노바 (Nova Accent)', color: '#1174c0', singleMode: 'light' },
      { key: 'nova-alt', label: '노바 (Nova Alt)', color: '#1174c0', singleMode: 'light' },
    ]
  },
  {
    key: 'rhea',
    label: 'Rhea',
    iconUrl: null,
    selectable: false,
    children: [
      { key: 'rhea', label: '레아 (Rhea)', color: '#7b95a3', singleMode: 'light' },
    ]
  },
  {
    key: 'luna',
    label: 'Luna',
    iconUrl: null,
    selectable: false,
    children: [
      { key: 'luna-blue', label: 'Luna 블루', color: '#81d4fa', singleMode: 'dark' },
      { key: 'luna-green', label: 'Luna 그린', color: '#c5e1a5', singleMode: 'dark' },
      { key: 'luna-amber', label: 'Luna 앰버', color: '#ffe082', singleMode: 'dark' },
      { key: 'luna-pink', label: 'Luna 핑크', color: '#f48fb1', singleMode: 'dark' },
    ]
  },
  {
    key: 'arya',
    label: 'Arya',
    iconUrl: null,
    selectable: false,
    children: [
      { key: 'arya-blue', label: 'Arya 블루', color: '#64b5f6', singleMode: 'dark' },
      { key: 'arya-green', label: 'Arya 그린', color: '#81c784', singleMode: 'dark' },
      { key: 'arya-orange', label: 'Arya 오렌지', color: '#ffd54f', singleMode: 'dark' },
      { key: 'arya-purple', label: 'Arya 퍼플', color: '#ba68c8', singleMode: 'dark' },
    ]
  },
  {
    key: 'vela',
    label: 'Vela',
    iconUrl: null,
    selectable: false,
    children: [
      { key: 'vela-blue', label: 'Vela 블루', color: '#64b5f6', singleMode: 'dark' },
      { key: 'vela-green', label: 'Vela 그린', color: '#81c784', singleMode: 'dark' },
      { key: 'vela-orange', label: 'Vela 오렌지', color: '#ffd54f', singleMode: 'dark' },
      { key: 'vela-purple', label: 'Vela 퍼플', color: '#ba68c8', singleMode: 'dark' },
    ]
  },
  {
    key: 'saga',
    label: 'Saga',
    iconUrl: null,
    selectable: false,
    children: [
      { key: 'saga-blue', label: 'Saga 블루', color: '#2196f3', singleMode: 'dark' },
      { key: 'saga-green', label: 'Saga 그린', color: '#4caf50', singleMode: 'dark' },
      { key: 'saga-orange', label: 'Saga 오렌지', color: '#ffc107', singleMode: 'dark' },
      { key: 'saga-purple', label: 'Saga 퍼플', color: '#9c27b0', singleMode: 'dark' },
    ]
  },
];

export const INPUT_STYLE_OPTIONS = [
  { label: 'Outlined', value: 'outlined' },
  { label: 'Filled', value: 'filled' }
];

export const SCALES = [12, 13, 14, 15, 16];
