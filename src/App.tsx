import { Chart } from './components/Chart'
import { SelectPrefecture } from './components/SelectPrefecture'
import { useSelectPrefecture } from './hooks/useSelectPrefecture'

function App() {
  const { selectPrefectures, handleSelectPrefecture } = useSelectPrefecture()

  return (
    <div style={{ maxWidth: '1024px', margin: '0 auto' }}>
      <header
        style={{
          backgroundColor: '#1976d2',
          color: '#fff',
          padding: '1rem',
          fontSize: '1.5rem',
        }}
      >
        都道府県グラフ
      </header>
      <main style={{ padding: '0.5rem' }}>
        <SelectPrefecture
          selectPrefectures={selectPrefectures}
          handleSelectPrefecture={handleSelectPrefecture}
        />
        <Chart prefectures={selectPrefectures} />
      </main>
    </div>
  )
}

export default App
