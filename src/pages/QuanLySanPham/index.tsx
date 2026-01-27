import rules from '@/utils/rules';
import { PlusOutlined } from '@ant-design/icons';
import { Popconfirm, Table, message, Button, Modal, Form, Input, Checkbox, InputNumber } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';

const BaiTap01 = () => {
  const [bienThamChieuForm] = Form.useForm();
  const { danhSachSanPham, setDanhSachSanPham } = useModel('sanpham');
  const [open, setOpen] = useState(false);
  const [sanPhamDangSua, setSanPhamDangSua] = useState({
    name: '',
    quantity: 0,
    price: 0,
    id: 99999,
  });
  const cot = [
    {
      title: 'STT',
      dataIndex: 'id',
      width: 200,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      width: 200,
      render: (value, record) => {
        console.log('value', value);
        console.log('record', record);
        return <b style={{ color: 'red' }}>{record.name}</b>;
      },
    },
    {
      title: 'Giá sản phẩm',
      dataIndex: 'price',
      width: 200,
    },
    {
      title: 'Số lượng sản phẩm',
      dataIndex: 'quantity',
      width: 200,
    },
    {
      title: 'Thao tác',
      width: 200,
      align: 'center',
      render: (value, record) => (
        <>
          <Popconfirm
            title='Bạn có chắc chắn muốn xóa sản phẩm này không?'
            onConfirm={() => {
              const danhSachSanPhamMoi = danhSachSanPham.filter((item) => item.id !== record.id);
              setDanhSachSanPham(danhSachSanPhamMoi);
              // alert('Xóa sản phẩm thành công!');
              message.info('Xóa sản phẩm thành công!');
            }}
            // onCancel={cancel}
            okText='Có'
            cancelText='Không'
          >
            <a href='#'>Xóa</a>
          </Popconfirm>
          <a
            onClick={() => {
              setOpen(true);
              setSanPhamDangSua(record);
              bienThamChieuForm.setFieldsValue(record);
            }}
            style={{ marginLeft: 8 }}
            href='#'
          >
            Sửa
          </a>
        </>
      ),
    },
  ];

  return (
    <>
      <h1>Quản lý sản phẩm</h1>
      <Button
        onClick={() => {
          setOpen(true);
        }}
        style={{
          marginBottom: 8,
        }}
        type='primary'
        icon={<PlusOutlined />}
      >
        Thêm sản phẩm mới
      </Button>
      <Table columns={cot} dataSource={danhSachSanPham} />
      <Modal
        footer={false}
        title='Basic Modal'
        visible={open}
        //  onOk={handleOk}
        onCancel={() => {
          setOpen(false);
        }}
      >
        <Form
          form={bienThamChieuForm}
          onFinish={(values) => {
            setDanhSachSanPham([...danhSachSanPham, { ...values, id: danhSachSanPham.length + 1 }]);
            setOpen(false);
            message.success('Thêm sản phẩm thành công');
          }}
          name='basic'
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          autoComplete='off'
        >
          <Form.Item
            initialValue={sanPhamDangSua.name}
            label='Tên sản phẩm'
            name='name'
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label='Giá' name='price' rules={[...rules.number(9999999999, 0)]}>
            <InputNumber />
          </Form.Item>

          <Form.Item rules={[...rules.number(9999999999, 0, false)]} name='quantity' label='Số lượng'>
            <InputNumber />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type='primary' htmlType='submit'>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default BaiTap01;