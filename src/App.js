import "./App.css";

import { WalletProvider } from "./Wallet/Wallet";
import MangoObject from "./components/MangoObject";
import WalletConnector from "./components/Header";

function App() {
  return (
    <div className="App">
      <WalletProvider>
        <WalletConnector />

        <MangoObject />
      </WalletProvider>
    </div>
  );
}

export default App;
