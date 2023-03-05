import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'semantic-ui-css/semantic.min.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import MenuBar from "./components/menubar";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import Packages from "./pages/packages";
import Error from "./pages/pageNotFound";
import Container from '@mui/material/Container';
import { PrivateRoute, PublicRoute } from "./util/AuthRoutes";
import { useSelector } from "react-redux";
import CheckoutUI from "./components/CheckoutUI";
import SinglePost from "./components/SinglePost";

function App() {

  const isLoggedIn = useSelector(state => state.auth.loginResponse);
  
  return (
    <>
      <Router>
        <MenuBar />
        <Container>
          <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/login"
                element={
                  <PublicRoute isSignedIn={isLoggedIn}>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute isSignedIn={isLoggedIn}>
                    <Register />
                  </PublicRoute>
                }
              />
              <Route path='*' element={<Error />} />
              <Route
                path="/posts/:postId"
                element={
                  <PrivateRoute isSignedIn={isLoggedIn}>
                    <SinglePost />
                  </PrivateRoute>
                }
              />
              <Route
                path="/checkout"
                element={
                  <PrivateRoute isSignedIn={isLoggedIn}>
                    <CheckoutUI />
                  </PrivateRoute>
                }
              />
              <Route
                path="/Packages"
                element={
                  <PrivateRoute isSignedIn={isLoggedIn}>
                    <Packages />
                  </PrivateRoute>
                }
              />
          </Routes>
        </Container>
      </Router>    
    </>
  );
}

export default App;
