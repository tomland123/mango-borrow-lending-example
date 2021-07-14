// @ts-nocheck
import { useState, useEffect } from "react";
import { Button, Select } from "antd";
import "antd/dist/antd.css";
import Modal from "./Modal";
import BorrowModal from "./BorrowModal";
import { PublicKey } from "@solana/web3.js";

const { Option } = Select;

type AccountSelectProps = {
  accounts: any[];
  selectedAccount: any;
  onSelectAccount: (x) => any;
  getBalance?: (x) => any;
  hideAddress?: boolean;
  symbols?: { [key: string]: string };
  mangoObject: any;
};

const AccountSelect = ({
  mangoObject = {},
  setLoading,
}: AccountSelectProps) => {
  const [depositModal, setDepositModal] = useState(false);
  const [borrowModal, setBorrowModal] = useState(false);
  const [settleModal, setSettleModal] = useState(false);

  function handleChange(value) {
    console.log(`selected ${value}`);
  }

  return (
    <div>
      {(mangoObject?.mangoTokenInfo?.missingTokens?.length ||
        mangoObject?.mangoTokenInfo?.activeWallets?.length) && (
        <Select
          defaultValue={mangoObject?.mangoTokenInfo?.activeWallets?.[0].type}
          style={{ width: 120 }}
          onChange={handleChange}
        >
          {mangoObject?.mangoTokenInfo?.activeWallets?.map((item) => (
            <Option value={item.type}>
              {item.type} {item.account.amount}
            </Option>
          ))}
          {mangoObject?.mangoTokenInfo?.missingTokens?.map((item) => (
            <Option value={item} disabled>
              {item}
            </Option>
          ))}
        </Select>
      )}
      <Button onClick={() => setDepositModal(true)}>
        Deposit first item in your wallet
      </Button>

      {/* We need lending protocol */}
      <Button onClick={() => setBorrowModal(true)}>Borrow $.03</Button>

      <Button onClick={() => setSettleModal(true)}>
        Pay back up to $.01 of debt
      </Button>

      {depositModal && (
        <Modal
          title={"Deposit Modal"}
          visible={depositModal}
          handleOk={() =>
            mangoObject.deposit({
              tokenDetail: mangoObject?.mangoTokenInfo?.activeWallets?.[0],
              quantity: 0.01,
            })
          }
          handleCancel={() => setDepositModal(false)}
        >
          <div>
            Deposit Some {mangoObject?.mangoTokenInfo?.activeWallets?.[0].type}
          </div>
        </Modal>
      )}

      {borrowModal && (
        <BorrowModal
          title={"Lending Modal"}
          visible={borrowModal}
          setLoading={setLoading}
          handleCancel={() => setBorrowModal(false)}
          mangoObject={mangoObject}
        >
          Borrow $.03 USDC
        </BorrowModal>
      )}

      {settleModal &&
        mangoObject?.ownerMarginAccounts?.[0]?.balances?.find(
          (element) => element.coin === "USDC",
        ) && (
          <Modal
            title={"Lending Modal"}
            visible={settleModal}
            handleOk={async () => {
              setLoading(true);

              await mangoObject.repay({
                marginAccount: mangoObject.ownerMarginAccounts[0],
                asset: mangoObject?.ownerMarginAccounts?.[0].balances.find(
                  (element) => element.coin === "USDC",
                ),
                settleQuantity: 0.01,
                tokenDetail: mangoObject?.mangoTokenInfo?.activeWallets?.find(
                  (element) => element.type === "USDC",
                ),
              });
              await mangoObject.getBalances();
              setLoading(false);
              setSettleModal(false);
            }}
            handleCancel={() => setSettleModal(false)}
          >
            Pay back 1 cent, or settle the balance
          </Modal>
        )}
    </div>
  );
};

export default AccountSelect;
