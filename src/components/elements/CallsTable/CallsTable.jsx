import "./callsTable.css";
import { getHoursMins, convertDuration } from "../../../utils/utils";
import failCall from "../../../images/call-fail.svg";
import callSuccess from "../../../images/call.svg";
import { getCallRecord } from "../../../utils/api.js";
import { useState } from "react";
import AudioPlayer from "../../AudioPlayer.jsx";

function CallsTable({ data, loading }) {
  const [playingRecord, setPlayingRecord] = useState(null);
  const [recordBlobs, setRecordBlobs] = useState({});

  const call_btn = (status) => {
    if (status === "671") {
      return (
        <button className="outline outline-2 px-2 outline-green-400 rounded text-green-400 bg-green-100">
          Отлично
        </button>
      );
    }
    if (status === "105") {
      return (
        <button className="outline outline-2 px-2 outline-blue-400 rounded bg-blue-100">
          Хорошо
        </button>
      );
    }
    if (status === "103") {
      return (
        <button className="outline outline-2 px-2 outline-red-400 rounded text-red-400 bg-red-100">
          Плохо
        </button>
      );
    }
  };

  const getCallRecordData = async (recordId, partnershipId) => {
    try {
      const recordBlob = await getCallRecord(recordId, partnershipId);
      setRecordBlobs((prevRecordBlobs) => ({
        ...prevRecordBlobs,
        [recordId]: recordBlob,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const handlePlayRecord = (recordId, partnershipId) => {
    setPlayingRecord(recordId);
    if (!recordBlobs[recordId]) {
      getCallRecordData(recordId, partnershipId);
    }
  };

  const handleClosePlayer = () => {
    setPlayingRecord(null);
  };

  return (
    <div className="container mx-auto">
      {loading ? (
        <div
          className="animate-spin size-10 border-[3px] border-current border-t-transparent text-blue-600 rounded-full mx-auto"
          role="status"
          aria-label="loading"
        >
          <span className="sr-only">Loading...</span>
        </div>
      ) : (
        <table className="min-w-full bg-white rounded">
          <thead>
            <tr>
              <th className="py-3 px-4 text-gray-600 font-medium border-b">
                Тип
              </th>
              <th className="py-3 px-4 text-gray-600 font-medium border-b">
                Время
              </th>
              <th className="py-3 px-4 text-gray-600 font-medium border-b">
                Сотрудник
              </th>
              <th className="py-3 px-4 text-gray-600 font-medium border-b">
                Звонок
              </th>
              <th className="py-3 px-4 text-gray-600 font-medium border-b">
                Источник
              </th>
              <th className="py-3 px-4 text-gray-600 font-medium border-b">
                Оценка
              </th>
              <th className="py-3 px-4 text-gray-600 font-medium border-b">
                Длительность
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((call, index) => (
              <tr key={index} className="text-center border-b">
                <td className="py-2 px-4">
                  {call.status === "Не дозвонился" ? (
                    <img src={failCall} alt="Не дозвонился" />
                  ) : (
                    <img src={callSuccess} alt="Дозвонился" />
                  )}
                </td>
                <td className="py-2 px-4">{getHoursMins(call.date)}</td>
                <td className="py-2 px-4">
                  <img
                    src={call.person_avatar}
                    alt="Avatar"
                    className="inline-block w-6 h-6 rounded-full"
                  />
                </td>
                <td className="py-2 px-4 w-fit">{call.from_number}</td>
                <td className="py-2 px-4">{call.partner_data.name}</td>
                <td className="py-2 px-4">{call_btn(call.to_extension)}</td>
                <td className="py-2 px-4">
                  {call.record && (
                    <div className="flex items-center justify-center">
                      {playingRecord !== call.record ? (
                        <div
                          onClick={() =>
                            handlePlayRecord(call.record, call.partnership_id)
                          }
                          className="cursor-pointer"
                        >
                          {convertDuration(call.time)}
                        </div>
                      ) : (
                        <AudioPlayer
                          recordBlob={recordBlobs[call.record]}
                          onClose={handleClosePlayer}
                        />
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default CallsTable;
