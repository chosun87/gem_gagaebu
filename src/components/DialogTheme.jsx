import { Sidebar, Button, Divider, InputSwitch, SelectButton, Dropdown, Panel } from '@/components/PrimeReact';
import { useTheme } from '@/context/ThemeContext';

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

  const themes = [
    {
      label: 'Lara 계열',
      description: '현대적이고 깔끔한 디자인 (Lara)',
      items: [
        { name: '라라 라이트 시안', code: 'lara-light-cyan', color: '#06b6d4' },
        { name: '라라 라이트 틸', code: 'lara-light-teal', color: '#14b8a6' },
        { name: '라라 라이트 블루', code: 'lara-light-blue', color: '#3b82f6' },
        { name: '라라 라이트 인디고', code: 'lara-light-indigo', color: '#6366f1' },
        { name: '라라 라이트 퍼플', code: 'lara-light-purple', color: '#a855f7' },
        { name: '라라 라이트 앰버', code: 'lara-light-amber', color: '#f59e0b' },
        { name: '라라 라이트 그린', code: 'lara-light-green', color: '#22c55e' },
        { name: '라라 라이트 핑크', code: 'lara-light-pink', color: '#ec4899' },
        { name: '라라 다크 시안', code: 'lara-dark-cyan', color: '#06b6d4' },
        { name: '라라 다크 틸', code: 'lara-dark-teal', color: '#14b8a6' },
        { name: '라라 다크 블루', code: 'lara-dark-blue', color: '#3b82f6' },
        { name: '라라 다크 인디고', code: 'lara-dark-indigo', color: '#6366f1' },
        { name: '라라 다크 퍼플', code: 'lara-dark-purple', color: '#a855f7' },
        { name: '라라 다크 앰버', code: 'lara-dark-amber', color: '#f59e0b' },
        { name: '라라 다크 그린', code: 'lara-dark-green', color: '#22c55e' },
        { name: '라라 다크 핑크', code: 'lara-dark-pink', color: '#ec4899' },
      ]
    },
    {
      label: '부트스트랩',
      description: '익숙한 부트스트랩 스타일 (Bootstrap)',
      items: [
        { name: 'BS4 라이트 블루', code: 'bootstrap4-light-blue', color: '#007bff' },
        { name: 'BS4 라이트 퍼플', code: 'bootstrap4-light-purple', color: '#6f42c1' },
        { name: 'BS4 다크 블루', code: 'bootstrap4-dark-blue', color: '#007bff' },
        { name: 'BS4 다크 퍼플', code: 'bootstrap4-dark-purple', color: '#6f42c1' },
      ]
    },
    {
      label: '머티리얼 디자인',
      description: '구글 머티리얼 스타일 (Material)',
      items: [
        { name: 'MD 라이트 인디고', code: 'md-light-indigo', color: '#3f51b5' },
        { name: 'MD 라이트 퍼플', code: 'md-light-deeppurple', color: '#673ab7' },
        { name: 'MD 다크 인디고', code: 'md-dark-indigo', color: '#3f51b5' },
        { name: 'MD 다크 퍼플', code: 'md-dark-deeppurple', color: '#673ab7' },
      ]
    },
    {
      label: '기타 테마',
      description: '다양한 디자인 옵션',
      items: [
        { name: '소호 라이트', code: 'soho-light', color: '#495057' },
        { name: '소호 다크', code: 'soho-dark', color: '#495057' },
        { name: '비바 라이트', code: 'viva-light', color: '#4f46e5' },
        { name: '비바 다크', code: 'viva-dark', color: '#4f46e5' },
        { name: '플루언트 라이트', code: 'fluent-light', color: '#0078d4' },
        { name: '미라 (Mira)', code: 'mira', color: '#10b981' },
        { name: '나노 (Nano)', code: 'nano', color: '#10b981' },
      ]
    }
  ];

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
            <Dropdown
              value={theme}
              options={themes}
              onChange={(e) => changeTheme(e.value)}
              optionLabel="name"
              optionValue="code"
              optionGroupLabel="label"
              optionGroupChildren="items"
              placeholder="테마를 선택하세요"
              className="w-full"
              itemTemplate={themeOptionTemplate}
              valueTemplate={selectedThemeTemplate}
            />
          </section>
        </div>
      </Panel>
    </Sidebar>
  );
}

const themeOptionTemplate = (option) => {
  return (
    <div className="flex align-items-center gap-2">
      <div
        className="w-1rem h-1rem border-circle shadow-1"
        style={{ backgroundColor: option.color }}
      ></div>
      <span>{option.name}</span>
    </div>
  );
};

const selectedThemeTemplate = (option, props) => {
  if (option) {
    return (
      <div className="flex align-items-center gap-2">
        <div
          className="w-1rem h-1rem border-circle shadow-1"
          style={{ backgroundColor: option.color }}
        ></div>
        <span>{option.name}</span>
      </div>
    );
  }

  return <span>{props.placeholder}</span>;
};
