import React, { useContext } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { PageTransition } from "@steveeeie/react-page-transition";
import { pages } from "../data";
import { AppContext } from "./AppContext";
import { Page } from "./Page/Page";


export function Routes() {
  const { preset, enterAnimation, exitAnimation } = useContext(AppContext);

  return (
    <>
      <Route exact path="/" render={() => <Redirect to="/profile" />} />

      <Route
        render={({ location }) => (
          <PageTransition
            preset={preset}
            transitionKey={location.pathname}
            enterAnimation={enterAnimation}
            exitAnimation={exitAnimation}
          >
            <Switch location={location}>
              {pages.map((page, index) => {
                return (
                  <Route
                    key={index}
                    exact
                    path={page.path}
                    render={() => <Page page={page} />}
                  />
                );
              })}
              <Route exact path="/" render={() => <Redirect to="/profile" />} />
            </Switch>
          </PageTransition>
        )}
      />
    </>
  );
}
