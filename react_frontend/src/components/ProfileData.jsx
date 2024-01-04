import React from 'react';
/**
 * Renders information about the user obtained from MS Graph 
 * @param props
 */
import PropTypes from 'prop-types';

export const ProfileData = (props) => {
  return (
    <div id="profile-div">
      <p>
        <strong>First Name: </strong> {props.graphData.givenName}
      </p>
      <p>
        <strong>Last Name: </strong> {props.graphData.surname}
      </p>
      <p>
        <strong>Email: </strong> {props.graphData.userPrincipalName}
      </p>
      <p>
        <strong>Id: </strong> {props.graphData.id}
      </p>
    </div>
  );
};

ProfileData.propTypes = {
  graphData: PropTypes.shape({
    givenName: PropTypes.string.isRequired,
    surname: PropTypes.string.isRequired,
    userPrincipalName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
};