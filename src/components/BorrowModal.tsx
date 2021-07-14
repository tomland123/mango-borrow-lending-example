// @ts-nocheck
import Modal from "./Modal";
// import { useWallet } from "../Wallet/Wallet";
import { PublicKey } from "@solana/web3.js";

const BorrowModal = ({
  title,
  children,
  visible,
  handleCancel,
  mangoObject,
  setLoading,
}) => {
  const { symbols, ownerMarginAccounts } = mangoObject;
  const borrow = async () => {
    setLoading(true);
    await mangoObject.borrow({
      marginAccount: ownerMarginAccounts[0],
      token: new PublicKey(symbols["USDC"]),
      withdrawQuantity: 0.03,
    });
    setLoading(false);
    handleCancel();
  };

  return (
    <div>
      <Modal
        title={title}
        visible={visible}
        handleOk={() => {
          borrow();
        }}
        handleCancel={handleCancel}
        tokens={{}}
      >
        {children}
      </Modal>
    </div>
  );
};

export default BorrowModal;
