import { Sidebar, Button, Card, Divider, InputSwitch, SelectButton, Panel, TreeSelect } from '@/components/PrimeReact';
import { useTheme } from '@/context/ThemeContext';
import { THEME_NODES, INPUT_STYLE_OPTIONS, SCALES } from '@/assets/js/constants_theme';

const selectedThemeTemplate = (themeKey) => {
  if (!themeKey) return null;

  const allThemes = THEME_NODES.flatMap(group => group.children || []);
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
    inputStyle, set_inputStyle,
    condensed, set_condensed
  } = useTheme();

  const isDarkMode = theme.includes('dark');
  const isMaterialTheme = theme.startsWith('md-');

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

  return (
    <Sidebar
      className="dialog-theme w-25rem"
      header={<h3 className="text-2xl">테마 설정</h3>}
      position="right"
      visible={visible}
      onHide={onHide}
    >
      <Panel>
        <div class="formWrap">
          {/* <div className="flex flex-column gap-2"> */}
          <section>
            <h5 className="mt-0 mb-3 text-900">화면 배율 (Scale)</h5>
            <div className="flex align-items-center gap-3">
              <Button icon="pi pi-minus" onClick={() => onScaleChange('minus')} className="p-button-text p-button-rounded w-2rem h-2rem" disabled={scale === 12} />
              <div className="flex align-items-center gap-2 flex-grow-1">
                {SCALES.map((s) => (
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
              options={INPUT_STYLE_OPTIONS}
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
              options={THEME_NODES}
              onChange={(e) => changeTheme(e.value)}
              placeholder="테마를 선택하세요"
              valueTemplate={() => selectedThemeTemplate(theme)}
              nodeTemplate={nodeTemplate}
              display="comma"
              selectionMode="single"
            />
          </section>

          <div className={!isMaterialTheme ? 'hidden' : ''}>
            <Divider />

            <div class="inputWrap">
              <label htmlFor="Condensed">Condensed</label>
              <InputSwitch id="Condensed"
                className="ml-auto"
                tooltip="Material 테마 전용 압축 레이아웃"
                tooltipOptions={{ position: 'left' }}
                checked={condensed} onChange={(e) => set_condensed(e.value)}
              />
            </div>
          </div>
        </div>
      </Panel>
    </Sidebar>
  );
}
