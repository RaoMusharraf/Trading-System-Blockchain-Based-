import './App.css';
import CreateTender from './components/CreateTender';
import SeeVender from './components/SeeVender';
import seeOwnerTender from './components/SeeTender';
import AllItems from './components/AllItems';
import CreateVender from './components/VenderRequest';
import Feedback from './components/Feedback';
import Payment from './components/Payment';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

function App() {
  return (
    <Router>
      <div class="topnav">
        <h1 style={{ color: 'white', textAlign: 'center' }}>TRADING SYSTEM</h1>
        <a href="/">Create Tender</a>
        <a href="/my_items">See Tender</a>
        <a href="/bundle_items">All Tenders</a>
        <a href="/Tender_request">Create Vender Request</a>
        <a href="/bundle_auction">Vender Requests</a>
        <a href="/Feedback">Feedback</a>
        <a href="/Payment">Payment</a>

      </div>
      <Switch>
        <Route exact path='/' component={CreateTender}></Route>
        <Route exact path='/bundle_auction' component={SeeVender}></Route>
        <Route exact path='/my_items' component={seeOwnerTender}></Route>
        <Route exact path='/bundle_items' component={AllItems}></Route>
        <Route exact path='/Tender_request' component={CreateVender}></Route>
        <Route exact path='/Feedback' component={Feedback}></Route>
        <Route exact path='/Payment' component={Payment}></Route>
      </Switch>
    </Router>
  );
}

export default App;
