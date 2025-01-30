import './styles/App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Screen from './pages/screen/Screen'
import ApplicationForm from './components/form/ApplicationForm'
import TransfereeForm from './components/form/TransfereeForm'
import Verification from './components/Verification'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
// import Dashboard from './pages/admin/home/Dashboard'
import Profile from './pages/admin/profile/Profile'
import Student from './pages/admin/student/Student'
import View from './pages/admin/student/View'
import Schedule from './pages/admin/schedule/Schedule'
import Error from './pages/404/Error'
import ViewSched from './pages/admin/schedule/ViewSched'
import Settings from './pages/settings/Settings'
import About from './pages/screen/About'
import Policies from './pages/screen/Policies'

const App = () => {

  const { isAuthenticated } = useAuth(); 

  return (
    <div className='app'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Screen />}/>
          <Route path='/freshmen' element={<ApplicationForm/>}/>
          <Route path='/transferee' element={<TransfereeForm/>}/>
          <Route path='/application/verify/:token/:id' element={<Verification/>}/>
          <Route path='/login' element={!isAuthenticated ? <Login/> : <Navigate to='/schedule'/>}/>
          {/* <Route path='/dashboard/*' element={isAuthenticated ? <Dashboard/> : <Navigate to='/login'/>}/> */}
          <Route path='/profile' element={isAuthenticated ? <Profile/> : <Navigate to='/login'/>}/>
          <Route path='/schedule' element={isAuthenticated ? <Schedule/> : <Navigate to='/login'/>}/>
          <Route path='/schedule/:id' element={isAuthenticated ? <ViewSched/> : <Navigate to='/login'/>}/>
          <Route path='/student' element={isAuthenticated ? <Student/> : <Navigate to='/login'/>}/>
          <Route path='/student/:id/*' element={isAuthenticated ? <View/> : <Navigate to='/login'/>}/>
          <Route path='/settings' element={isAuthenticated ? <Settings/> : <Navigate to='/login'/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path='/policies' element={<Policies />} />
          <Route path='*' element={<Error/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App