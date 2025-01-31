// This component shows a table of all the patients in the system
// Leads to a patient's "Journal" component if clicked on a patient

import './AllPatients.css';
import { FC, useState, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@mui/material';
import TriagePopup from './TriagePopup';

// Icons
import { FaInfoCircle } from 'react-icons/fa';
// import { FaSyringe } from "react-icons/fa";
import { GiVial } from 'react-icons/gi';
import { BsAlarmFill } from 'react-icons/bs';

// Type to be used by the map function
export type Patient = {
  id: number;
  firstName: string;
  lastName: string;
  gender: string;
  ssn: string;
  newLabResult: boolean;
  newInfo: string;
  cause: string;
  time: number;
  team: number;
  timeEr: string;
  breathingFrequence: number;
  pulse: number;
  bloodSys: number;
  bloodDia: number;
  saturation: number;
  temp: number;
  rls: number;
  room: string;
  email?: string;
  phoneNumber?: number;
};

type Team = {
  id: number;
};

// Get the current time
const currentDate: Date = new Date();
const today: string = `${currentDate.getDate()}/${currentDate.getMonth() + 1}`;

const AllPatients: FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [patients, setPatients] = useState([]);
  const [teams, setTeams] = useState([]);

  // eslint-disable-next-line no-unused-vars
  const rows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  useEffect(() => {
    fetch('/api/getteams')
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setTeams(data.teams);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch('/api/getpatients')
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setPatients(data.patients);
        setIsLoading(false);
      });
  }, []);
  console.table(patients);
  return !isLoading ? (
    <>
      {teams.map((team: Team) => (
        <table className="patients-team-container" key={team.id}>
          <thead>
            <tr>
              <th>Team {team.id}</th>
            </tr>
            <tr>
              <th>Namn</th>
              <th></th>
              <th>Sökorsak</th>
              <th>Triage</th>
              <th>Rum</th>
              <th style={{ minWidth: '110px' }}>
                Tid till kontroll
                {/* Saving this in case we want a clock instead of text in the future */}
                {/* <abbr title={"Time to checkup"}>
                  <BsAlarmFill style={{fontSize: "30px"}}/>
                </abbr> */}
              </th>
              <th>Ankomst</th>
              <th>Läs mer</th>
            </tr>
          </thead>
          <tbody>
            {/* Go through the patients list and make a row for every required field */}
            {/* At least have as many items as in the head, can be more (e.g indication type) */}
            {patients.map((patient: Patient) =>
              patient.team === team.id ? (
                <tr key={patient.id}>
                  <td className="patient-name">
                    <Link
                      to={`/Patient/${patient.id}/Overview`}
                      className="table-link-journal"
                    >
                      {patient.firstName} {patient.lastName}
                    </Link>
                    <span className="ssn-row">
                      <p>{patient.ssn}</p>
                    </span>
                  </td>
                  <td className="patient-new-info">
                    {/* Show a test result symbol next to name if it exists */}
                    <Link to={`/Patient/${patient.id}/Lab`}>
                      {patient.newLabResult === true && (
                        <abbr title={'Nytt labbresultat'}>
                          <GiVial
                            style={{
                              marginInlineStart: '10px',
                              color: 'red',
                              fontSize: '25px'
                            }}
                          />
                        </abbr>
                      )}
                    </Link>
                    <Link to={`/Patient/${patient.id}/Overview`}>
                      {patient.newInfo && (
                        <abbr title={'Ny information'}>
                          <FaInfoCircle
                            style={{
                              marginInlineStart: '10px',
                              color: patient.newInfo,
                              fontSize: '25px'
                            }}
                          />
                        </abbr>
                      )}
                    </Link>
                  </td>
                  <td>{patient.cause}</td>
                  <td>
                    <TriagePopup id={patient.id} />
                  </td>
                  <td>{patient.room}</td>
                  <td className="patient-checkup-time">
                    {patient.time} min
                    {patient.time < 0 && (
                      <BsAlarmFill
                        style={{
                          marginInlineStart: '5px',
                          color: 'red',
                          fontSize: '20px'
                        }}
                      />
                    )}
                    {patient.time >= 0 && patient.time <= 5 && (
                      <BsAlarmFill
                        style={{
                          marginInlineStart: '5px',
                          color: 'orange',
                          fontSize: '20px'
                        }}
                      />
                    )}
                  </td>
                  <td className="datetime-er">
                    <p>{patient.timeEr.substr(11, 5)}</p>
                    <p>{today}</p>
                  </td>
                  <td>
                    <Link
                      to={`/Patient/${patient.id}/Journal`}
                      className="table-link-journal"
                    >
                      Journal
                    </Link>
                  </td>
                </tr>
              ) : null
            )}
          </tbody>
        </table>
      ))}
    </>
  ) : (
    <>
      <div className="skeleton">
        <Skeleton
          animation="wave"
          variant="rectangular"
          height={300}
          className="single-skeleton"
        />
        <Skeleton
          animation="wave"
          variant="rectangular"
          height={300}
          className="single-skeleton"
        />
        <Skeleton
          animation="wave"
          variant="rectangular"
          height={300}
          className="single-skeleton"
        />
      </div>
    </>
  );
};

export default AllPatients;
