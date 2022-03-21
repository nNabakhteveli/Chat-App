export default async function responseGoogle(response: any) {
   if (response.hasOwnProperty('error')) {
      throw new Error("Something went wrong during Google authentication");
   }

   const firstName = response.Du.VX;
   const lastName = response.Du.iW;
   const tokenId = response.tokenId;
   const profilePicURL = response.profileObj.imageUrl;
   const email = response.profileObj.email;

   try {
      const postUser = await fetch('http://localhost:3001/api/google-login', {
         method: 'POST',

         body: JSON.stringify({
            "firstName": firstName,
            "lastName": lastName,
            "tokenID": tokenId,
            "profilePicURL": profilePicURL,
            "email": email
         }),

         headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
         }
      });

      if (postUser.ok) window.location.href = `http://localhost:3000/public-chat?firstName=${firstName}&lastName=${lastName}`;

   } catch (error) {
      console.log('Something went wrong during google authorization', error);
   }
}