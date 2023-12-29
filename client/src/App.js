import { RouterProvider, createBrowserRouter, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState, createContext, useContext, useCallback } from 'react';

import logo from './logo.svg';
import './App.css';
import {router} from "./Route";
import {AuthContextProvider} from "./AuthContext";



function App() {
  return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <AuthContextProvider>
            <RouterProvider router={router} />
          </AuthContextProvider>
        </header>
      </div>
  );
}

export default App;
