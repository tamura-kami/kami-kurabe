import { useState, type CSSProperties } from 'react'
import './App.css'

type Paper = { name: string; width: number; height: number; group: string }
type ComparePosition = 'center' | 'top-left'

const papers: Paper[] = [
  { name: 'A2', width: 420, height: 594, group: 'A判' },
  { name: 'A3', width: 297, height: 420, group: 'A判' },
  { name: 'A4', width: 210, height: 297, group: 'A判' },
  { name: 'A5', width: 148, height: 210, group: 'A判' },
  { name: 'A6', width: 105, height: 148, group: 'A判' },
  { name: 'B2', width: 515, height: 728, group: 'B判' },
  { name: 'B3', width: 364, height: 515, group: 'B判' },
  { name: 'B4', width: 257, height: 364, group: 'B判' },
  { name: 'B5', width: 182, height: 257, group: 'B判' },
  { name: 'B6', width: 128, height: 182, group: 'B判' },
  { name: 'はがき', width: 100, height: 148, group: 'その他' },
  { name: 'F0号', width: 180, height: 140, group: 'F号' },
  { name: 'F1号', width: 220, height: 160, group: 'F号' },
  { name: 'F2号', width: 240, height: 190, group: 'F号' },
  { name: 'F3号', width: 273, height: 220, group: 'F号' },
  { name: 'F4号', width: 333, height: 242, group: 'F号' },
  { name: 'F6号', width: 410, height: 318, group: 'F号' },
  { name: 'F8号', width: 455, height: 380, group: 'F号' },
  { name: 'F10号', width: 530, height: 455, group: 'F号' },
]

const colors = ['#2563eb', '#0891b2', '#7c3aed', '#db2777', '#ea580c', '#16a34a']
const scale = 0.59

function App() {
  const [selected, setSelected] = useState<string[]>(['A4', 'はがき'])
  const [comparePosition, setComparePosition] = useState<ComparePosition>('center')
  function togglePaper(name: string) {
    setSelected((current) => current.includes(name) ? current.filter((item) => item !== name) : [...current, name])
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="紙くらべ ホーム"><span className="brand-mark">紙</span><span>紙くらべ</span></a>
        <a className="github-link" href="https://github.com/" target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
      </header>

      <main id="top">
        <section className="intro">
          <h1>紙サイズを比べる</h1>
        </section>

        <section className="workspace" aria-label="紙サイズ比較">
          <div className="comparison-panel">
            <div className="panel-heading"><div><h2>サイズを見比べる</h2></div><span className="unit-note">すべて mm ・ 同じ縮尺</span></div>
            <div className="compare-controls" aria-label="比較位置">
              <span>重ね方</span>
              <div className="position-switch">
                <button type="button" aria-pressed={comparePosition === 'center'} className={comparePosition === 'center' ? 'selected' : ''} onClick={() => setComparePosition('center')}>中央で比較</button>
                <button type="button" aria-pressed={comparePosition === 'top-left'} className={comparePosition === 'top-left' ? 'selected' : ''} onClick={() => setComparePosition('top-left')}>左上を基準</button>
              </div>
            </div>
            <div className={`paper-stage ${comparePosition === 'top-left' ? 'align-top-left' : ''}`} aria-label={`${comparePosition === 'center' ? '中央' : '左上'}を基準に選択した紙の形を重ねて表示`}>
              <div className="stage-grid" />
              {papers.map((paper, index) => {
                const active = selected.includes(paper.name)
                return <div key={paper.name} className={`paper-shape${active ? ' is-active' : ''}`} style={{
                  width: `${paper.width * scale}px`, height: `${paper.height * scale}px`,
                  left: comparePosition === 'center' ? '50%' : '12px',
                  top: comparePosition === 'center' ? '50%' : '12px',
                  transform: comparePosition === 'center' ? 'translate(-50%, -50%)' : 'none',
                  borderColor: colors[index % colors.length],
                  backgroundColor: `${colors[index % colors.length]}${active ? '22' : '08'}`,
                  zIndex: active ? index + 2 : 1,
                }} aria-hidden="true" />
              })}
              {selected.length === 0 && <p className="stage-hint">下から紙を選ぶと比較できます</p>}
              <div className="scale-indicator"><span />100 mm</div>
            </div>
            <div className="comparison-caption"><span className="caption-dot" /> 紙を選択すると重ねて表示します <span className="caption-divider">·</span> 画面上のサイズは目安です</div>
          </div>

          <aside className="selection-panel">
            <div className="panel-heading selection-heading"><div><h2>比較するサイズ</h2></div><span className="selected-count">{selected.length}<small> 件</small></span></div>
            <div className="selection-tools"><span>{selected.length === 0 ? 'すべて表示中' : `${selected.length}種類を選択中`}</span><button onClick={() => setSelected(selected.length === papers.length ? [] : papers.map((paper) => paper.name))}>{selected.length === papers.length ? '選択を解除' : 'すべて選択'}</button></div>
            <div className="paper-options">
              {['A判', 'B判', 'その他', 'F号'].map((group) => <div className="option-group" key={group}><h3>{group}</h3><div className="option-list">
                {papers.filter((paper) => paper.group === group).map((paper) => {
                  const checked = selected.includes(paper.name)
                  const color = colors[papers.indexOf(paper) % colors.length]
                  return <label className={`paper-option${checked ? ' checked' : ''}`} key={paper.name}>
                    <input type="checkbox" checked={checked} onChange={() => togglePaper(paper.name)} />
                    <span className="checkbox-mark" style={{ '--swatch': color } as CSSProperties} />
                    <span className="option-name">{paper.name}</span><span className="option-size">{paper.width} × {paper.height}</span>
                  </label>
                })}
              </div></div>)}
            </div>
            <p className="selection-footnote">選択していない紙は薄く表示されます</p>
          </aside>
        </section>
      </main>

      <footer className="site-footer"><span>紙くらべ</span><span>紙選びを、もっとわかりやすく。</span><span>© 2025 紙くらべ</span></footer>
    </div>
  )
}

export default App
