const BASE_URL = "https://api.skilla.ru/mango/";
const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  Authorization: `Bearer testtoken`,
};

const checkResponse = (res) => {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка: ${res.status}`);
};

export const getCalls = async (filter) => {
  return fetch(`${BASE_URL}getList?${filter}`, {
    method: "POST",
    headers,
  }).then((res) => checkResponse(res));
};

export const getCallRecord = async (recordId, partnershipId) => {
  const RECORD_BASE_URL = `${BASE_URL}getRecord?record=${recordId}&partnership_id=${partnershipId}`;
  const recordHeaders = {
    Accept: "audio/mpeg",
    Authorization: `Bearer testtoken`,
  };

  const checkRecordResponse = (res) => {
    if (res.ok) {
      return res.blob();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  };

  return fetch(RECORD_BASE_URL, {
    method: "POST",
    headers: recordHeaders,
  }).then((res) => checkRecordResponse(res));
};
