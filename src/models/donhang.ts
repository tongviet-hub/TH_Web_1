import { useState, useEffect } from 'react';

const mockData = [
    {
        id: 'DH001',
        customerName: 'Nguyễn Văn A',
        phone: '0912345678',
        address: '123 Nguyễn Huệ, Q1, TP.HCM',
        products: [
            { productId: 1, productName: 'Laptop Dell XPS 13', quantity: 1, price: 25000000 }
        ],
        totalAmount: 25000000,
        status: 'Chờ xử lý',
        createdAt: '2024-01-15'
    }
];

export default () => {
    const [danhSachDonHang, setDanhSachDonHang] = useState(() => {
        try {
            const saved = localStorage.getItem('danhSachDonHang');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) return parsed;
            }
        } catch (e) {
            console.error("Error loading donhang", e);
        }
        return mockData;
    });

    useEffect(() => {
        localStorage.setItem('danhSachDonHang', JSON.stringify(danhSachDonHang));
    }, [danhSachDonHang]);

    return {
        danhSachDonHang,
        setDanhSachDonHang,
    };
};