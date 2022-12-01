import './App.css';
import CreateTender from './components/CreateTender';
import SeeVender from './components/SeeVender';
import seeOwnerTender from './components/SeeTender';
import AllItems from './components/AllItems';
import CreateVender from './components/VenderRequest';
import Feedback from './components/Feedback';
import Payment from './components/Payment';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import logo from './lilfrens-logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';



function App() {
  return (
    <Router>
      <div class="topnav">
        <div>
          <h1 id="title" style={{ textAlign: 'center' }}>
            <a href="/">
              <img src={logo} alt="Logo" /></a> </h1>
        </div>
        <div className='my-navigation'>
          <a href="/create-tender">Create Tender</a>
          <a href="/my_items">See Tender</a>
          <a href="/">All Tenders</a>
          {/* <a href="/Vender_request">Create Vender Request</a> */}
          <a href="/bundle_auction">Vender Requests</a>
          <a href="/Feedback">Feedback</a>
          <a href="/Payment">Payment</a>
        </div>

      </div>
      <Switch>
        <Route exact path='/' component={AllItems}></Route>
        <Route exact path='/create-tender' component={CreateTender}></Route>
        <Route exact path='/bundle_auction' component={SeeVender}></Route>
        <Route exact path='/my_items' component={seeOwnerTender}></Route>
        <Route exact path='/Vender_request' component={CreateVender}></Route>
        <Route exact path='/Feedback' component={Feedback}></Route>
        <Route exact path='/Payment' component={Payment}></Route>
      </Switch>
    </Router>
  );
}

export default App;
