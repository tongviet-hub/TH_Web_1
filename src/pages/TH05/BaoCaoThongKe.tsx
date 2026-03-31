import React from 'react';
import { Card, Row, Col } from 'antd';
import Chart from 'react-apexcharts';
import { useModel } from 'umi';

function XemBaoCaoTongKet() {
  const cacDuLieuKho = useModel('clubs' as any) as any;
  const listAppPhieu = cacDuLieuKho.apps;
  const listCLBHienThi = cacDuLieuKho.clubs;

  // thuc hien logic dem nham xuat ra board
  let tongChoCang = 0;
  let tongPassCang = 0;
  let tongRungCang = 0;

  for (let bi=0; bi < listAppPhieu.length; bi++) {
     let mau = listAppPhieu[bi].status;
     if (mau === 'Pending') tongChoCang++;
     if (mau === 'Approved') tongPassCang++;
     if (mau === 'Rejected') tongRungCang++;
  }

  let slClbSum = listCLBHienThi.length;

  // mapping du lieu cho chart theo tưng clb
  let mangDataPending: number[] = [];
  let mangDataPass: number[] = [];
  let mangDataRung: number[] = [];
  let mangTenBieuDoDiemX: string[] = [];

  listCLBHienThi.forEach((motCLB: any) => {
      mangTenBieuDoDiemX.push(motCLB.name);

      let demCho = 0, demDoc = 0, demXit = 0;
      for (let j=0; j < listAppPhieu.length; j++) {
         let formNhan = listAppPhieu[j];
         if (formNhan.clubId === motCLB.id) {
            if (formNhan.status === 'Pending') demCho++;
            if (formNhan.status === 'Approved') demDoc++;
            if (formNhan.status === 'Rejected') demXit++;
         }
      }
      mangDataPending.push(demCho);
      mangDataPass.push(demDoc);
      mangDataRung.push(demXit);
  });

  const seriesChoApex = [
    { name: 'Loại Chờ Review', data: mangDataPending },
    { name: 'Loại Approved (Thành viên)', data: mangDataPass },
    { name: 'Loại Trượt Cửa Rìa', data: mangDataRung },
  ];

  const configCuaChart: any = {
    chart: { type: 'bar' },
    plotOptions: {
      bar: { horizontal: false, columnWidth: '60%', borderRadius: 2 },
    },
    dataLabels: { enabled: true },
    stroke: { show: true, width: 1, colors: ['white'] },
    xaxis: { categories: mangTenBieuDoDiemX },
    yaxis: { title: { text: 'Tính Bằng Phieu / Đơn ' } },
    colors: ['#ffe58f', '#95de64', '#ffa39e'],
    tooltip: {
      y: { formatter: (gatri: number) => gatri + " tờ đơn" }
    },
    legend: { position: 'bottom' }
  };

  return (
    <div style={{ margin: '15px' }}>
      <Row gutter={[20, 20]} style={{marginBottom: '30px'}}>
        <Col xs={24} sm={12} md={6}>
          <Card title="Tổng Số Lượng Base" style={{textAlign: 'center', backgroundColor: '#e6f7ff', fontSize: 28, fontWeight: 'bolder'}}>
             {slClbSum}
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card title="Số Lượng Apply Chờ" style={{textAlign: 'center', backgroundColor: '#fffbe6', fontSize: 28, fontWeight: 'bolder'}}>
             {tongChoCang}
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card title="Số Lượng Passed" style={{textAlign: 'center', backgroundColor: '#f6ffed', fontSize: 28, fontWeight: 'bolder'}}>
             {tongPassCang}
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card title="Số Lượng Rơi Rớt" style={{textAlign: 'center', backgroundColor: '#fff1f0', fontSize: 28, fontWeight: 'bolder'}}>
             {tongRungCang}
          </Card>
        </Col>
      </Row>

      <Card title="Biểu Đồ Khảo Sát Thống Kê Dữ Liệu Các Band Bọn Mình 🎯" bordered={false} hoverable>
        <Chart options={configCuaChart} series={seriesChoApex} type="bar" height={420} />
      </Card>
      
      <p style={{marginTop: 30, fontStyle: 'italic', textAlign: 'center', color: '#999'}}>
         ** Số liệu chốt sổ online không mang tính pháp lý kkkk
      </p>
    </div>
  );
}

export default XemBaoCaoTongKet;