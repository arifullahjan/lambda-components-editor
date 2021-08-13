import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import "./styles/output.css";
import { CodeEditor } from "./Editor";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
// Create a client
const queryClient = new QueryClient();
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App ">
        <CodeEditor></CodeEditor>
      </div>
    </QueryClientProvider>
  );
};

export default App;
