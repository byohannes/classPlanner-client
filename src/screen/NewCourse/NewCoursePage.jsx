import React from "react";
import { useForm } from "../../hooks/useForm.jsx";
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import CourseForm from "../../components/CourseForm/CourseForm.jsx";
import axios from "axios";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import Loading from "../../components/Loading/Loading.jsx";
import "./NewCoursePage.scss";
import { useCallback } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useHistory } from "react-router";

const NewCoursePage = ({ user, city, component }) => {
  const [citiesName, setCitiesName] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const history = useHistory();
  dayjs.extend(isBetween);
  const getCourses = async () => {
    try {
      const _Courses = await axios.get(`/api/v1/courses/`);
      if (_Courses.data.data && _Courses.data.data.length > 0) {
        return _Courses.data.data;
      } else {
        return false;
      }
    } catch (err) {
      console.log(err);
    }
  };
  const getCitiesName = useCallback(async () => {
    try {
      let _Courses = await getCourses();
      if (_Courses && _Courses.length > 0) {
        let _citiesName = _Courses.map((course) => course.cityName);
        _citiesName = _citiesName.filter(
          (a, b) => _citiesName.indexOf(a) === b
        );
        setCitiesName(_citiesName);
      } else {
        setCitiesName("Nothing");
      }
    } catch (err) {
      console.log(err);
    }
  }, []);
  const newCourse = async (values) => {
    if (dayjs(values.startDate).isAfter(dayjs(values.endDate))) {
      setSubmit_F(true);
      setAlertMessage({
        type: "danger",
        message:
          "End Date must be after Start Date!",
      });
    } else if (dayjs(values.endDate) <= dayjs(new Date())) {
      setSubmit_F(true);
      setAlertMessage({
        type: "danger",
        message:
          "End Date must be in future!",
      });
    } else {
      let _Courses = await getCourses();
      if (_Courses) {
        _Courses = _Courses.find(
          (course) =>
            (dayjs(values.startDate).isBetween(
              dayjs(course.startDate),
              dayjs(course.endDate),
              "day"
            ) ||
              dayjs(values.endDate).isBetween(
                dayjs(course.startDate),
                dayjs(course.endDate),
                "day"
              ) ||
              dayjs(course.startDate).isBetween(
                dayjs(values.startDate),
                dayjs(values.endDate),
                "day"
              ) ||
              dayjs(course.endDate).isBetween(
                dayjs(values.startDate),
                dayjs(values.endDate),
                "day"
              ) ||
              course.intakeName === values.intakeName) &&
            course.cityName === values.cityName
        );
      }

      if (_Courses) {
        setSubmit_F(true);
        setAlertMessage({
          type: "danger",
          message: "Your Data has conflict with other courses!",
        });
      } else {
        try {
          await axios
            .post(`/api/v1/courses`, {
              ...values,
            })
            .then((response) => {
              if (response.data.success) {
                setAlertMessage({
                  type: "success",
                  message: "New Course added successfully !",
                });
                setTimeout(() => {
                  if (city) {
                    history.push(`/${user}/${city}/courses/`);
                  } else {
                    history.push(`/${user}/cities/`);
                  }
                }, 1000);
              } else {
                setSubmit_F(true);
                setAlertMessage({
                  type: "danger",
                  message: "New Course not added !",
                });
              }
            })
            .catch((err) => {
              if (!err.response.data.success) {
                setAlertMessage({
                  type: "danger",
                  message: err.response.data.message,
                });
              }
            });
        } catch (err) {
          setSubmit_F(true);
          setAlertMessage({
            type: "danger",
            message: "New Course not added !",
          });
        }
      }
    }
  };
  const { entryData, error, onChange, onSubmit, setSubmit_F } = useForm(
    newCourse
  );
  useEffect(() => {
    if (!city) {
      getCitiesName();
    }
  }, [getCitiesName, city]);

  return (
    <div>
      <Header user={user} city={city} component={component} />
      <div className="newcourse-container">
        {city || citiesName ? (
          <CourseForm
            city={city}
            component={component}
            citiesName={citiesName}
            alertMessage={alertMessage}
            entryData={entryData}
            error={error}
            _onChange={onChange}
            _onSubmit={onSubmit}
          />
        ) : (
          <Loading />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default NewCoursePage;
