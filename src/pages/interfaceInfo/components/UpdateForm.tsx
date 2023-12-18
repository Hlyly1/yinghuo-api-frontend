import {
  ProColumns, ProFormInstance, ProTable,
} from '@ant-design/pro-components';
import { Modal } from 'antd';
import React, {useEffect, useRef, useState} from 'react';



export type Props = {
  values:API.InterfaceInfo
  columns: ProColumns<API.InterfaceInfo>[]
  onCancel: () => void;
  onSubmit: (values: API.InterfaceInfo,id:number) => Promise<void>;
  visible:boolean
};

const UpdateForm: React.FC<Props> = (props) => {

  const {columns,visible,onCancel,onSubmit,values} = props
  const formRef = useRef<ProFormInstance>()
  const [id,setId] = useState(0);
  useEffect(()=>{
    console.log(values)
    setId(values.id)
    formRef.current?.setFieldsValue(values)
  },[values])
  return (
    <Modal visible={visible} onCancel={()=>onCancel?.()} footer={null}>
      <ProTable type="form" form={{initialValues:values}} formRef={formRef} columns={columns} onSubmit={async (values)=>{
        onSubmit?.(values,id)
      }}/>
    </Modal>
  );
};

export default UpdateForm;
