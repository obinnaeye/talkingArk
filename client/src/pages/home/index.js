import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import styles from './styles.module.css';

const Home = ({ username, setUsername, room, setRoom, socket }) => {
  const navigate = useNavigate();
  const joinRoom = () => {
    if (room !== '' && username !== '') {
      socket.emit('join_room', { username, room });
      navigate('/chat', { replace: true });
    }
  };
  const [options, setOptions] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getRooms = () => {
    async function fetchData() {
      console.log(`${process.env.REACT_APP_API_URL}/api/attendee/talks/${username}`)
      // Fetch data
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/attendee/talks/${username}`);
      const results = []
      // Store results in the results array
      data.forEach((value) => {
        results.push({
          key: value._id,
          value: value.title,
        });
      });
      return results;
    }

    fetchData()
      .then((results) => {
        if(results.length > 0) {
          setOptions(results);
        }
        setIsLoading(false);
      })
      .catch((err) => { console.log(err)});
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h1>{`<>Ark Rooms</>`}</h1>
        <input
          className={styles.input}
          placeholder='Email...'
          onChange={(e) => setUsername(e.target.value)}
        />
        { options && (
        <select
          className={styles.input}
          onChange={(e) => setRoom(e.target.value)}
        >
          <option>-- Select Room --</option>
          {options && options.map((option) => {
            return (
              <option key={option.key} value={option.value}>
                {option.value}
              </option>
            );
          })}
        </select>
        )}
        {(!isLoading && !options) && (
          <p
            style={{ width: '100%', color: "red" }}
          >
            No Room found for you!
          </p>
        )}
        {!options && (
          <button
            className='btn btn-secondary'
            style={{ width: '100%' }}
            onClick={getRooms}
          >
            Show My Rooms
          </button>
        )}
        {options && (
          <button
            className='btn btn-secondary'
            style={{ width: '100%' }}
            onClick={joinRoom}
          >
            Join Room
          </button>
        )}
      </div>
    </div>
  );
};

export default Home;
