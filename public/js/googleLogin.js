function handleCredentialResponse(response) {
    const idToken = response.credential;

    // Send the token to the backend for verification
    fetch('/google', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Login Successful');
                // Redirect to dashboard or display user info
                console.log(data.user);
            } else {
                alert('Login Failed');
            }
        })
        .catch(error => console.error('Error:', error));
}
