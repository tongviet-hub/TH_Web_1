import React, { useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, DatePicker, Switch, Tag, Tooltip } from 'antd';
import { SearchOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useModel, history } from 'umi';
import dayjs from 'dayjs';

function PageDanhSachCLB() {
  const dataKhoCLB = useModel('clubs' as any) as any;
  const listCauLacBo = dataKhoCLB.clubs;
  const updateListCLB = dataKhoCLB.setClubs;

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [formThongTin] = Form.useForm();
  
  // id của dòng đang sửa, nếu null nghĩa là thêm mới
  const [dangSuaId, setDangSuaId] = useState<number | null>(null);

  // setup cho thanh tim kiem cua table column
  function cauHinhTimKiem(tentruong: string, tieuDeColl: string) {
    return {
      filterDropdown: (propsFilter: any) => {
        return (
          <div style={{ padding: '10px' }}>
            <Input
              placeholder={`Tìm ${tieuDeColl}...`}
              value={propsFilter.selectedKeys[0]}
              onChange={(evt) => {
                let val = evt.target.value;
                propsFilter.setSelectedKeys(val ? [val] : []);
              }}
              onPressEnter={() => propsFilter.confirm()}
              style={{ marginBottom: '10px', display: 'block' }}
            />
            <Space>
              <Button type="primary" onClick={() => propsFilter.confirm()} icon={<SearchOutlined />} size="small" style={{ width: 85 }}>
                Tìm
              </Button>
              <Button onClick={() => { propsFilter.clearFilters(); propsFilter.confirm(); }} size="small" style={{ width: 85 }}>
                Xoá
              </Button>
            </Space>
          </div>
        );
      },
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : 'gray' }} />
      ),
      onFilter: (value: any, hangData: any) => {
        if (!hangData[tentruong]) return false;
        let giaTriChuoi = hangData[tentruong].toString().toLowerCase();
        let tuKhoa = (value as string).toLowerCase();
        return giaTriChuoi.includes(tuKhoa);
      }
    };
  }

  // khi an luu tren form modal
  const xuLySubmit = (giaTriForm: any) => {
    let clbMoiVauAdd = { 
      ...giaTriForm, 
      id: dangSuaId ? dangSuaId : new Date().getTime(), 
      foundedDate: giaTriForm.foundedDate ? giaTriForm.foundedDate.format('YYYY-MM-DD') : undefined,
      isActive: giaTriForm.isActive !== undefined ? giaTriForm.isActive : true 
    };

    updateListCLB((mangCu: any[]) => {
      if (dangSuaId) {
        // day la sua
        let index = mangCu.findIndex(c => c.id === dangSuaId);
        if (index > -1) {
          mangCu[index] = clbMoiVauAdd;
        }
        return [...mangCu];
      } else {
        // them moi vao cuoi
        return [...mangCu, clbMoiVauAdd];
      }
    });

    setIsOpenModal(false); // tat form
  };

  const taoCotTable = () => {
    return [
      { 
        title: 'Ảnh đại diện', 
        dataIndex: 'avatar', 
        render: (linkAnh: string) => {
          if (linkAnh) {
             return <img src={linkAnh} style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover' }} alt="anh" />;
          }
          return <div style={{width: 45, height: 45, borderRadius: '50%', backgroundColor: '#eee'}}/>;
        }
      },
      { 
        title: 'Tên CLB', 
        dataIndex: 'name', 
        key: 'name',
        sorter: (a: any, b: any) => a.name.localeCompare(b.name),
        ...cauHinhTimKiem('name', 'Tên câu lạc bộ')
      },
      { 
        title: 'Chủ nhiệm CLB', 
        dataIndex: 'leader', 
        sorter: (a: any, b: any) => (a.leader || '').localeCompare(b.leader || ''),
        ...cauHinhTimKiem('leader', 'Chủ nhiệm')
      },
      { 
        title: 'Ngày thành lập', 
        dataIndex: 'foundedDate',
        sorter: (a: any, b: any) => {
          let t1 = new Date(a.foundedDate).getTime();
          let t2 = new Date(b.foundedDate).getTime();
          return t1 - t2;
        }
      },
      {
        title: 'Mô tả (HTML)',
        dataIndex: 'description',
        render: (ndung: string) => (
          <Tooltip title={<div dangerouslySetInnerHTML={{ __html: ndung || '' }} />}>
            <div 
              style={{ maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
              dangerouslySetInnerHTML={{ __html: ndung || '' }} 
            />
          </Tooltip>
        )
      },
      { 
        title: 'Đang hoạt động', 
        dataIndex: 'isActive', 
        filters: [{ text: 'Có HD', value: true }, { text: 'Ngừng', value: false }],
        onFilter: (giaTriLoc: any, dongThucTe: any) => dongThucTe.isActive === giaTriLoc,
        render: (hoatDong: boolean) => {
          if (hoatDong) return <Tag color="green">Đang HD</Tag>;
          return <Tag color="red">Dừng Hoạt Động</Tag>;
        }
      },
      { 
        title: 'Cột thao tác', 
        render: (_: any, hang: any) => (
          <Space>
            <Tooltip title="Xem list thành viên">
              <Button type="default" icon={<EyeOutlined />} onClick={() => history.push(`/TH05/QuanLyThanhVien?clubId=${hang.id}`)} />
            </Tooltip>

            <Tooltip title="Cập nhật">
              <Button type="dashed" icon={<EditOutlined />} onClick={() => { 
                setDangSuaId(hang.id); 
                formThongTin.setFieldsValue({ 
                  ...hang, 
                  foundedDate: hang.foundedDate ? dayjs(hang.foundedDate) : null 
                }); 
                setIsOpenModal(true); 
              }} />
            </Tooltip>

            <Tooltip title="Xoá bỏ">
              <Button danger icon={<DeleteOutlined />} onClick={() => {
                let xoaXong = listCauLacBo.filter((c: any) => c.id !== hang.id);
                updateListCLB(xoaXong);
              }} />
            </Tooltip>
          </Space>
        )
      }
    ];
  };

  return (
    <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px' }}>
      <Button 
        type="primary" 
        onClick={() => { 
          setDangSuaId(null); 
          formThongTin.resetFields(); 
          formThongTin.setFieldsValue({ isActive: true }); 
          setIsOpenModal(true); 
        }} 
        style={{ marginBottom: '20px' }}
      >
        + Đăng ký CLB mới
      </Button>

      <Table 
        columns={taoCotTable()} 
        dataSource={listCauLacBo} 
        rowKey="id" 
        pagination={{ pageSize: 8 }} 
        scroll={{ x: '100%' }} 
        bordered 
      />

      <Modal 
        title={dangSuaId ? "Cập nhật tài liệu CLB" : "Khai báo CLB mới"} 
        visible={isOpenModal} 
        onOk={() => formThongTin.submit()} 
        onCancel={() => setIsOpenModal(false)} 
        width={650}
      >
        <Form form={formThongTin} layout="vertical" onFinish={xuLySubmit}>
          <Form.Item name="avatar" label="Đường link nạp Ảnh đại diện">
            <Input placeholder="Vd: https://hinhanh.com/1.png" />
          </Form.Item>
          
          <Form.Item name="name" label="Tên Câu lạc bộ (*)" rules={[{ required: true, message: 'Nhập tên CLB' }]}>
            <Input placeholder="Tên câu lạc bộ...." />
          </Form.Item>
          
          <Form.Item name="leader" label="Người chủ nhiệm (*)" rules={[{ required: true, message: 'Nhập người quản lý' }]}>
            <Input placeholder="Họ và tên chủ nhiệm" />
          </Form.Item>
          
          <Form.Item name="foundedDate" label="Chọn ngày thành lập">
            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item name="description" label="Đoạn văn mô tả (hỗ trợ nhập thẻ HTML)">
            <Input.TextArea rows={5} placeholder="Nhập chữ hoặc chèn mã HTML vào mảng này..." />
          </Form.Item>
          
          <Form.Item name="isActive" label="Tình trạng CLB nàuy" valuePropName="checked">
            <Switch checkedChildren="ON" unCheckedChildren="OFF" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default PageDanhSachCLB;