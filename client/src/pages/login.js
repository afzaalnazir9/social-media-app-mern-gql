import * as React from 'react';
import {Alert, TextField, Button, Box, CircularProgress, styled} from '@mui/material';
import { useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../util/hooks';
import { useDispatch } from 'react-redux';
import { setLoginResponse } from '../Redux/Reducers/auth';

export default function Register(props) {
  const dispatch = useDispatch();
  const {values, onChange, onSubmit } = useForm(loginUser, {
    username: '',
    password: '',
  });
  const [errors, setErrors] = React.useState({});
  const navigate = useNavigate();
  const ProgressLoader = styled(CircularProgress)`
    height:20px !important;
    width:20px !important;
  `;

  const [addUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, result) {
      localStorage.setItem("token", result?.data?.login?.token);
      dispatch(setLoginResponse(result.data.login));
      navigate("/");
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    variables: values
  });

  function loginUser() {
    addUser();
  }

  return (
    <Box
      component="form"
      sx={{
        width: '400px',
        m: 'auto',
        '& .MuiTextField-root': { mb: 1, mt: 1, width: '100%' },
      }}
      noValidate
      autoComplete="off"
      onSubmit={onSubmit}
    > 
        <TextField
          required
          error={false}
          id='standard-username-input'
          type='text'
          name='username'
          placeholder='Username*'
          variant="standard"
          value={values.username}
          onChange={onChange}
        />
        <TextField
          required
          error={false}
          id="standard-password-input"
          name='password'
          type="password"
          placeholder='Password*'
          autoComplete="current-password"
          variant="standard"
          value={values.password}
          onChange={onChange}
        />
        <Button type='submit' startIcon={loading ? <ProgressLoader /> : ""} variant="outlined" >Login</Button>
        {Object.keys(errors).length > 0 && (
          <div className="errorList">
            {Object.values(errors).map((value) => (
              <Alert key={value} sx={{mt:2}} variant="outlined" severity="error">
                {value}
              </Alert>
            ))}
          </div>
      )}
    </Box>
  );
}

const LOGIN_USER = gql`
  mutation login(
    $username: String!
    $password: String!
  ) {
    login(
        username: $username
        password: $password
    ) {
      id
      email
      username
      createdAt
      profileImage
      token
      customerID
    }
  }
`;