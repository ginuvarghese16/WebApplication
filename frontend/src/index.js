import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";
import AddDetails from './AddDetails';
import EditUser from './EditUser';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<App />} />
        <Route path="App" element={<App />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/AddDetails" element={<AddDetails />} />
        <Route path="/Dashboard/AddDetails" element={<AddDetails />} />
        <Route path="/EditUser" element={<EditUser />} />
        <Route path="/Dashboard/EditUser/:emp_id" element={<EditUser />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
