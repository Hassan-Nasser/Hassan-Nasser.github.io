import React from "react";
import { Navigation } from "./components/Navigation/Navigation";
import PageScroller from "./components/PageScroller/PageScroller";
import PageIndicator from "./components/PageIndicator/PageIndicator";
import Profile from "./components/Profile/Profile";
import Work from "./components/Work/Work";
import Review from "./components/Review/Review";
import Highlight from "./components/Highlight/Highlight";
import Portfolio from "./components/Portfolio/Portfolio";
import Page from "./components/Page/Page";
import Contact from "./components/Contact/Contact";
import "./GlobalStyles.scss";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <PageScroller style={{ display: 'flex', flexDirection: 'column' }}>
        <Navigation />
        <PageIndicator />
        <Page className='page'
          style={{ backgroundColor: '#004a7c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          nav-title={'Num 1'}>
          <Profile />
        </Page>
        <Page className='page' style={{ backgroundColor: '#445f85', display: 'flex', alignItems: 'center', justifyContent: 'center' }} nav-title={'Num 2'}>
          <Work />
        </Page>
        <Page style={{ backgroundColor: '#488fb1', display: 'flex', alignItems: 'center', justifyContent: 'center' }} nav-title={'Num 3'}>
          <Review />
        </Page>
        <Page style={{ backgroundColor: 'rgb(0 87 131)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} nav-title={'Num 3'}>
          <Highlight />
        </Page>
        <Page style={{ backgroundColor: 'rgb(71 255 230)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} nav-title={'Num 4'}>
          <Portfolio />
        </Page>
        <Page style={{ backgroundColor: 'rgb(0 87 131)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} nav-title={'Num 5'}>
          <Contact />
        </Page>

      </PageScroller>
    );
  }

}


export default App;
