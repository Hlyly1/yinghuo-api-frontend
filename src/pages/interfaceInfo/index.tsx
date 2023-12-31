import { removeRule  } from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  FooterToolbar,

  PageContainer,
  ProDescriptions,

  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Drawer, Input, message } from 'antd';
import React, { useRef, useState } from 'react';
import UpdateForm from './components/UpdateForm';
import {
  addinterfaceInfoUsingPost, deleteinterfaceInfoUsingPost,
  listinterfaceInfoByPageUsingGet, updateinterfaceInfoUsingPost
} from "@/services/yinghuoApi-backend/interfaceInfoController";
import {SortOrder} from "antd/lib/table/interface";
import CreateForm from "@/pages/interfaceInfo/components/CreateForm";







const TableList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.RuleListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>([]);

  /**
   * @en-US Update node
   * @zh-CN 更新节点
   *
   * @param fields
   */
  const handleUpdate = async (fields: API.InterfaceInfo,id:number) => {
    const hide = message.loading('修改中...');
    console.log(fields)
    try {
      await updateinterfaceInfoUsingPost({
        id:id,
        ...fields
      });
      hide();
      message.success('操作成功!');
      return true;
    } catch (error:any) {
      hide();
      message.error('操作失败!' + error.message);
      return false;
    }
  };

  /**
   * @en-US Add node
   * @zh-CN 添加节点
   * @param fields
   */
  const handleAdd = async (fields: API.InterfaceInfo) => {
    const hide = message.loading('正在添加');
    try {
      await addinterfaceInfoUsingPost({ ...fields });
      hide();
      message.success('创建成功!');
      handleModalOpen(false)
      actionRef.current?.reload()
      return true;
    } catch (error:any) {
      hide();
      message.error('创建失败!'+ error.message);
      return false;
    }
  };
  /**
   *  Delete node
   * @zh-CN 删除节点
   *
   * @param selectedRows
   */
  const handleRemove = async (recodes: API.InterfaceInfo) => {
    const hide = message.loading('正在删除');
    if (!recodes) return true;
    try {
      await deleteinterfaceInfoUsingPost({
        id:recodes.id
      });
      hide();
      message.success('删除成功');
      actionRef.current?.reload()
      return true;
    } catch (error:any) {
      hide();
      message.error('删除失败' + error.message);
      return false;
    }
  };

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const columns: ProColumns<API.InterfaceInfo>[] = [
    {
      title: "id",
      dataIndex: 'id',
      valueType:'index',
    },
    {
      title: "接口名称",
      dataIndex: 'name',
      valueType:'text',
    },
    {
      title: "描述",
      dataIndex: 'description',
      valueType: 'textarea',
    },
    {
      title: "请求方法",
      dataIndex: 'method',
      valueType: 'text',
    },
    {
      title: "请求头",
      dataIndex: 'requestHeader',
      valueType: 'textarea',
    },
    {
      title: "响应头",
      dataIndex: 'responseHeader',
      valueType: 'textarea',
    },
    {
      title: "接口地址",
      dataIndex: 'url',
      valueType: 'text',
    },
    {
      title: "状态",
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: '关闭',
          status: 'Default',
        },
        1: {
          text: '开启',
          status: 'Processing',
        },

      },
    },
    {
      title: "创建时间",
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInForm:true
    },
    {
      title: "更新时间",
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      hideInForm:true
    },
    {
      title: "操作",
      dataIndex: 'option',
      valueType: 'option',
      render:(_,record) =>[
        <a
          key="config"
          onClick={()=>{
          handleUpdateModalOpen(true)
          setCurrentRow(record)
        }}>修改</a>,

        <a
          key="config"
          onClick={()=>{
            handleRemove(record)
          }}>删除</a>
      ]
    },

  ];

  return (
    <PageContainer>
      <ProTable<API.RuleListItem, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.title',
          defaultMessage: '接口数据',
        })}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="新建" />
          </Button>,
        ]}
        request={async (params , sort: Record<string, SortOrder>, filter: Record<string, (string | number)[] | null>) =>{
          const res:any =await listinterfaceInfoByPageUsingGet({
            ...params as any
          })
          if(res.data){
            return {
              data : res.data.records || [],
              success:true,
              total:res?.data.total
            }
          }else{
            return {
              data :  [],
              success:false,
              total:0
            }
          }
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="Chosen" />{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage id="pages.searchTable.item" defaultMessage="项" />
              &nbsp;&nbsp;
              <span>
                <FormattedMessage
                  id="pages.searchTable.totalServiceCalls"
                  defaultMessage="Total number of service calls"
                />{' '}
                {selectedRowsState.reduce((pre, item) => pre + item.callNo!, 0)}{' '}
                <FormattedMessage id="pages.searchTable.tenThousand" defaultMessage="万" />
              </span>
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            <FormattedMessage
              id="pages.searchTable.batchDeletion"
              defaultMessage="Batch deletion"
            />
          </Button>
          <Button type="primary">
            <FormattedMessage
              id="pages.searchTable.batchApproval"
              defaultMessage="Batch approval"
            />
          </Button>
        </FooterToolbar>
      )}

      <UpdateForm
        columns={columns}
        onSubmit={async (value,id) => {
          console.log(value,id)
          const success = await handleUpdate(value,id);
          if (success) {
            handleUpdateModalOpen(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalOpen(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        visible={updateModalOpen}
        values={currentRow || {}}
      />

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<API.RuleListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.RuleListItem>[]}
          />
        )}
      </Drawer>
      <CreateForm updateModalOpen={updateModalOpen} columns={columns} onCancel={()=>{handleModalOpen(false)}}
                  onSubmit={(value)=>{handleAdd(value)}} visible={createModalOpen}/>
    </PageContainer>
  );
};

export default TableList;
