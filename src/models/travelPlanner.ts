import { useState, useEffect } from 'react';

export interface Destination {
  id: number;
  name: string;
  type: 'Sea' | 'Mountain' | 'City';
  location: string;
  image: string;
  rating: number;
  costEating: number; // Chi phí ăn uống
  costMoving: number; // Chi phí di chuyển
  costLodging: number; // Chi phí lưu trú
  description: string;
  timeCost: number; // in hours
  bookingsCount: number; // Số lượt đã tạo lịch trình
}

export interface DayActivity {
  id: string; // unique Id needed for drag and drop
  destId: number; 
  name: string;
  timeCost: number; 
  costEating: number;
  costMoving: number;
  costLodging: number;
}

export interface ItineraryDay {
  dayId: number;
  date: string; // label (e.g. "Ngày 1")
  actualDate?: string; // actual ISO string
  activities: DayActivity[];
}

const initialDestinations: Destination[] = [
    {
      id: 1,
      name: 'Vịnh Hạ Long',
      type: 'Sea',
      location: 'Quảng Ninh',
      image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80',
      rating: 5,
      costEating: 400000,
      costMoving: 300000,
      costLodging: 800000,
      description: 'Khám phá di sản thiên nhiên thế giới.',
      timeCost: 8,
      bookingsCount: 154
    },
    {
      id: 2,
      name: 'Sapa',
      type: 'Mountain',
      location: 'Lào Cai',
      image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&q=80',
      rating: 4.5,
      costEating: 300000,
      costMoving: 200000,
      costLodging: 700000,
      description: 'Leo núi Fansipan, thăm bản làng Cát Cát.',
      timeCost: 6,
      bookingsCount: 98
    },
    {
      id: 3,
      name: 'Hội An',
      type: 'City',
      location: 'Quảng Nam',
      image: 'https://images.unsplash.com/photo-1555921015-5532091f6026?auto=format&fit=crop&q=80',
      rating: 5,
      costEating: 200000,
      costMoving: 100000,
      costLodging: 500000,
      description: 'Phố cổ cổ kính bên sông Hoài.',
      timeCost: 4,
      bookingsCount: 210
    },
    {
      id: 4,
      name: 'Phú Quốc',
      type: 'Sea',
      location: 'Kiên Giang',
      image: 'https://images.unsplash.com/photo-1622281561084-3c6c1be277da?auto=format&fit=crop&q=80',
      rating: 4.8,
      costEating: 500000,
      costMoving: 300000,
      costLodging: 1200000,
      description: 'Đảo ngọc biển xanh cát trắng.',
      timeCost: 6,
      bookingsCount: 132
    },
    {
      id: 5,
      name: 'Đà Lạt',
      type: 'Mountain',
      location: 'Lâm Đồng',
      image: 'https://images.unsplash.com/photo-1610488425048-0c6db089ffcc?auto=format&fit=crop&q=80',
      rating: 4.6,
      costEating: 250000,
      costMoving: 150000,
      costLodging: 600000,
      description: 'Thành phố ngàn hoa với không khí mơ màng.',
      timeCost: 5,
      bookingsCount: 180
    }
  ];

export default function () {
  const [destinations, setDestinations] = useState<Destination[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tp_destinations');
      return saved ? JSON.parse(saved) : initialDestinations;
    }
    return initialDestinations;
  });

  const [itineraries, setItineraries] = useState<ItineraryDay[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tp_itineraries');
      return saved ? JSON.parse(saved) : [{ dayId: 1, date: 'Ngày 1', actualDate: new Date().toISOString(), activities: [] }];
    }
    return [{ dayId: 1, date: 'Ngày 1', actualDate: new Date().toISOString(), activities: [] }];
  });
  
  const [budgetLimit, setBudgetLimit] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tp_budgetLimit');
      return saved ? Number(saved) : 5000000;
    }
    return 5000000;
  });

  useEffect(() => {
    localStorage.setItem('tp_destinations', JSON.stringify(destinations));
  }, [destinations]);

  useEffect(() => {
    localStorage.setItem('tp_itineraries', JSON.stringify(itineraries));
  }, [itineraries]);

  useEffect(() => {
    localStorage.setItem('tp_budgetLimit', budgetLimit.toString());
  }, [budgetLimit]);

  useEffect(() => {
    const onStorageChange = (event: StorageEvent) => {
      if (event.storageArea !== localStorage) return;

      if (event.key === 'tp_destinations' && event.newValue) {
        try {
          setDestinations(JSON.parse(event.newValue));
        } catch (error) {
          console.error('Cannot parse tp_destinations from storage event', error);
        }
      }

      if (event.key === 'tp_itineraries' && event.newValue) {
        try {
          setItineraries(JSON.parse(event.newValue));
        } catch (error) {
          console.error('Cannot parse tp_itineraries from storage event', error);
        }
      }

      if (event.key === 'tp_budgetLimit' && event.newValue) {
        const parsedBudget = Number(event.newValue);
        if (!Number.isNaN(parsedBudget)) {
          setBudgetLimit(parsedBudget);
        }
      }
    };

    window.addEventListener('storage', onStorageChange);
    return () => window.removeEventListener('storage', onStorageChange);
  }, []);

  const resetData = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tp_destinations');
      localStorage.removeItem('tp_itineraries');
      localStorage.removeItem('tp_budgetLimit');
      window.location.reload();
    }
  };

  return {
    destinations,
    setDestinations,
    itineraries,
    setItineraries,
    budgetLimit,
    setBudgetLimit,
    resetData
  };
}
