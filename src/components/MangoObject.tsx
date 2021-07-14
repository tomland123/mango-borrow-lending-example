// @ts-nocheck

import { useEffect, useState } from "react";
import { MangoBorrowLending } from "mango-borrow-lending-client";
import { useWallet } from "../Wallet/Wallet";
import AccountSelect from "./AccountSelect";

const MinimalReproduction = () => {
  const { wallet, connected } = useWallet();
  const [loading, setLoading] = useState(false);
  const [mangoObject, setMangoObject] = useState(null);

  const createMangoObject = async () => {
    const mango = await MangoBorrowLending.create({
      wallet,
    });
    await mango.getTokensInWallet();

    setMangoObject(mango);
  };

  useEffect(() => {
    if (wallet?.publicKey?.toString() && connected) {
      createMangoObject();
    }
  }, [wallet?.publicKey?.toString() || "", connected]);

  useEffect(() => {
    console.log("check mangoobject after loading", mangoObject);
  }, [loading]);

  return (
    <div>
      {wallet?.publicKey?.toString() && (
        <div>
          <button
            onClick={async () => {
              setLoading(true);
              await mangoObject?.getBalances();
              setLoading(false);
            }}
          >
            Refetch Data
          </button>
          {mangoObject?.ownerMarginAccounts.length && (
            <ul>
              {mangoObject?.ownerMarginAccounts?.map((item) => (
                <ul>
                  {item.balances.map((i) => (
                    <li>
                      {i.coin}: Balance: {i.marginDeposits} Borrows: {i.borrows}{" "}
                      Net: {i.net}
                    </li>
                  ))}
                </ul>
              ))}
            </ul>
          )}
          <div>Your Assets</div>
          <div>
            Deposit
            <AccountSelect setLoading={setLoading} mangoObject={mangoObject} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MinimalReproduction;
