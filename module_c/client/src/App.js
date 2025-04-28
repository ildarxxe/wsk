import './App.css';
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Home from "./views/Home";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Menu from "./components/common/Menu";
import GenerationImage from "./views/GenerationImage";
import RecognizeImage from "./views/RecognizeImage";
import Login from "./views/auth/Login";
import Register from "./views/auth/Register";

function App() {
    const isLogged = localStorage.getItem("token");
    return (
        <BrowserRouter>
            <Header />
            {isLogged ? <Menu /> : null}
            <div className="app">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/generation-image" element={isLogged ? <GenerationImage /> : <Login />} />
                    <Route path="/recognize" element={isLogged ? <RecognizeImage /> : <Login />} />
                    <Route path="/signin" element={!isLogged ? <Login /> : <Home />} />
                    <Route path="/signup" element={!isLogged ? <Register /> : <Home />} />
                </Routes>
            </div>
            <Footer />
        </BrowserRouter>
    );
}

export default App;
