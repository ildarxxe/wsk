import './App.css';
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Home from "./views/Home";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Menu from "./components/common/Menu";
import {useEffect} from "react";
import GenerationImage from "./views/GenerationImage";
import RecognizeImage from "./views/RecognizeImage";
import Login from "./views/auth/Login";
import Register from "./views/auth/Register";

function App() {
    const isLogged = localStorage.getItem("token") !== null || '';
    useEffect(() => {
        if (isLogged) {
            const logo = document.querySelector(".header__logo");
            logo.onclick = () => {
                document.querySelector('.menu').classList.toggle('hidden');
            }
        }
    }, [isLogged]);
    return (
        <BrowserRouter>
            <Header />
            {isLogged ? <Menu /> : null}
            <div className="app">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/generation-image" element={isLogged ? <GenerationImage /> : null} />
                    <Route path="/recognize" element={isLogged ? <RecognizeImage /> : null} />
                    <Route path="/signin" element={!isLogged ? <Login /> : <Home />} />
                    <Route path="/signup" element={!isLogged ? <Register /> : <Home />} />
                </Routes>
            </div>
            <Footer />
        </BrowserRouter>
    );
}

export default App;
