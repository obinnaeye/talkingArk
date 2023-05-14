import axios from "axios"

export function harperSaveMessage(message: string, username: string, room: string, __createdtime__: string) {
  const dbUrl = "https://cloud-1-talkingark.harperdbcloud.com";
  const dbPw = "a2luZ29iaTptYXQ2MTA=";
  if (!dbUrl || !dbPw) return null;

  let data = JSON.stringify({
    operation: 'insert',
    schema: 'chat_app',
    table: 'messages',
    records: [
      {
        message,
        username,
        room,
        __createdtime__,
      },
    ],
  });

  let config = {
    method: 'post',
    url: dbUrl,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${dbPw}`,
    },
    data: data,
  };

  return new Promise((resolve, reject) => {
    axios(config)
      .then(function (response) {
        resolve(JSON.stringify(response.data));
      })
      .catch(function (error) {
        reject(error);
      });
  });
}
