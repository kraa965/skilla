import "./callsTable.css";
import { getHoursMins, convertDuration } from "../../../utils/utils";
import failCall from "../../../images/call-fail.svg";
import callSuccess from "../../../images/call.svg";
import { getCallRecord } from "../../../utils/api.js";
import { useState } from "react";
import AudioPlayer from "../../AudioPlayer.jsx";

function CallsTable({ data, loading }) {
  const call_btn = (status) => {
    if (status === "671") {
      return (
        <>
          <button className="outline outline-2 px-2 outline-green-400 rounded text-green-400 bg-green-100">
            Отлично
          </button>
        </>
      );
    }
    if (status === "105") {
      return (
        <>
          <button className="outline outline-2 px-2 outline-blue-400 rounded bg-blue-100">
            Хорошо
          </button>
        </>
      );
    }
    if (status === "103") {
      return (
        <>
          <button className="outline outline-2 px-2 outline-red-400 rounded text-red-400 bg-red-100">
            Плохо
          </button>
        </>
      );
    }
  };

  const [recordBlobs, setRecordBlobs] = useState({});

  const getCallRecordData = async (recordId, partnershipId) => {
    try {
      const recordBlob = await getCallRecord(recordId, partnershipId);
      // Обновляем запись для данного звонка в объекте состояния
      setRecordBlobs((prevRecordBlobs) => ({
        ...prevRecordBlobs,
        [recordId]: recordBlob,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const handlePlayRecord = (recordId, partnershipId) => {
    getCallRecordData(recordId, partnershipId);
  };

  return (
    <table className="calls-table">
      <thead>
        <tr className="calls-table__header-row">
          <th className="calls-table__header-item calls-table__header-item-type">
            Тип
          </th>
          <th className="calls-table__header-item calls-table__header-item-time">
            Время
          </th>
          <th className="calls-table__header-item calls-table__header-item-employee">
            Сотрудник
          </th>
          <th className="calls-table__header-item calls-table__header-item-call">
            Звонок
          </th>
          <th className="calls-table__header-item calls-table__header-item-from">
            Источник
          </th>
          <th className="calls-table__header-item calls-table__header-item-rating">
            Оценка
          </th>
          <th className="calls-table__header-item">Длительность</th>
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr className="calls-table__row">
            <td colSpan="7" style={{ textAlign: "center", width: "100%" }}>
              Загрузка данных...
            </td>
          </tr>
        ) : (
          data.map((call) => {
            return (
              <tr key={call.id} className="calls-table__row">
                <td className="calls-table__header-item-type">
                  {call.status === "Не дозвонился" ? (
                    <img src={failCall} alt="Не дозвонился" />
                  ) : (
                    <img src={callSuccess} alt="Дозвонился" />
                  )}
                </td>
                <td className="calls-table__header-item-time">
                  {getHoursMins(call.date)}
                </td>
                <td className="calls-table__header-item-employee">
                  <img
                    className="calls-table__header-item-employee-avatar"
                    src={call.person_avatar}
                    alt="аватар"
                  />
                </td>
                <td className="calls-table__header-item-call">
                  {call.from_number}
                </td>
                <td className="calls-table__header-item-from">
                  {call.partner_data.name}
                </td>
                <td className="calls-table__header-item-rating">
                  {call_btn(call.to_extension)}
                </td>
                <td>
                  {call.record && (
                    <>
                      <div
                        onClick={handlePlayRecord(
                          call.record,
                          call.partnership_id,
                        )}
                      ></div>
                      <AudioPlayer recordBlob={recordBlobs[call.record]} />
                    </>
                  )}
                </td>
                <td>{convertDuration(call.time)}</td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}

export default CallsTable;
