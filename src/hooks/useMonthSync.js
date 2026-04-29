import { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useData } from '@/context/DataContext';
import dayjs from 'dayjs';

export function useMonthSync(basePath) {
  const { selectedDate, setSelectedDate } = useData();
  const { yearMonth } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // 1. URL -> State (공통)
  useEffect(() => {
    if (yearMonth && yearMonth.length === 6) {
      const year = parseInt(yearMonth.substring(0, 4));
      const month = parseInt(yearMonth.substring(4, 6));
      const newDate = new Date(year, month - 1, 1);

      if (dayjs(selectedDate).format('YYYYMM') !== yearMonth) {
        setSelectedDate(newDate);
      }
    }
  }, [yearMonth]);

  // 2. 기본 URL 진입 시 리다이렉트 (공통)
  useEffect(() => {
    if (!yearMonth && location.pathname === basePath) {
      navigate(`${basePath}/${dayjs(selectedDate).format('YYYYMM')}`, { replace: true });
    }
  }, [yearMonth, location.pathname, selectedDate, navigate, basePath]);

  // 3. 네비게이션 헬퍼 함수 (공통 핸들러)
  const navigateToMonth = (dateObj) => {
    navigate(`${basePath}/${dayjs(dateObj).format('YYYYMM')}`);
  };

  const handleMonthChange = (e) => {
    if (!e.year || !e.month) return;
    const newDate = new Date(e.year, e.month - 1, 1);
    navigateToMonth(newDate);
  };

  const handleViewDateChange = (e) => {
    if (e.value instanceof Date) {
      navigateToMonth(e.value);
    }
  };

  // 스와이프 등에서 쓸 수 있는 월 이동 함수
  const moveMonth = (offset) => {
    const newDate = dayjs(selectedDate).add(offset, 'month').toDate();
    navigateToMonth(newDate);
  };

  return { 
    handleMonthChange, 
    handleViewDateChange, 
    moveMonth 
  };
}
