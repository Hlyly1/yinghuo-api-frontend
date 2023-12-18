import {
  ProColumns, ProTable,
} from '@ant-design/pro-components';
import { Modal } from 'antd';
import React from 'react';



export type Props = {
  columns: ProColumns<API.InterfaceInfo>[]
  onCancel: () => void;
  onSubmit: (values: API.InterfaceInfo) => Promise<void>;
  updateModalOpen: boolean;
  visible:boolean
};

const CreateForm: React.FC<Props> = (props) => {

  const {columns,visible,onCancel,onSubmit} = props
  return (
    <Modal visible={visible} onCancel={()=>onCancel?.()} footer={null}>
      <ProTable type={"form"} columns={columns} onSubmit={async (value)=>{
        onSubmit?.(value)
      }}/>
    </Modal>
  );
};

export default CreateForm;
