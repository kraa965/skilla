import { getDaysDates, getMonthDates, getYearsDates, getCustomDates } from '../../utils/utils';
import CustomDatePicker from '../elements/DatePicker/CustomDatePicker';
import FilterCalls from '../elements/FilterCalls/FilterCalls';
import CallsTable from '../elements/CallsTable/CallsTable';
import { useEffect, useState } from 'react';
import { getCalls } from '../../utils/api';

function Calls() {
  const [calls, setCalls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [days, setDays] = useState(2);
  const [callsFilter, setCallsFilter] = useState('');
  const [currentFilter, setCurrentFilter] = useState('');
  const [customStartDate, setCustomStartDate] = useState(null);
  const [customEndDate, setCustomEndDate] = useState(null);

  async function getData(filter) {
    try {
      setIsLoading(true);
      const data = await getCalls(filter);
      const { results } = data;
      setCalls(results);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  function filterDays(days) {
    const dates = getDaysDates(new Date(), days);
    const { start, end } = dates;
    getData(`date_start=${start}&date_end=${end}&limit=10000${callsFilter}`);
  }

  function filterWeek() {
    const dates = getDaysDates(new Date(), 6);
    const { start, end } = dates;
    getData(`date_start=${start}&date_end=${end}&limit=10000${callsFilter}`);
    setCurrentFilter('week');
  }

  function filterMonth() {
    const dates = getMonthDates(new Date());
    const { start, end } = dates;
    getData(`date_start=${start}&date_end=${end}&limit=10000${callsFilter}`);
    setCurrentFilter('month');
  }

  function filterYear() {
    const dates = getYearsDates(new Date());
    const { start, end } = dates;
    getData(`date_start=${start}&date_end=${end}&limit=10000${callsFilter}`);
    setCurrentFilter('year');
  }

  function filterCustomPeriod(start, end) {
    const dates = getCustomDates(start, end);
    const { start: formattedStart, end: formattedEnd } = dates;
    getData(`date_start=${formattedStart}&date_end=${formattedEnd}&limit=10000${callsFilter}`);
  }

  function prevDays() {
    if (days) {
      setDays(days - 1);
      filterDays(days - 1); // Передаем корректное значение для дней
    }
  }

  function nextDays() {
    setDays(days + 1);
    filterDays(days + 1); // Передаем корректное значение для дней
  }

  const handleType = (type) => {
    if (type === 0) {
      setCallsFilter(`&in_out=0`);
    } else if (type === 1) {
      setCallsFilter('&in_out=1');
    } else {
      setCallsFilter('');
    }
  };

  useEffect(() => {
    if (currentFilter === 'week') {
      filterWeek();
    } else if (currentFilter === 'month') {
      filterMonth();
    } else if (currentFilter === 'year') {
      filterYear();
    } else if (customStartDate && customEndDate) {
      filterCustomPeriod(customStartDate, customEndDate);
    } else {
      filterDays(days);
    }
  }, [days, callsFilter, customStartDate, customEndDate]);

  return (
    <main>
      <section className="mx-auto px-[240px] mt-20">
        <div className="flex justify-between gap-12">
          <FilterCalls types={handleType} />
          <CustomDatePicker
            days={filterDays}
            week={filterWeek}
            month={filterMonth}
            year={filterYear}
            prev={prevDays}
            next={nextDays}
            count={days}
            customPeriod={(start, end) => {
              setCustomStartDate(start);
              setCustomEndDate(end);
            }}
          />
        </div>
        <CallsTable data={calls} loading={isLoading} />
      </section>
    </main>
  );
}

export default Calls;
