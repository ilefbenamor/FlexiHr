import React, { useState, useEffect } from 'react';

const DynamicProjectDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    revenueChange: 0,
    projects: 0,
    projectsChange: 0,
    timeSpent: 0,
    timeSpentChange: 0,
    resources: 0,
    resourcesChange: 0,
    projectList: []
  });

  useEffect(() => {
    // Fetch dynamic data for the current user's dashboard
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard-data');
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  return (
    <div className="project-dashboard" style={{
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      padding: '20px'
    }}>
      <div className="header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h1>Project Management Dashboard</h1>
        <div className="user-info" style={{
          display: 'flex',
          alignItems: 'center'
        }}>
          <img src="/profile.jpg" alt="User Avatar" style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            marginRight: '10px'
          }} />
          <span>Alex meian</span>
          <span>Product manager</span>
        </div>
      </div>
      <div className="overview" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridGap: '20px',
        marginBottom: '20px'
      }}>
        <div className="metric" style={{
          backgroundColor: 'white',
          padding: '20px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <div className="title" style={{
            fontSize: '14px',
            color: '#666',
            marginBottom: '10px'
          }}>Total revenue</div>
          <div className="value" style={{
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '10px'
          }}>${dashboardData.totalRevenue.toLocaleString()}</div>
          <div className={`change ${dashboardData.revenueChange >= 0 ? 'positive' : 'negative'}`} style={{
            fontSize: '14px',
            color: dashboardData.revenueChange >= 0 ? 'green' : 'red'
          }}>
            {dashboardData.revenueChange >= 0 ? <ArrowUp /> : <ArrowDown />} {Math.abs(dashboardData.revenueChange)}%
          </div>
        </div>
        <div className="metric" style={{
          backgroundColor: 'white',
          padding: '20px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <div className="title" style={{
            fontSize: '14px',
            color: '#666',
            marginBottom: '10px'
          }}>Projects</div>
          <div className="value" style={{
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '10px'
          }}>{dashboardData.projects}</div>
          <div className={`change ${dashboardData.projectsChange >= 0 ? 'positive' : 'negative'}`} style={{
            fontSize: '14px',
            color: dashboardData.projectsChange >= 0 ? 'green' : 'red'
          }}>
            {dashboardData.projectsChange >= 0 ? <ArrowUp /> : <ArrowDown />} {Math.abs(dashboardData.projectsChange)}%
          </div>
        </div>
        <div className="metric" style={{
          backgroundColor: 'white',
          padding: '20px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <div className="title" style={{
            fontSize: '14px',
            color: '#666',
            marginBottom: '10px'
          }}>Time spent</div>
          <div className="value" style={{
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '10px'
          }}>{dashboardData.timeSpent} hrs</div>
          <div className={`change ${dashboardData.timeSpentChange >= 0 ? 'positive' : 'negative'}`} style={{
            fontSize: '14px',
            color: dashboardData.timeSpentChange >= 0 ? 'green' : 'red'
          }}>
            {dashboardData.timeSpentChange >= 0 ? <ArrowUp /> : <ArrowDown />} {Math.abs(dashboardData.timeSpentChange)}%
          </div>
        </div>
        <div className="metric" style={{
          backgroundColor: 'white',
          padding: '20px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <div className="title" style={{
            fontSize: '14px',
            color: '#666',
            marginBottom: '10px'
          }}>Resources</div>
          <div className="value" style={{
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '10px'
          }}>{dashboardData.resources} / 120</div>
          <div className={`change ${dashboardData.resourcesChange >= 0 ? 'positive' : 'negative'}`} style={{
            fontSize: '14px',
            color: dashboardData.resourcesChange >= 0 ? 'green' : 'red'
          }}>
            {dashboardData.resourcesChange >= 0 ? <ArrowUp /> : <ArrowDown />} {Math.abs(dashboardData.resourcesChange)}%
          </div>
        </div>
      </div>
      <div className="project-summary" style={{
        backgroundColor: 'white',
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        overflowX: 'auto'
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse'
        }}>
          <thead>
            <tr>
              <th style={{
                padding: '10px',
                textAlign: 'left',
                borderBottom: '1px solid #ddd'
              }}>Name</th>
              <th style={{
                padding: '10px',
                textAlign: 'left',
                borderBottom: '1px solid #ddd'
              }}>Project manager</th>
              <th style={{
                padding: '10px',
                textAlign: 'left',
                borderBottom: '1px solid #ddd'
              }}>Due date</th>
              <th style={{
                padding: '10px',
                textAlign: 'left',
                borderBottom: '1px solid #ddd'
              }}>Status</th>
              <th style={{
                padding: '10px',
                textAlign: 'left',
                borderBottom: '1px solid #ddd'
              }}>Progress</th>
            </tr>
          </thead>
          <tbody>
            {dashboardData.projectList.map((project, index) => (
              <tr key={index}>
                <td style={{
                  padding: '10px',
                  borderBottom: '1px solid #ddd'
                }}>{project.name}</td>
                <td style={{
                  padding: '10px',
                  borderBottom: '1px solid #ddd'
                }}>{project.manager}</td>
                <td style={{
                  padding: '10px',
                  borderBottom: '1px solid #ddd'
                }}>{project.dueDate}</td>
                <td style={{
                  padding: '10px',
                  borderBottom: '1px solid #ddd'
                }}>{project.status}</td>
                <td style={{
                  padding: '10px',
                  borderBottom: '1px solid #ddd'
                }}>
                  <div className={`progress-bar ${project.status.toLowerCase()}`} style={{
                    height: '20px',
                    backgroundColor: '#ddd',
                    borderRadius: '10px',
                    overflow: 'hidden'
                  }}>
                    <div className="progress" style={{
                      height: '100%',
                      backgroundColor: project.status === 'Completed' ? '#4caf50' : (project.status === 'Delayed' ? '#ff9800' : '#f44336'),
                      width: `${project.progress}%`
                    }} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="overall-progress" style={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: '20px'
      }}>
        <div className="progress-ring" style={{
          position: 'relative',
          width: '100px',
          height: '100px'
        }}>
          <svg style={{
            width: '100%',
            height: '100%',
            transform: 'rotate(-90deg)'
          }}>
            <circle className="progress-background" cx="50" cy="50" r="45" fill="none" stroke="#ddd" strokeWidth="10" />
            <circle className="progress-bar" cx="50" cy="50" r="45" fill="none" stroke="#4caf50" strokeWidth="10" strokeDasharray="283.1853" strokeDashoffset={283.1853 - (dashboardData.overallProgress / 100) * 283.1853} style={{
              transition: 'stroke-dashoffset 0.5s ease'
            }} />
          </svg>
          <div className="progress-value" style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '18px',
            fontWeight: 'bold'
          }}>{dashboardData.overallProgress}%</div>
        </div>
      </div>
    </div>
  );
};

const ArrowUp = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M7 14l5-5 5 5z" />
  </svg>
);

const ArrowDown = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M7 10l5 5 5-5z" />
  </svg>
);

export default DynamicProjectDashboard;