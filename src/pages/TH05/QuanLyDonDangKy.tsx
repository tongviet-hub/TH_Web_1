import React, { useState } from 'react';
import { Table, Button, Space, Modal, Input, Tag, message, Drawer, Form, Select, Descriptions, Typography, List } from 'antd';
import { useModel } from 'umi';
import { EditOutlined, EyeOutlined, DeleteOutlined, CheckSquareOutlined, StopOutlined } from '@ant-design/icons';

const QuanLyHoSoDonDangKy = () => {
  const khoData = useModel('clubs' as any) as any;
  const listDonCuaUsers = khoData.apps;
  const updateDon = khoData.setApps;
  const listClbDangCo = khoData.clubs;
  const funcDuyetTuChoi = khoData.updateAppStatus;

  const [mangIdDangChon, setMangIdDangChon] = useState<number[]>([]);

  // trang thai cho modal hien li do tu choi
  const [showModalTuChoi, setShowModalTuChoi] = useState(false);
  const [txtLyDoHuy, setTxtLyDoHuy] = useState('');

  // trang thai cho ngan keo xet duyet
  const [showDrawer, setShowDrawer] = useState(false);
  const [donDangXem, setDonDangXem] = useState<any>(null);

  const [hienFormAddSua, setHienFormAddSua] = useState(false);
  const [formChiTietApp] = Form.useForm();
  const [idChinhSua, setIdChinhSua] = useState<number | null>(null);

  // bấm nút xanh
  function clickDuyetHet() {
    funcDuyetTuChoi(mangIdDangChon, 'Approved', 'Được thông qua yêu cầu');
    message.success('Đã approve ' + mangIdDangChon.length + ' đối tượng');
    setMangIdDangChon([]);
  }

  // bấm nút xác nhận trong modal từ chối
  function verifyTừChối() {
    if (txtLyDoHuy.length < 3) {
      message.error('Phải nhập lý do cụ thể nhé bro!');
      return;
    }
    funcDuyetTuChoi(mangIdDangChon, 'Rejected', txtLyDoHuy);
    message.success('Đã đá văng ' + mangIdDangChon.length + ' đơn');

    // reset form tu choi
    setShowModalTuChoi(false);
    setMangIdDangChon([]);
    setTxtLyDoHuy('');
  }

  // xoá hẳn cái đơn
  const deleteDonNayDi = (idXoa: number) => {
    let listMoi = listDonCuaUsers.filter((a: any) => a.id !== idXoa);
    updateDon(listMoi);
    message.info('Xoá bay màu r');
  };

  const dayDuLieuVoList = (formDuLieu: any) => {
    if (idChinhSua) {
      // tim id va update
      let mng = listDonCuaUsers.map((item: any) => {
        if (item.id === idChinhSua) return { ...item, ...formDuLieu };
        return item;
      });
      updateDon(mng);
      message.success('Update done!');
    } else {
      // tao record moi toanh
      let recMoi = {
        ...formDuLieu,
        id: new Date().getTime(),
        status: 'Pending',
        history: []
      };

      let cloned = [...listDonCuaUsers];
      cloned.push(recMoi);
      updateDon(cloned);
      message.success('Tạo ok');
    }
    setHienFormAddSua(false);
  };

  const cotCuaBang = [
    { title: 'Tên người dùng', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Hộp thư điện tử', dataIndex: 'email', key: 'email' },
    { title: 'Tel', dataIndex: 'phone', key: 'phone' },
    { title: 'GT', dataIndex: 'gender', key: 'gender' },
    {
      title: 'Tên Ban/Câu Lạc Bộ',
      render: (a: any, recordD: any) => {
        let theClub = listClbDangCo.find((c: any) => c.id === recordD.clubId);
        if (theClub) return theClub.name;
        return 'Chưa rõ';
      }
    },
    {
      title: 'Trạng Thái Form',
      dataIndex: 'status',
      render: (trangthai: string) => {
        if (trangthai === 'Approved') return <Tag color="green">Đã Chấm</Tag>;
        if (trangthai === 'Rejected') return <Tag color="red">Bị Loạii</Tag>;
        return <Tag color="gold">Chờ Xếp Hàng</Tag>;
      }
    },
    {
      title: 'Note & History',
      dataIndex: 'note',
      render: (dongNote: string, recordDong: any) => {
        return (
          <a style={{ textDecoration: 'underline' }} onClick={() => {
            setDonDangXem(recordDong);
            setShowDrawer(true);
          }}>
            {dongNote ? "Có lịch sử" : "Xem Trống"}
          </a>
        );
      }
    },
    {
      title: 'Actions',
      render: (_: any, r: any) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => { setDonDangXem(r); setShowDrawer(true); }} size="small" />
          <Button icon={<EditOutlined />} onClick={() => {
            setIdChinhSua(r.id);
            formChiTietApp.setFieldsValue(r);
            setHienFormAddSua(true);
          }} size="small" />
          <Button danger icon={<DeleteOutlined />} onClick={() => deleteDonNayDi(r.id)} size="small" />
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '15px 30px', backgroundColor: '#fafafa', minHeight: '100vh' }}>
      <Space size="large" style={{ marginBottom: 20 }}>
        <Button size="large" onClick={() => { setIdChinhSua(null); formChiTietApp.resetFields(); setHienFormAddSua(true); }}>
          + Thêm đơn đăng ký CLB
        </Button>

        <Button
          type="primary"
          icon={<CheckSquareOutlined />}
          style={{ backgroundColor: 'green', borderColor: 'darkgreen' }}
          disabled={mangIdDangChon.length === 0}
          onClick={clickDuyetHet}
        >
          Duyệt đồng loạt ({mangIdDangChon.length} item)
        </Button>

        <Button
          type="primary"
          danger
          icon={<StopOutlined />}
          disabled={mangIdDangChon.length === 0}
          onClick={() => setShowModalTuChoi(true)}
        >
          Trảm đồng loạt ({mangIdDangChon.length} item)
        </Button>
      </Space>

      <Table
        rowSelection={{
          onChange: (mangCuaKeyTraVe) => setMangIdDangChon(mangCuaKeyTraVe as number[]),
          selectedRowKeys: mangIdDangChon
        }}
        columns={cotCuaBang}
        dataSource={listDonCuaUsers}
        rowKey="id"
      />

      <Modal
        title="Ghi rõ lý do bạn không cho Ứng viên tham gia?"
        visible={showModalTuChoi}
        onOk={verifyTừChối}
        onCancel={() => { setShowModalTuChoi(false); setTxtLyDoHuy(''); }}
      >
        <Input.TextArea
          placeholder="Viết lý do vào đây bạn ơi..."
          rows={5}
          value={txtLyDoHuy}
          onChange={event => setTxtLyDoHuy(event.target.value)}
        />
      </Modal>

      <Modal
        title={idChinhSua ? "🛠 Cập nhật Đơn từ" : "📝 New Record Đăng Kí"}
        visible={hienFormAddSua}
        onOk={() => formChiTietApp.submit()}
        onCancel={() => setHienFormAddSua(false)}
        width={750}
      >
        <Form form={formChiTietApp} layout="vertical" onFinish={dayDuLieuVoList}>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 45%' }}>
              <Form.Item name="fullName" label="Họ tên TV" rules={[{ required: true }]}><Input /></Form.Item>
              <Form.Item name="email" label="Mail liên lạc"><Input type="email" /></Form.Item>
              <Form.Item name="gender" label="Giới tính ruột">
                <Select>
                  <Select.Option value="Nam">Nam</Select.Option>
                  <Select.Option value="Nữ">Nữ</Select.Option>
                  <Select.Option value="Khác">LGBT / Khác</Select.Option>
                </Select>
              </Form.Item>
            </div>

            <div style={{ flex: '1 1 45%' }}>
              <Form.Item name="clubId" label="Đăng ký vào CLB" rules={[{ required: true }]}>
                <Select>
                  {listClbDangCo.map((clbs: any) => <Select.Option key={clbs.id} value={clbs.id}>{clbs.name}</Select.Option>)}
                </Select>
              </Form.Item>
              <Form.Item name="phone" label="Số Alo"><Input /></Form.Item>
              <Form.Item name="address" label="Nơi cư ngụ"><Input /></Form.Item>
            </div>
          </div>
          <Form.Item name="skills" label="Kỹ năng chính thống"><Input.TextArea rows={2} /></Form.Item>
          <Form.Item name="reason" label="Vì sao bạn muốn vào Club"><Input.TextArea rows={3} /></Form.Item>
        </Form>
      </Modal>

      <Drawer
        title="Thông tin chi tiết và hành trình đơn đăng kí"
        placement="right"
        width={580}
        onClose={() => setShowDrawer(false)}
        visible={showDrawer}
      >
        {donDangXem !== null ? (
          <div>
            <Descriptions title="Hồ Sơ Tổng quát 👩🏻‍💻" bordered column={1}>
              <Descriptions.Item label="Định danh">{donDangXem.fullName}</Descriptions.Item>
              <Descriptions.Item label="Club Apply">{listClbDangCo.find((o: any) => o.id === donDangXem.clubId)?.name}</Descriptions.Item>
              <Descriptions.Item label="Hòm Thư">{donDangXem.email}</Descriptions.Item>
              <Descriptions.Item label="Vùng miền">{donDangXem.address}</Descriptions.Item>
              <Descriptions.Item label="Tech Stack / Năng khiếu">{donDangXem.skills}</Descriptions.Item>
              <Descriptions.Item label="Tại sao apply?">{donDangXem.reason}</Descriptions.Item>
            </Descriptions>

            <div style={{ fontSize: '18px', fontWeight: 'bold', marginTop: 30, marginBottom: 15 }}>
              Các Bức Theo Dấu Hệ Thống
            </div>

            <List
              bordered
              dataSource={donDangXem.history || []}
              renderItem={(log: any) => {
                let mauSacText = log.action === 'Approved' ? 'green' : 'red';
                return (
                  <List.Item>
                    <List.Item.Meta
                      title={<span style={{ color: mauSacText }}>• System chọc ngoáy: {log.action}</span>}
                      description={`Lý do để lại: ${log.reason} (Log time: ${log.time})`}
                    />
                  </List.Item>
                )
              }}
              locale={{ emptyText: 'Chưa có record nào cả' }}
            />
          </div>
        ) : null}
      </Drawer>
    </div>
  );
};

export default QuanLyHoSoDonDangKy;