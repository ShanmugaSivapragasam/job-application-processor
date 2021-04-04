async function request() {
    const targetAudience = process.env.VALIDATE_URL;
    console.log(' targetAudience: ' + targetAudience)
    const { GoogleAuth } = require('google-auth-library');
    const auth = new GoogleAuth();
    const client = await auth.getIdTokenClient(targetAudience);
    const { status, data } = await client.request({
        url: targetAudience ,
        method: 'POST',
        data : {
            message: 'Ring... Ring.... CALL from trigger '
        }
    })
    console.log('response data ' + data + 'status ' + status);
}

exports.helloFirestore = (event, context) => {
    const resource = context.resource;
    // log out the resource string that triggered the function
    console.log('Function triggered by change to: ' + resource);
    // now log the full event object
    console.log( 'event object : '  + JSON.stringify(event));

    request().catch(err => {
        console.log('error while calling the final one --> ' + err.message);
        process.exitCode = 1;
    });
};