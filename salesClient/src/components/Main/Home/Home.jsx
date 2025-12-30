import "./Home.css";

const timings = [
  { break: "01:25 pm", ended: "02:15 PM", date: "10/04/25" },
  { break: "01:00 pm", ended: "02:05 PM", date: "09/04/25" },
  { break: "01:05 pm", ended: "02:30 PM", date: "08/04/25" },
  { break: "01:10 pm", ended: "02:00 PM", date: "07/04/25" },
];

const Home = () => {
  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <h3 className="logo">
          Canova<span>CRM</span>
        </h3>
        <p className="greeting">Good Morning</p>
        <h2 className="username">Rajesh Mehta</h2>
      </header>

      {/* Timings */}
      <section className="section">
        <h3 className="section-title">Timings</h3>

        <div className="blue-card">
          <div>
            <p className="label">Check in</p>
            <p className="time">--:--</p>
          </div>
          <div>
            <p className="label">Check Out</p>
            <p className="time">--:--</p>
          </div>
          <div className="pill"></div>
        </div>

        <div className="blue-card">
          <div>
            <p className="label">Break</p>
            <p className="time">--:--</p>
          </div>
          <div>
            <p className="label">Ended</p>
            <p className="time">--:--</p>
          </div>
          <div className="pill"></div>
        </div>

        <div className="history-card">
          <div className="history-head">
            <span>Break</span>
            <span>Ended</span>
            <span>Date</span>
          </div>

          {timings.map((t, i) => (
            <div className="history-row" key={i}>
              <span>{t.break}</span>
              <span>{t.ended}</span>
              <span>{t.date}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      <section className="section">
        <h3 className="section-title">Recent Activity</h3>
        <div className="activity-card">
          <ul>
            <li>You were assigned 3 more new lead – 1 hour ago</li>
            <li>You Closed a deal today – 2 hours ago</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
 export default Home;