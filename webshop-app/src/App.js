import "./App.css";
import { BrowserRouter } from "react-router-dom";
import Hotjar from "@hotjar/browser";

import BookstoreRoutes from "./components/BookstoreRoutes";

function App() {
  const siteId = 5218732;
  const hotjarVersion = 6;

  Hotjar.init(siteId, hotjarVersion);

  return (
    <BrowserRouter>
      <BookstoreRoutes />
    </BrowserRouter>
  );
}

export default App;
