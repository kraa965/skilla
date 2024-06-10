import { useEffect, useState } from 'react';
import './datepicker.css';

function DatePicker({ days, week, month, year, count, prev, next }) {
  const [openModal, setOpenModal] = useState(false);
  const [chooseTime, setChooseTime] = useState(`${count + 1} дня`);

  const openDatePopup = () => setOpenModal(!openModal);

  const handle3days = () => {
    days();
    setChooseTime(count === 0 ? 'Cегодня' : `${count + 1} дня`);
    setOpenModal(false);
  };

  const handleWeek = () => {
    week();
    setChooseTime('Неделя');
    setOpenModal(false);
  };

  const handleMonth = () => {
    month();
    setChooseTime('Месяц');
    setOpenModal(false);
  };

  const handleYear = () => {
    year();
    setChooseTime('Год');
    setOpenModal(false);
  };

  const handlePrev = () => {
    prev();
    setChooseTime(count === 0 ? 'Cегодня' : `${count + 1} дня`);
  };

  const handleNext = () => {
    next();
    setChooseTime(count === 0 ? 'Cегодня' : `${count + 1} дня`);
  };

  useEffect(() => {
    setChooseTime(count === 0 ? 'Cегодня' : `${count + 1} дня`);
  }, [count]);

  return (
    <div className="date-picker">
      <button className="date-picker__arrow" onClick={handlePrev}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="24"
          viewBox="0 0 16 24"
          fill="none"
        >
          <g clipPath="url(#clip0_19879_442)">
            <path
              d="M6.175 15.825L2.35833 12L6.175 8.175L5 7L0 12L5 17L6.175 15.825Z"
              fill="#ADBFDF"
            />
          </g>
          <defs>
            <clipPath id="clip0_19879_442">
              <rect width="16" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </button>
      <button className="date-picker__choose-btn" onClick={openDatePopup}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="18"
          viewBox="0 0 16 18"
          fill="none"
        >
          <path
            d="M14.4 1.63636H13.6V0H12V1.63636H4V0H2.4V1.63636H1.6C0.72 1.63636 0 2.37273 0 3.27273V16.3636C0 17.2636 0.72 18 1.6 18H14.4C15.28 18 16 17.2636 16 16.3636V3.27273C16 2.37273 15.28 1.63636 14.4 1.63636ZM14.4 16.3636H1.6V5.72727H14.4V16.3636Z"
            fill="#ADBFDF"
          />
        </svg>
        {chooseTime}
      </button>
      <button className="date-picker__arrow" onClick={handleNext}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="17"
          height="24"
          viewBox="0 0 17 24"
          fill="none"
        >
          <g clipPath="url(#clip0_60_3459)">
            <path
              d="M9.58984 15.825L13.4065 12L9.58984 8.175L10.7648 7L15.7648 12L10.7648 17L9.58984 15.825Z"
              fill="#ADBFDF"
            />
          </g>
          <defs>
            <clipPath id="clip0_60_3459">
              <rect width="17" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </button>
      {openModal && (
        <ul className="date-picker__modal">
          <li className="date-picker__modal-item" onClick={handle3days}>
            {count === 0 ? 'Cегодня' : `${count + 1} дня`}
          </li>
          <li className="date-picker__modal-item" onClick={handleWeek}>
            Неделя
          </li>
          <li className="date-picker__modal-item" onClick={handleMonth}>
            Месяц
          </li>
          <li className="date-picker__modal-item" onClick={handleYear}>
            Год
          </li>
        </ul>
      )}
    </div>
  );
}

export default DatePicker;
