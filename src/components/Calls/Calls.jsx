import "./calls.css";
import { getDaysDates, getMonthDates, getYearsDates } from "../../utils/utils";
import DatePicker from "../elements/DatePicker/DatePicker";
import FilterCalls from "../elements/FilterCalls/FilterCalls";
import CallsTable from "../elements/CallsTable/CallsTable";
import { useEffect, useState } from "react";
import { getCalls } from "../../utils/api";

function Calls() {
  const [calls, setCalls] = useState([]);
  const [isLoading, setIsLoading] = useState("false");
  const [days, setDays] = useState(2);
  const [callsFilter, setCallsFilter] = useState("");
  const [currentFilter, setCurrentFilter] = useState("");

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
    const started = start.split(",");
    const ended = end.split(",");
    getData(
      `date_start=${started[0]}&date_end=${ended[0]}&limit=10000${callsFilter}`,
    );
  }

  function filterWeek() {
    const dates = getDaysDates(new Date(), 6);
    const { start, end } = dates;
    const started = start.split(",");
    const ended = end.split(",");
    getData(
      `date_start=${started[0]}&date_end=${ended[0]}&limit=10000${callsFilter}`,
    );
    setCurrentFilter("week");
  }

  function filterMonth() {
    const dates = getMonthDates(new Date());
    const { start, end } = dates;
    const started = start.split(",");
    const ended = end.split(",");
    getData(
      `date_start=${started[0]}&date_end=${ended[0]}&limit=10000${callsFilter}`,
    );
    setCurrentFilter("month");
  }

  function filterYear() {
    const dates = getYearsDates(new Date());
    const { start, end } = dates;
    const started = start.split(",");
    const ended = end.split(",");
    getData(
      `date_start=${started[0]}&date_end=${ended[0]}&limit=10000${callsFilter}`,
    );
    setCurrentFilter("year");
  }

  function prevDays() {
    if (days) {
      setDays(days - 1);
      filterDays(days);
    }
  }

  function nextDays() {
    setDays(days + 1);
    filterDays(days);
  }

  const handleType = (type) => {
    console.log(type);
    if (type === 0) {
      console.log("outcome");
      setCallsFilter(`&in_out=0`);
    } else if (type === 1) {
      console.log("incoming");
      setCallsFilter("&in_out=1");
    } else {
      setCallsFilter("");
    }
  };

  useEffect(() => {
    if (currentFilter === "week") {
      const renderData = async () => filterWeek();
      renderData();
    } else if (currentFilter === "month") {
      const renderData = async () => filterMonth();
      renderData();
    } else if (currentFilter === "year") {
      const renderData = async () => filterYear();
      renderData();
    } else {
      const renderData = async () => filterDays(days);
      renderData();
    }
  }, [days, callsFilter]);

  console.log(callsFilter);
  console.log(calls);

  return (
    <main className="calls">
      <section className="calls-section">
        <div className="calls-section__buttons-container">
          <FilterCalls types={handleType} />
          <DatePicker
            days={filterDays}
            week={filterWeek}
            month={filterMonth}
            year={filterYear}
            prev={prevDays}
            next={nextDays}
            count={days}
          />
        </div>
        <CallsTable data={calls} loading={isLoading} />
      </section>
    </main>
  );
}

export default Calls;
