import { useState } from "react";

export const useForm = (callback, initialState = {}) => {
    const [values, setValues] = useState(initialState);

    const onChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    const onHandleFileInputChange = (event) => {
        const formData = new FormData();
        formData.append('profileImage', values.profileImage);
        setValues({ ...values, profileImage: event.target.files[0] });
    };
  
    const onSubmit = event => {
        event.preventDefault();
        callback();
    }

    return {
       values, onChange, onHandleFileInputChange, onSubmit
    }
}

