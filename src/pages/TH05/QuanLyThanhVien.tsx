import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Select, Tag, message, Space, Tabs } from 'antd';
import { useModel, useLocation } from 'umi';
import { SwapOutlined, TeamOutlined } from '@ant-design/icons';

function TrangThanhVienCacCauLacBo() {
  const khoDataCLB = useModel('clubs' as any) as any;
  const dsUserForm = khoDataCLB.apps;
  const dsClubs = khoDataCLB.clubs;
  const chucNangUpdateApps = khoDataCLB.setApps;
  
  // lay tren thanh cong cu web URL (query string params)
  const diaChiURL = useLocation() as any;
  const idCLBTimKemUrl = diaChiURL.query?.clubId ? diaChiURL.query.clubId.toString() : null;
  
  // mang cac checkbox o dong
  const [mangRauDangChon, setMangRauDangChon] = useState<number[]>([]);
  const [hienHopThoaiMove, setHienHopThoaiMove] = useState(false);
  const [idClbSapDaSang, setIdClbSapDaSang] = useState<number | null>(null);
  const [dieuHuongBanTab, setDieuHuongBanTab] = useState<string>('');

  useEffect(() => {
    if (idCLBTimKemUrl) {
      setDieuHuongBanTab(idCLBTimKemUrl);
    } else {
       if (dsClubs.length > 0 && dieuHuongBanTab === '') {
         setDieuHuongBanTab(String(dsClubs[0].id));
       }
    }
  }, [dsClubs, idCLBTimKemUrl]);

  // loc ra nguoi ta Approved da
  const hsDuocDuetChoVao = dsUserForm.filter((ng: any) => ng.status === 'Approved');

  function chotDonBamNutChuyenBan() {
    if (idClbSapDaSang == null) {
      message.error('Ơ chưa chọn CLB mới à bạn trẻ?');
      return;
    }

    let taoMangMoi = dsUserForm.map((motRecord: any) => {
      // xem ngnay co nam trong dach sach ban checkbox ko
      let laNguoiNày = mangRauDangChon.includes(motRecord.id);
      
      if (laNguoiNày) {
        let nhatKyTreo = motRecord.history ? [...motRecord.history] : [];
        let tenClbMoiToanh = dsClubs.find((o:any) => o.id === idClbSapDaSang)?.name;
        
        nhatKyTreo.push({
           action: 'Luân chuyển',
           time: new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString(),
           reason: 'Admin đổi club qua: ' + tenClbMoiToanh
        });

        let thongDiep = '';
        if (motRecord.note) {
          thongDiep = motRecord.note + ' | Đã chuyển đi đâu đó gần đây';
        } else {
          thongDiep = 'Bạn í bị chuyển đi';
        }

        return {
           ...motRecord,
           clubId: idClbSapDaSang,
           history: nhatKyTreo,
           note: thongDiep
        }
      } else {
        return motRecord;
      }
    });

    chucNangUpdateApps(taoMangMoi);

    message.success('Chuyển xong ' + mangRauDangChon.length + ' đồng chí.');
    // reset du kien
    setHienHopThoaiMove(false);
    setMangRauDangChon([]);
    setIdClbSapDaSang(null);
  }

  const khaiBaoCotNhe = [
    {
      title: 'Tên thành viên',
      dataIndex: 'fullName',
      render: (tennguoi: string) => <div style={{fontWeight: 600, color: 'darkblue'}}><TeamOutlined /> {tennguoi}</div>
    },
    { title: 'Địa chỉ Email Thường dùng', dataIndex: 'email', key: 'email' },
    { title: 'Liên hệ qua Gọi', dataIndex: 'phone', key: 'phone' },
    { title: 'Giới', dataIndex: 'gender', key: 'gender' },
    {
      title: 'Nghiệp vụ',
      render: () => <Tag color="#2db7f5">Đã làm lễ kết nạp</Tag>,
    }
  ];

  return (
    <div style={{ backgroundColor: '#fff', padding: 25 }}>
      
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 20 }}>
        <h2 style={{fontFamily: 'sans-serif', opacity: 0.8}}>Phân Hạng Thành Viên Các Clubs</h2>
        <Button 
          type="dashed"
          icon={<SwapOutlined />} 
          disabled={mangRauDangChon.length === 0}
          onClick={() => setHienHopThoaiMove(true)}
        >
          Mở chức năng swap {mangRauDangChon.length} Member
        </Button>
      </div>

      <Tabs 
        activeKey={dieuHuongBanTab} 
        onChange={(chiaKhoa) => { 
          setDieuHuongBanTab(chiaKhoa); 
          setMangRauDangChon([]); // khi reset tab thi mang huy het check
        }} 
        type="line"
      >
        {
          dsClubs.map((clubInfo: any) => {
            let thanhVienDongNuoc = hsDuocDuetChoVao.filter((m: any) => m.clubId === clubInfo.id);
            let tabChuDe = clubInfo.name + ' (' + thanhVienDongNuoc.length + ')';

            return (
              <Tabs.TabPane tab={tabChuDe} key={String(clubInfo.id)}>
                <Table 
                  rowSelection={{
                    onChange: (arrayIdKeys) => setMangRauDangChon(arrayIdKeys as number[]),
                    selectedRowKeys: mangRauDangChon
                  }}
                  columns={khaiBaoCotNhe} 
                  dataSource={thanhVienDongNuoc} 
                  rowKey="id"
                  pagination={{ pageSize: 6 }}
                />
              </Tabs.TabPane>
            );
          })
        }
      </Tabs>

      <Modal 
        title="Tiến hành Move Member Sang Băng Đảng Khác" 
        visible={hienHopThoaiMove}
        onOk={chotDonBamNutChuyenBan} 
        onCancel={() => { setHienHopThoaiMove(false); setIdClbSapDaSang(null); }}
        okText="Ký Xác Nhận Chuyển"
      >
        <p>Hệ thống ghi nhận muốn thay máu <b>{mangRauDangChon.length}</b> anh em.</p>
        <div style={{marginBottom: 10}}>Lựa chọn Base mới ở Dropdown dưới nheeeeee:</div>
        <Select 
          style={{ width: '80%' }} 
          placeholder="Hãy chọn 1 club nào"
          value={idClbSapDaSang}
          onChange={(g) => setIdClbSapDaSang(g)}
        >
          {dsClubs.map((hangClb: any) => {
             // kĩ thuật ko cho chọn lại club mình dang ở mỏ tab
             let laClubTrongTab = String(hangClb.id) === dieuHuongBanTab;
             return (
               <Select.Option key={hangClb.id} value={hangClb.id} disabled={laClubTrongTab}>
                 {hangClb.name}
               </Select.Option>
             );
          })}
        </Select>
      </Modal>
    </div>
  );
}

export default TrangThanhVienCacCauLacBo;