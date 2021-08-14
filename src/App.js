import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import "./styles/output.css";
import { CodeEditor } from "./Editor";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { PreviewPage } from "./PreviewPage";
// Create a client
const queryClient = new QueryClient();
const App = () => {
  return (
    <Router basename="/lambda-components-editor">
      <QueryClientProvider client={queryClient}>
        <Route path="/" exact>
          <div className="App ">
            <CodeEditor></CodeEditor>
          </div>
        </Route>
        <Route path="/preview" exact>
          <PreviewPage />
        </Route>
      </QueryClientProvider>
    </Router>
  );
};

export default App;
