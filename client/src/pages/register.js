import * as React from 'react';
import {Avatar, Alert, TextField,Fab, Button, Box, CircularProgress, styled} from '@mui/material';
import { useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../util/hooks';
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

export default function Register(props) {

  const [values, setValues] = React.useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    profileImage: ''
  });

  const onChange = (event) => {
      setValues({ ...values, [event.target.name]: event.target.value });
  };

  const onHandleFileInputChange = (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    const formdeatils = formData.append('profileImage', file);
    
    handleFileChange(event);
      setValues({ ...values, profileImage: file  });
    };

  const [file, setFile] = React.useState(null);
  const [previewUrl, setPreviewUrl] = React.useState(null);
  const [errors, setErrors] = React.useState({});
  const navigate = useNavigate();

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, result) {
      navigate("/login");
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
  });

  const onSubmit = event => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("profileImage", values.profileImage);
      fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((result) => {
          const profileImageUrl = result.url;
            addUser({
              variables: {
                username: values.username,
                email: values.email,
                password: values.password,
                confirmPassword: values.confirmPassword,
                profileImage: profileImageUrl
              }
            })
            .then((result) => {
              console.log(result.data);
            })
            .catch((error) => {
              console.error(error);
            });
        })
        .catch((error) => {
          console.error(error);
        });
  }

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
    };
      reader.readAsDataURL(selectedFile);
    }
  };

  const [showChangeButton, setShowChangeButton] = React.useState(false);

  const handleMouseOver = () => {
    setShowChangeButton(true);
  };

  const handleMouseLeave = () => {
    setShowChangeButton(false);
  };

  const StyledBox = styled('span')`
    display: -webkit-inline-box;
    display: -webkit-inline-flex;
    display: -ms-inline-flexbox;
    display: inline-flex;
    -webkit-align-items: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
    position: relative;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
    background-color: transparent;
    outline: 0;
    border: 0;
    margin: 0;
    border-radius: 0;
    padding: 0;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    vertical-align: middle;
    -moz-appearance: none;
    -webkit-appearance: none;
    -webkit-text-decoration: none;
    text-decoration: none;
    color: inherit;
    font-weight: 500;
    font-size: 0.875rem;
    line-height: 1.75;
    letter-spacing: 0.02857em;
    text-transform: uppercase;
    min-width: 64px;
    padding: 6px 16px;
    border-radius: 4px;
    -webkit-transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    color: #fff;
    background-color: #1976d2;
    box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
    `;

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
      encType="multipart/form-data"
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
          id="standard-email-input"
          type='email'
          name='email'
          placeholder='Email*'
          variant="standard"
          value={values.email}
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
        <TextField
          required
          error={false}
          id="standard-confirmpassword-input"
          name='confirmPassword'
          placeholder='Confirm Password*'
          type="password"
          autoComplete="confirm-password"
          variant="standard"
          onChange={onChange}
        />
        <Box sx={{mb:'20px', mt:'10px'}}>
        <Box component={'span'} sx={{ verticalAlign: 'top', marginRight: '20px'}}>Select profile image*</Box>
          <input
            required
            name='profileImage'
            className='d-none'
            accept="image/*"
            id="contained-button-file"
            multiple={false}
            type="file"
            onChange={onHandleFileInputChange}
          />
          {!previewUrl &&
            <label htmlFor="contained-button-file">
            <Fab component="span">
              <AddPhotoAlternateIcon />
            </Fab>
          </label>
          }
          {previewUrl && 
          <label htmlFor="contained-button-file">
          <Box className="imageContainer"
            sx={{
              position: 'relative',
              '&:hover .changeButton': {
                display: 'block',
              },
            }}
              onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave} >
                <Avatar
                  alt="preview"
                  src={previewUrl}
                  sx={{ width: 80, height: 80 }}
                />
              {showChangeButton && (
                <StyledBox className="changeButton" variant="contained" color="primary" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1 }}>Change</StyledBox>
               )} 
            </Box>
          </label>
          }
        </Box>

        <Button type='submit' startIcon={loading ? <CircularProgress sx={{ height:'20px !important', width:'20px !important' }}/> : ""} variant="outlined" >Sign Up</Button>
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

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
    $profileImage: String!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
        profileImage: $profileImage
      }
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