import StatusCard from "./components/component"


function App() {
  return (
    <>
      <div>
      <StatusCard type="success">
        Operation Successful
      </StatusCard>

      <StatusCard type="error">
        Something went wrong
      </StatusCard>
    </div>

    </>
  )
}

export default App
