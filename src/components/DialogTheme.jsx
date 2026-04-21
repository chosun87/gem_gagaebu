import { Sidebar, Button, Divider, InputSwitch, SelectButton, Panel, TreeSelect } from '@/components/PrimeReact';
import { useTheme } from '@/context/ThemeContext';

import laraIcon from '@/assets/images/themes/lara.png';
import bootstrapIcon from '@/assets/images/themes/bootstrap.svg';
import materialIcon from '@/assets/images/themes/material.svg';
import sohoIcon from '@/assets/images/themes/soho.png';
import vivaIcon from '@/assets/images/themes/viva.svg';
import fluentIcon from '@/assets/images/themes/fluent.png';
import miraIcon from '@/assets/images/themes/mira.jpg';
import nanoIcon from '@/assets/images/themes/nano.jpg';

const themeNodes = [
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
      { key: 'lara-dark-cyan', label: '라라 다크 시안', color: '#06b6d4' },
      { key: 'lara-dark-teal', label: '라라 다크 틸', color: '#14b8a6' },
      { key: 'lara-dark-blue', label: '라라 다크 블루', color: '#3b82f6' },
      { key: 'lara-dark-indigo', label: '라라 다크 인디고', color: '#6366f1' },
      { key: 'lara-dark-purple', label: '라라 다크 퍼플', color: '#a855f7' },
      { key: 'lara-dark-amber', label: '라라 다크 앰버', color: '#f59e0b' },
      { key: 'lara-dark-green', label: '라라 다크 그린', color: '#22c55e' },
      { key: 'lara-dark-pink', label: '라라 다크 핑크', color: '#ec4899' },
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
      { key: 'bootstrap4-dark-blue', label: 'BS4 다크 블루', color: '#007bff' },
      { key: 'bootstrap4-dark-purple', label: 'BS4 다크 퍼플', color: '#6f42c1' },
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
      { key: 'md-dark-indigo', label: 'MD 다크 인디고', color: '#3f51b5' },
      { key: 'md-dark-deeppurple', label: 'MD 다크 퍼플', color: '#673ab7' },
    ]
  },
  {
    key: 'soho',
    label: 'Soho',
    iconUrl: sohoIcon,
    selectable: false,
    children: [
      { key: 'soho-light', label: '소호 라이트', color: '#495057' },
      { key: 'soho-dark', label: '소호 다크', color: '#495057' },
    ]
  },
  {
    key: 'viva',
    label: 'Viva',
    iconUrl: vivaIcon,
    selectable: false,
    children: [
      { key: 'viva-light', label: '비바 라이트', color: '#4f46e5' },
      { key: 'viva-dark', label: '비바 다크', color: '#4f46e5' },
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

const selectedThemeTemplate = (themeKey) => {
  if (!themeKey) return null;

  const allThemes = themeNodes.flatMap(group => group.children || []);
  const selectedTheme = allThemes.find(t => t.key === themeKey);

  if (selectedTheme) {
    return (
      <div className="flex align-items-center gap-2">
        <div
          className="colorChip shadow-1"
          style={{ backgroundColor: selectedTheme.color }}
        ></div>
        <span>{selectedTheme.label}</span>
      </div>
    );
  }

  return <span>{themeKey}</span>;
};

const nodeTemplate = (node) => {
  if (node.children) {
    return (
      <div className="flex align-items-center gap-2 py-1">
        <img
          src={node.iconUrl}
          alt={node.label}
          style={{ width: '20px', height: '20px', objectFit: 'contain' }}
        />
        <span className="font-bold">{node.label}</span>
      </div>
    );
  }

  return (
    <div className="flex align-items-center gap-2 py-1">
      <div
        className="colorChip shadow-1"
        style={{ backgroundColor: node.color }}
      ></div>
      <span>{node.label}</span>
    </div>
  );
};

export default function DialogTheme({ visible, onHide }) {
  const {
    theme, changeTheme,
    scale, set_scale,
    ripple, set_ripple,
    inputStyle, set_inputStyle
  } = useTheme();

  const isDarkMode = theme.includes('dark');

  const onScaleChange = (type) => {
    if (type === 'plus') {
      set_scale(prev => Math.min(prev + 1, 16));
    } else {
      set_scale(prev => Math.max(prev - 1, 12));
    }
  };

  const onDarkModeToggle = (e) => {
    let newTheme = '';
    if (e.value) {
      newTheme = theme.replace('light', 'dark');
    } else {
      newTheme = theme.replace('dark', 'light');
    }
    changeTheme(newTheme);
  };

  const inputStyleOptions = [
    { label: 'Outlined', value: 'outlined' },
    { label: 'Filled', value: 'filled' }
  ];

  const scales = [12, 13, 14, 15, 16];

  return (
    <Sidebar
      visible={visible}
      onHide={onHide}
      position="right"
      header="테마 설정"
      className="dialog-theme w-full md:w-30rem"
    >
      <Panel>
        <div className="flex flex-column gap-2">
          <section>
            <h5 className="mt-0 mb-3 text-900">화면 배율 (Scale)</h5>
            <div className="flex align-items-center gap-3">
              <Button icon="pi pi-minus" onClick={() => onScaleChange('minus')} className="p-button-text p-button-rounded w-2rem h-2rem" disabled={scale === 12} />
              <div className="flex align-items-center gap-2 flex-grow-1">
                {scales.map((s) => (
                  <i key={s} className={`pi pi-circle-fill text-xs transition-duration-200 ${s <= scale ? 'text-primary' : 'text-300'}`} />
                ))}
              </div>
              <Button icon="pi pi-plus" onClick={() => onScaleChange('plus')} className="p-button-text p-button-rounded w-2rem h-2rem" disabled={scale === 16} />
            </div>
          </section>

          <Divider />

          <section>
            <h5 className="mt-0 mb-3 text-900">입력 스타일 (Input Style)</h5>
            <SelectButton
              value={inputStyle}
              onChange={(e) => set_inputStyle(e.value)}
              options={inputStyleOptions}
              className="w-full"
            />
          </section>

          <Divider />

          <section className="flex align-items-center justify-content-between">
            <h5 className="m-0 text-900">리플 효과 (Ripple Effect)</h5>
            <InputSwitch checked={ripple} onChange={(e) => set_ripple(e.value)} />
          </section>

          <Divider />

          <section className="flex align-items-center justify-content-between">
            <h5 className="m-0 text-900">다크 모드 (Dark Mode)</h5>
            <InputSwitch checked={isDarkMode} onChange={onDarkModeToggle} />
          </section>

          <Divider />

          <section>
            <h5 className="mt-0 mb-3 text-900">다양한 테마 (Themes)</h5>
            <TreeSelect
              className="themeSelector w-full"
              value={theme}
              options={themeNodes}
              onChange={(e) => changeTheme(e.value)}
              placeholder="테마를 선택하세요"
              valueTemplate={() => selectedThemeTemplate(theme)}
              nodeTemplate={nodeTemplate}
              display="comma"
              selectionMode="single"
            />
          </section>
        </div>
      </Panel>
    </Sidebar>
  );
}
