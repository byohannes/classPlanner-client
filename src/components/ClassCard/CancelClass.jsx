import React from "react";
import axios from "axios";
import "./CancelClass.scss";
const CancelClass = ({
  user,
  city,
  component,
  currentClass,
  closeHandler,
  showAlert,
}) => {
  function deleteClass() {
    axios
      .delete(`/api/v1/classes/${currentClass._id}`)
      .then(function (response) {
        if (response.data.success === true) {
          closeHandler();
          showAlert("success", "The class has been deleted successfully.");
          setTimeout(() => {
            window.location.replace(`/${user}/${city}/${component}/`);
          }, 1000);
        }
      })
      .catch(function (err) {
        closeHandler();
        if (err.response.data.success === false) {
          showAlert("danger", err.response.data.error);
        }
      });
  }
  return (
    <div className="cancel-alert">
      <p>Are you sure to cancel the corresponding Class?</p>
      <div>
        <button className="cancelclass-no" onClick={() => closeHandler(true)}>
          NO
        </button>
        <button className="cancelclass-yes" onClick={deleteClass}>
          YES
        </button>
      </div>
    </div>
  );
};

export default CancelClass;
