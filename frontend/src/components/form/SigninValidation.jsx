function Validation(value) {
    let error = {};
    // const email_pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;


    if (value.email.length === 0) {
        error.email = "Email cannot be empty";
    } else {
        error.email = "";
    }

    if (value.password === "") {
        error.password = "Password cannot be empty";
    } else if (value.password.length < 5) {
        error.password = "Password must be at least 5 characters long";
    } else {
        error.password = "";
    }
    return error;
}

export default Validation;