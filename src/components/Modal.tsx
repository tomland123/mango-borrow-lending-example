// @ts-nocheck

import { Modal as AntDModal } from "antd";

const Modal = ({
  title,
  children,
  visible,
  handleOk,
  handleCancel,
  tokens,
}) => {
  return (
    <div>
      <AntDModal
        title={title}
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {children}
      </AntDModal>
    </div>
  );
};

export default Modal;
