import React, { useState, useEffect, useCallback } from "react";
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import Alert from "../../components/Alert/Alarm";
import CancelCourse from "./CancelCourse";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import axios from "axios";
import dayjs from "dayjs";
import "./Courses.scss";
import Loading from "../../components/Loading/Loading.jsx";

const NewCoursePage = ({ user, city, component }) => {
  const [courses, setCourses] = useState(null);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [cancelStatus, setCancelStatus] = useState(false);
  const [alertStatus, setAlertStatus] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("message");
  const history = useHistory();

  const closeConfirmationAlert = () => {
    setCancelStatus(false);
  };

  const showAlert = (type, message) => {
    setAlertStatus(true);
    setAlertType(type);
    setAlertMessage(message);
  };

  const getCourses = useCallback(async () => {
    try {
      let allCourses = await axios.get(`/api/v1/courses`);
      if (allCourses.data.data.length > 0) {
        allCourses = allCourses.data.data.filter(
          (course) => course.cityName === city
        );
        if (allCourses.length > 0) {
          setCourses(allCourses);
        } else {
          history.push("/");
        }
      } else {
        history.push("/");
      }
    } catch (err) {
      console.log(err);
    }
  }, [city, history]);
  useEffect(() => {
    getCourses();
  }, [getCourses]);
  return (
    <div>
      <Header user={user} city={city} component={component} />

      <div className="courses-container">
        <div className="page-title">
          <p>{city}</p> <i className="fas fa-chevron-right"></i>
          <p>Courses</p>
        </div>

        {cancelStatus && (
          <CancelCourse
            user={user}
            city={city}
            component={component}
            currentCourse={currentCourse}
            closeHandler={closeConfirmationAlert}
            showAlert={showAlert}
          />
        )}
        {alertStatus && <Alert type={alertType}> {alertMessage} </Alert>}

        <div className="table-responsive animate__animated animate__fadeIn">
          <table className="table" cellSpacing="0" cellPadding="0">
            <thead>
              <tr className="header-tr">
                <th scope="col">Course</th>
                <th scope="col" className="hide-city-col">
                  City
                </th>
                <th scope="col">Start Date</th>
                <th scope="col">End Date</th>
                <th scope="col">Edit</th>
                <th scope="col">Delete</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {courses && courses.length > 0 ? (
                courses.map((course, index) => {
                  return (
                    <tr key={index}>
                      <td>{course.intakeName}</td>
                      <td className="hide-city-col">{course.cityName}</td>
                      <td>
                        {dayjs(course.startDate).format("DD - MM - YYYY")}
                      </td>
                      <td>{dayjs(course.endDate).format("DD - MM - YYYY")}</td>
                      <td>
                        <Link to={`/${user}/${city}/editcourse/${course._id}`}>
                          <button className="btn-edit-course">
                            <i className="fas fa-pencil-alt"></i>
                          </button>
                        </Link>
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            setCurrentCourse(course);
                            setCancelStatus(true);
                          }}
                          className="btn-delete-course"
                        >
                          <i className="far fa-trash-alt"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <Loading />
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NewCoursePage;
