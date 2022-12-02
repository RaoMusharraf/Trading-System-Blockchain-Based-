import './App.css';
import CreateTender from './components/CreateTender';
import SeeVender from './components/SeeVender';
import SeeTender from './components/SeeTender';
import AllItems from './components/AllItems';
import CreateVender from './components/VenderRequest';
import Feedback from './components/Feedback';
import Payment from './components/Payment';
import { BrowserRouter as Router, Route, Link, Switch, NavLink, Routes } from "react-router-dom";
import logo from './lilfrens-logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';



function App() {
  return (

    <>
      <div class="topnav">
        <div>
          <h1 id="title" style={{ textAlign: 'center' }}>
            <a href="/">
              <img src={logo} alt="Logo" /></a> </h1>
        </div>
        <div className='my-navigation'>
          <NavLink to="/create-tender">Create Tender</NavLink>
          <NavLink to="/see-tender">See Tender</NavLink>
          <NavLink to="/">All Tenders</NavLink>
          {/* <a href="/Vender_request">Create Vender Request</a> */}
          <NavLink to="/bundle_auction">Vender Requests</NavLink>
          <NavLink to="/Feedback">Feedback</NavLink>
          <NavLink to="/Payment">Payment</NavLink>
        </div>

      </div>
      <Routes>
        <Route path='/' element={<AllItems />}></Route>
        <Route path='/create-tender' element={<CreateTender />}></Route>
        <Route path='/bundle_auction' element={<SeeVender />}></Route>
        <Route path='/see-tender' element={<SeeTender />}></Route>
        <Route path='/Vender_request' element={<CreateVender />}></Route>
        <Route path='/Feedback' element={<Feedback />}></Route>
        <Route path='/Payment' element={<Payment />}></Route>
      </Routes>

    </>
  );
}

export default App;
