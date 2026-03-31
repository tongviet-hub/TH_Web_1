import { useState } from 'react';

// định nghĩa kiểu dữ liệu cho CLB
export interface ThongTinCLB {
  id: number;
  name: string;
  leader: string;
  foundedDate: string;
  isActive: boolean;
  description?: string;
  avatar?: string;
}

// định nghĩa kiểu cho Đơn đăng ký tham gia
export interface ThongTinDon {
  id: number;
  fullName: string;
  clubId: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  note?: string;
  email?: string;
  phone?: string;
  gender?: string;
  address?: string;
  skills?: string;
  reason?: string;
  history?: any[];
}

export default function () {
  const [danhSachCLB, setDanhSachCLB] = useState<ThongTinCLB[]>([
    { 
      id: 1, 
      name: 'CLB Guitar', 
      leader: 'Nguyễn Văn A', 
      foundedDate: '2023-01-01', 
      isActive: true, 
      description: 'Nơi giao lưu âm nhạc và các loại nhạc cụ dây.',
      avatar: 'https://cdn-icons-png.flaticon.com/512/3093/3093950.png'
    },
    { 
      id: 2, 
      name: 'CLB Nhảy Hiện Đại', 
      leader: 'Trần Thị B', 
      foundedDate: '2023-05-10', 
      isActive: true, 
      description: 'Sân chơi cho các bạn trẻ đam mê vũ đạo nhảy múa.',
      avatar: 'https://cdn-icons-png.flaticon.com/512/3093/3093950.png'
    }
  ]);

  const [cacDonDangKy, setCacDonDangKy] = useState<ThongTinDon[]>([
    { 
      id: 101, 
      fullName: 'Lê Văn C', 
      clubId: 1, 
      status: 'Pending', 
      email: 'c@gmail.com',
      phone: '0987123456',
      gender: 'Nam',
      address: 'Hà Nội',
      skills: 'Đánh đàn tốt',
      reason: 'Đam mê âm nhạc',
      history: []
    },
    { 
      id: 102, 
      fullName: 'Phạm Minh D', 
      clubId: 2, 
      status: 'Approved', 
      note: 'Admin đã duyệt vào 10h 01/01/2026',
      email: 'd@gmail.com',
      phone: '0912123123',
      gender: 'Nữ',
      address: 'TP HCM',
      skills: 'Nhảy cover Kpop',
      reason: 'Thích giao lưu cùng mọi người',
      history: [{ action: 'Approved', time: '10h 01/01/2026', reason: 'Duyệt hồ sơ' }]
    }
  ]);

  // hàm duyệt hoặc từ chối các đơn
  const xuLyChuyenTrangThai = (listIds: number[], statusMoi: 'Approved' | 'Rejected', lyDoCuaAdmin: string) => {
    let now = new Date().toLocaleString('vi-VN');
    
    setCacDonDangKy(danhSachCu => {
      let dsMoi = [...danhSachCu];

      for (let i = 0; i < dsMoi.length; i++) {
        let donTruocDe = dsMoi[i];
        
        if (listIds.includes(donTruocDe.id)) {
          let lsCu = donTruocDe.history ? [...donTruocDe.history] : [];
          lsCu.push({ action: statusMoi, time: now, reason: lyDoCuaAdmin });
          
          let hanhDongTV = statusMoi === 'Approved' ? 'Duyệt' : 'Từ chối';
          let strGhiChu = `Admin đã ${hanhDongTV} lúc ${now}. Lý do: ${lyDoCuaAdmin}`;

          dsMoi[i] = { 
            ...donTruocDe, 
            status: statusMoi, 
            note: strGhiChu,
            history: lsCu
          };
        }
      }

      return dsMoi;
    });
  };

  // Trả về data y hệt tên file cũ để giữ độ tương thích
  return {
    clubs: danhSachCLB,
    setClubs: setDanhSachCLB,
    apps: cacDonDangKy,
    setApps: setCacDonDangKy,
    updateAppStatus: xuLyChuyenTrangThai
  };
}