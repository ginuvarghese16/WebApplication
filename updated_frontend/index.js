import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";
import AddDetails from './AddDetails';
import UpdateDetails from './UpdateDetails';
import {Navigate} from 'react-router-dom';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  //<React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<App />} />
        <Route path="App" element={<App />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/AddDetails" element={<AddDetails />} />
        <Route path="/Dashboard/AddDetails" element={<AddDetails />} />
        <Route path="/Dashboard/UpdateDetails/:emp_id" element={<UpdateDetails />} />
      </Routes>
    </BrowserRouter>
  //</React.StrictMode>
);

reportWebVitals();
