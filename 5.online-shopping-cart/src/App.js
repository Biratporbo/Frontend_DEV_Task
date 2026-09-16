import React from "react";
import Header from "./components/Header";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Header />
      <main className="container">
        <section className="intro">
          <p className="small-title">EVERYDAY SHOP</p>
          <h1>Simple things, easy shopping.</h1>
          <p>Pick a few products, add them to your cart, and see the total update instantly.</p>
        </section>

        <div className="shop-layout">
          <ProductList />
          <Cart />
        </div>
      </main>
    </div>
  );
}

export default App;