import { Chart } from './components/Chart'
import { SelectPrefecture } from './components/SelectPrefecture'
import { useSelectPrefecture } from './hooks/useSelectPrefecture'

function App() {
  const { selectPrefectures, handleSelectPrefecture } = useSelectPrefecture()

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '16px' }}>
      <header>App</header>
      <main>
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
