import AppFooter from "./components/Footer/AppFooter"
import AppHeader from "./components/Header/AppHeader"
 function Year(){
  let year=new Date().getFullYear()

  return(
    <div>
      <center>
        <h1>
          The year is :{year}
        </h1>
      </center>
    </div>
  )
 }

function App() {
   return (
    <>
     <AppHeader/>
      <center>
        <h1>
          <Year/>
        </h1>
      </center>
      <AppFooter/>
    </>
  )
}

export default App
