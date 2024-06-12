import { convertDuration, getHoursMin } from '../../../utils/utils';
import incoming from '../../../images/incoming.svg';
import outgoing from '../../../images/outgoing.svg';
import { getCallRecord } from '../../../utils/api.js';
import { useState } from 'react';
import AudioPlayer from '../../AudioPlayer/AudioPlayer.jsx';

function CallsTable({ data, loading }) {
  const [playingRecord, setPlayingRecord] = useState(null);
  const [recordBlobs, setRecordBlobs] = useState({});
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  const call_btn = (status, errors) => {
    if (status === '671') {
      return (
        <button className="outline outline-2 px-2 outline-green-400 rounded text-green-400 bg-green-100 cursor-default">
          Отлично
        </button>
      );
    }
    if (status === '105') {
      return (
        <button className="outline outline-2 px-2 outline-blue-400 rounded bg-blue-100 cursor-default">Хорошо</button>
      );
    }
    if (status === '103') {
      return (
        <button className="outline outline-2 px-2 outline-red-400 rounded text-red-400 bg-red-100 cursor-default">
          Плохо
        </button>
      );
    }
    if (errors !== null) {
      return <p className="text-red-400">{errors}</p>;
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

  const handleSort = (field) => {
    if (field === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (sortBy === 'time') {
      const timeA = new Date(a.date);
      const timeB = new Date(b.date);
      return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
    } else if (sortBy === 'duration') {
      const durationA = Number(a.duration);
      const durationB = Number(b.duration);

      // Sorting from largest to smallest or vice versa based on sortOrder
      if (sortOrder === 'asc') {
        return durationB - durationA;
      } else {
        return durationA - durationB;
      }
    } else {
      return 0;
    }
  });

  const getSortArrow = (field) => {
    if (field === sortBy) {
      return sortOrder === 'asc' ? '↑' : '↓';
    }
    return '↓';
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
              <th className="py-3 px-4 text-gray-400 font-medium border-b">Тип</th>
              <th
                className="py-3 px-4 text-gray-400 font-medium border-b cursor-pointer"
                onClick={() => handleSort('time')}
              >
                Время {getSortArrow('time')}
              </th>
              <th className="py-3 px-4 text-gray-400 font-medium border-b">Сотрудник</th>
              <th className="py-3 px-4 text-gray-400 font-medium border-b">Звонок</th>
              <th className="py-3 px-4 text-gray-400 font-medium border-b">Источник</th>
              <th className="py-3 px-4 text-gray-400 font-medium border-b">Оценка</th>
              <th
                className="py-3 px-4 text-gray-400 font-medium border-b cursor-pointer"
                onClick={() => handleSort('duration')}
              >
                Длительность {getSortArrow('duration')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((call, index) => (
              <tr key={index} className="text-center border-b mx-auto">
                <td className="py-2 px-4">
                  {call.in_out === 1 && <img src={incoming} alt="Avatar" />}
                  {call.in_out === 0 && <img src={outgoing} alt="Avatar" />}
                </td>
                <td className="py-2 px-4">{getHoursMin(call.date)}</td>
                <td className="py-2 px-4">
                  <img src={call.person_avatar} alt="Avatar" className="inline-block w-6 h-6 rounded-full" />
                </td>
                <td className="py-2 px-4 w-fit">{call.from_number}</td>
                <td className="py-2 px-4">{call.source}</td>
                <td className="py-2 px-4 text-center">{call_btn(call.to_extension, call.errors)}</td>
                <td className="py-2 px-4">
                  {call.record && (
                    <div className="flex items-center justify-center">
                      {playingRecord !== call.record ? (
                        <div
                          onClick={() => handlePlayRecord(call.record, call.partnership_id)}
                          className="cursor-pointer"
                        >
                          {convertDuration(call.time)}
                        </div>
                      ) : (
                        <AudioPlayer recordBlob={recordBlobs[call.record]} onClose={handleClosePlayer} />
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
