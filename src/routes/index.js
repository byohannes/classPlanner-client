import React from "react";
import users from "../data/users.json";
import Home from "../screen/Home/Home.jsx";
import UpcomingClass from "../screen/UpcomingClass/UpcomingClass.jsx";
import NewClassPage from "../screen/NewClass/NewClassPage.jsx";
import EditClassPage from "../screen/EditClass/EditClassPage.jsx";
import NewBooking from "../screen/NewBooking/NewBooking.jsx";
import CourseCalendarPage from "../screen/CourseCalendar/CourseCalendarPage.jsx";
import ClassVolunteers from "../screen/ClassVolunteers/ClassVolunteers.jsx";
import NewCoursePage from "../screen/NewCourse/NewCoursePage.jsx";
import Courses from "../screen/Courses/Courses.jsx";
import Cities from "../screen/Cities/Cities.jsx";
import NotFound from "../screen/NotFound/NotFound.jsx";
import EditCoursePage from "../screen/EditCourse/EditCoursePage.jsx";
import OverviewPage from "../screen/Overview/OverviewPage.jsx";
import { BrowserRouter as Switch, Route } from "react-router-dom";

export default () => {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route
        exact
        path="/:overview"
        component={({ match }) => {
          const { overview } = match.params;
          if (overview === "overview") {
            return <OverviewPage />;
          }
          return <NotFound />;
        }}
      />
      <Route
        exact
        path="/:user/:component/"
        component={({ match }) => {
          const { user, component } = match.params;
          if (!user || !component) {
            return <NotFound />;
          }
          if (!users.map((user) => user.id).includes(user)) {
            return <NotFound />;
          }
          switch (component) {
            case "cities":
              return <Cities user={user} component={component} />;
            case "newcourse":
              return <NewCoursePage user={user} component={component} />;
            default:
              return <NotFound />;
          }
        }}
      />

      <Route
        exact
        path="/:user/:city/:component/:id?/:weeknumber?"
        component={({ match }) => {
          const { user, city, component, id, weeknumber } = match.params;
          if (!user || !city || !component) {
            return <NotFound />;
          }
          if (!users.map((user) => user.id).includes(user)) {
            return <NotFound />;
          }
          if (
            [
              "editclass",
              "editcourse",
              "attendingvolunteers",
              "newbooking",
            ].includes(component) &&
            !id
          ) {
            return <NotFound />;
          }
          if (
            ["attendingvolunteers", "newbooking"].includes(component) &&
            (!id || !weeknumber)
          ) {
            return <NotFound />;
          }
          if (["editclass", "editcourse"].includes(component)) {
            switch (component) {
              case "editclass":
                return (
                  <EditClassPage
                    user={user}
                    city={city}
                    component={component}
                    id={id}
                  />
                );
              case "editcourse":
                return (
                  <EditCoursePage
                    user={user}
                    city={city}
                    component={component}
                    id={id}
                  />
                );
              default:
                return <NotFound />;
            }
          }

          if (["attendingvolunteers", "newbooking"].includes(component)) {
            switch (component) {
              case "attendingvolunteers":
                return (
                  <ClassVolunteers
                    user={user}
                    city={city}
                    component={component}
                    id={id}
                    WeekNumber={weeknumber}
                  />
                );
              case "newbooking":
                return (
                  <NewBooking
                    user={user}
                    city={city}
                    component={component}
                    id={id}
                    WeekNumber={weeknumber}
                  />
                );
              default:
                return <NotFound />;
            }
          }

          switch (component) {
            case "coursecalendar":
              return (
                <CourseCalendarPage
                  user={user}
                  city={city}
                  component={component}
                />
              );
            case "upcomingclass":
              return (
                <UpcomingClass user={user} city={city} component={component} />
              );
            case "newclass":
              return (
                <NewClassPage user={user} city={city} component={component} />
              );
            case "courses":
              return <Courses user={user} city={city} component={component} />;
            case "newcourse":
              return (
                <NewCoursePage user={user} city={city} component={component} />
              );
            default:
              return <NotFound />;
          }
        }}
      />
    </Switch>
  );
};
