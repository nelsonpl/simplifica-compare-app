export class GoogleUser {
  email: string;
  userId: string;
  displayName: string;
  familyName: string;
  givenName: string;
  imageUrl: string;
  cell: string;
  idToken: string;
  serverAuthCode: string;
  accessToken: string;
}

// obj.email          // 'eddyverbruggen@gmail.com'
// obj.userId         // user id
// obj.displayName    // 'Eddy Verbruggen'
// obj.familyName     // 'Verbruggen'
// obj.givenName      // 'Eddy'
// obj.imageUrl       // 'http://link-to-my-profilepic.google.com'
// obj.idToken        // idToken that can be exchanged to verify user identity.
// obj.serverAuthCode // Auth code that can be exchanged for an access token and refresh token for offline access
// obj.accessToken    // OAuth2 access token
