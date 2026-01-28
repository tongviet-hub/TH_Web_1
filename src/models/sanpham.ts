import { useState, useEffect } from 'react';

const mockData = [
  { id: 1, name: 'Laptop Dell XPS 13', category: 'Laptop', price: 25000000, quantity: 15 },
  { id: 2, name: 'iPhone 15 Pro Max', category: 'Điện thoại', price: 30000000, quantity: 8 },
  { id: 3, name: 'Samsung Galaxy S24', category: 'Điện thoại', price: 22000000, quantity: 20 },
  { id: 4, name: 'iPad Air M2', category: 'Máy tính bảng', price: 18000000, quantity: 5 },
  { id: 5, name: 'MacBook Air M3', category: 'Laptop', price: 28000000, quantity: 12 },
  { id: 6, name: 'AirPods Pro 2', category: 'Phụ kiện', price: 6000000, quantity: 0 },
  { id: 7, name: 'Samsung Galaxy Tab S9', category: 'Máy tính bảng', price: 15000000, quantity: 7 },
  { id: 8, name: 'Logitech MX Master 3', category: 'Phụ kiện', price: 2500000, quantity: 25 },
];

export default () => {
  const [danhSachSanPham, setDanhSachSanPham] = useState(() => {
    let data = mockData;
    try {
      const saved = localStorage.getItem('danhSachSanPham');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          if (parsed.length > 0 && Array.isArray(parsed[0])) {
            data = parsed[0];
          } else {
            data = parsed;
          }
        }
      }
    } catch (e) {
      console.error("Error loading sanpham from localStorage", e);
    }
    return data;
  });

  useEffect(() => {
    localStorage.setItem('danhSachSanPham', JSON.stringify(danhSachSanPham));
  }, [danhSachSanPham]);

  return {
    danhSachSanPham,
    setDanhSachSanPham,
  };
};