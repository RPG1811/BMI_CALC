import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [name, setName] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState(null);
  const [weightStatus, setWeightStatus] = useState('');
  const [message, setMessage] = useState('');
  const [usersData, setUsersData] = useState([]);
  const [allTimeStats, setAllTimeStats] = useState({});
  const [isAdminView, setIsAdminView] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'name') setName(value);
    if (name === 'height') setHeight(value);
    if (name === 'weight') setWeight(value);
    // Clear BMI, weight status, and message when user changes any input
    setBmi(null);
    setWeightStatus('');
    setMessage('');
  };

  const calculateBMI = () => {
    // Validation: Ensure numeric values for height and weight
    if (isNaN(Number(height)) || isNaN(Number(weight))) {
      alert('Please enter numeric values for height and weight.');
      return;
    }

    // Calculate BMI and update state
    const bmiValue = (weight / (height * height)).toFixed(2);
    setBmi(bmiValue);
    determineWeightStatus(bmiValue);
  };

  const determineWeightStatus = (bmi) => {
    if (bmi < 18.5) {
      setWeightStatus('Underweight');
      setMessage('You should eat a little bit more');
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      setWeightStatus('Normal');
      setMessage('Keep doing what you are doing');
    } else if (bmi >= 25.0 && bmi <= 29.9) {
      setWeightStatus('Overweight');
      setMessage('You should cut down on your food a little bit');
    } else {
      setWeightStatus('Obese');
      setMessage('You should really do something about your appetite ASAP');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const userData = { name, height: Number(height), weight: Number(weight) };
    axios
      .post('/api/user', userData)
      .then((response) => {
        const { bmi } = response.data;
        setBmi(bmi);
        determineWeightStatus(bmi);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchUserData = () => {
    axios
      .get('/api/user/users')
      .then((response) => {
        setUsersData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchAllTimeStats = () => {
    axios
      .get('/api/admin/stats')
      .then((response) => {
        setAllTimeStats(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    // Fetch user data and all-time statistics when the component mounts
    fetchUserData();
    fetchAllTimeStats();
  }, []);

  const calculateAllTimeLowHigh = (dataKey) => {
    if (usersData.length === 0) return null;
    return usersData.reduce((acc, user) => {
      return user[dataKey] < acc || acc === null ? user[dataKey] : acc;
    }, null);
  };

  const calculateAverage = (dataKey) => {
    if (usersData.length === 0) return null;
    const sum = usersData.reduce((acc, user) => {
      return acc + user[dataKey];
    }, 0);
    return (sum / usersData.length).toFixed(2);
  };

  const toggleAdminView = () => {
    setIsAdminView(!isAdminView);
  };

  const renderAdminTable = () => {
    return (
      <div className="mt-5">
        <h3>Admin View - User Data</h3>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Height (m)</th>
              <th>Weight (kg)</th>
              <th>BMI</th>
              <th>Weight Status</th>
              <th>Message</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {usersData.map((user, index) => (
              <tr key={index}>
                <td>{user.name}</td>
                <td>{user.height}</td>
                <td>{user.weight}</td>
                <td>{user.bmi}</td>
                <td>{user.weightStatus}</td>
                <td>{user.message}</td>
                <td>{new Date(user.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderAdminStats = () => {
    return (
      <div className="mt-5">
        <h3>Admin View - All-Time Stats</h3>
        <p>
          <strong>All-Time Lowest Weight: </strong>
          {calculateAllTimeLowHigh('weight')}
        </p>
        <p>
          <strong>All-Time Highest Weight: </strong>
          {calculateAllTimeLowHigh('weight')}
        </p>
        <p>
          <strong>All-Time Lowest BMI: </strong>
          {calculateAllTimeLowHigh('bmi')}
        </p>
        <p>
          <strong>All-Time Highest BMI: </strong>
          {calculateAllTimeLowHigh('bmi')}
        </p>
        <p>
          <strong>Average Weight: </strong>
          {calculateAverage('weight')}
        </p>
        <p>
          <strong>Average BMI: </strong>
          {calculateAverage('bmi')}
        </p>
      </div>
    );
  };

  const renderAdminView = () => {
    return (
      <>
        {usersData.length > 0 && renderAdminTable()}
        {Object.keys(allTimeStats).length > 0 && renderAdminStats()}
      </>
    );
  };

  return (
    <div className="container mt-5">
      <h2>BMI Calculator</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Height (meters)</label>
          <input
            type="number"
            name="height"
            value={height}
            onChange={handleInputChange}
            step="0.01"
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Weight (kg)</label>
          <input
            type="number"
            name="weight"
            value={weight}
            onChange={handleInputChange}
            step="0.1"
            className="form-control"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" onClick={calculateBMI}>
          Calculate BMI
        </button>
      </form>
      {bmi !== null && (
        <div className="mt-3">
          <p>
            <strong>BMI: </strong>
            {bmi}
          </p>
          <p>
            <strong>Weight Status: </strong>
            {weightStatus}
          </p>
          <p>
            <strong>Message: </strong>
            {message}
          </p>
        </div>
      )}

      {/* Toggle Admin View */}
      <button className="btn btn-secondary mt-3" onClick={toggleAdminView}>
        {isAdminView ? 'Hide Admin View' : 'Show Admin View'}
      </button>

      {/* Render admin view */}
      {isAdminView && renderAdminView()}
    </div>
  );
}

export default App;
