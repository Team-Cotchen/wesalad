export const CLIENT_ID = process.env.REACT_APP_GOOGLE_API_KEY;
// export const REDIRECT_URI = 'http://localhost:3000/callback';
// export const SCOPE = `https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile`;
// export const GOOGLE_OAUTH = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPE}`;

export const GOOGLE_OAUTH = 'https://wesalad.net/users/google';

/*
`https://accounts.google.com/o/oauth2/v2/auth?
 scope=https%3A//www.googleapis.com/auth/drive.metadata.readonly&
 access_type=offline&
 include_granted_scopes=true&
 response_type=code&
 state=state_parameter_passthrough_value&
 redirect_uri=https%3A//oauth2.example.com/code&
 client_id=client_id`
 */
