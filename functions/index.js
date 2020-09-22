const functions = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();
const Compute = require("@google-cloud/compute");
const express = require("express");
const cookieParser = require('cookie-parser');
const cors = require("cors");
const compute = new Compute();
const zone = compute.zone("europe-west1-b");
const vm = zone.vm("mc-bedrock-server");
const fwname = "minecraft-fw-rule-" + Math.floor(new Date() / 1000);

const app = express();

// Automatically allow cross-origin requests
app.use(cors({origin: true}));

async function get_server_ip() {
  return new Promise((resolve, reject) => {
    vm.getMetadata((err, metadata, apiResponse) => {
      if (err) {
        console.log(err.stack);
      }

      resolve(metadata.networkInterfaces[0].accessConfigs[0].natIP);
    });
  });
}

async function get_server_status() {
  return new Promise((resolve, reject) => {
    vm.getMetadata((err, metadata, apiResponse) => {
      if (err) {
        console.log(err.stack);
      }

      resolve(metadata.status);
    });
  });
}


async function check_if_server_is_ready() {
  const server_ip = await get_server_ip();
  const ready = !!server_ip;
  return ready;
}

async function sleep(milliseconds) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, milliseconds);
  });
}

async function firebaseCheckAuth(req, res) {
  // Check auth token
  console.log('Check if request is authorized with Firebase ID token');

  if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
    !(req.cookies && req.cookies.__session)) {
    console.error('No Firebase ID token was passed as a Bearer token in the Authorization header.',
      'Make sure you authorize your request by providing the following HTTP header:',
      'Authorization: Bearer <Firebase ID Token>',
      'or by passing a "__session" cookie.');
    res.status(403).send('Unauthorized');
  }

  let idToken;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    console.log('Found "Authorization" header');
    // Read the ID Token from the Authorization header.
    idToken = req.headers.authorization.split('Bearer ')[1];
  } else if (req.cookies) {
    console.log('Found "__session" cookie');
    // Read the ID Token from cookie.
    idToken = req.cookies.__session;
  } else {
    // No cookie
    res.status(403).send('Unauthorized');
  }

  try {
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    console.log('ID Token correctly decoded', decodedIdToken);

    let users = [];
    await db.collection("users").get()
      /*eslint-disable */
      .then(function (querySnapshot) {
        querySnapshot.forEach((doc) => {
          users.push(doc.data().email);
        })
      });

    if (users.includes((await admin.auth().verifyIdToken(idToken)).email))
    {
      req.user = decodedIdToken;

      //Add custom claims, to mark the user as verified
      admin.auth().setCustomUserClaims(req.user.uid, {admin: true}).then(() => {
        // The new custom claims will propagate to the user's ID token the
      });

    }
    else {
      console.log("user email was not on cloud firestore");
      res.status(401).send('Not approved');
    }

  } catch (error) {
    console.error('Error while verifying Firebase ID token:', error);
    res.status(403).send('Unauthorized');
  }
}

app.get("/start", async (req, res) => {

  await firebaseCheckAuth(req, res);

  // Start the VM
  const zone = compute.zone("europe-west1-b");

  const vm = zone.vm("mc-bedrock-server");
  console.log("about to start a VM");

  vm.start((err, operation, apiResponse) => {
    if (err) {
      console.log(err.stack);
    }
    console.log("instance start successfully");
  });

  console.log("the server is starting");

  /*eslint-disable */
  while (!(await check_if_server_is_ready())) {
    console.log("Server is not ready, waiting 1 second...");
    await sleep(1000);
    console.log("Checking server readiness again...");
  }
  /*eslint-disable */
  console.log("the server is ready");
  const server_ip = await get_server_ip();

  // Record the function caller's IPv4 address
  console.log(JSON.stringify(req.headers));
  sourceIp = req.get("X-Forwarded-For");
  let callerip = req.query.message || req.body.message || sourceIp;

  // Set the Firewall configs
  const config = {
    protocols: {udp: [19132]},
    ranges: [callerip + "/32"],
    tags: ["minecraft-server"],
  };

  function callback(err, firewall, operation, apiResponse) {
    if (err) {
      console.log(err.stack);
    }
  }

  // Create the Firewall
  compute.createFirewall(fwname, config, callback);

  res.json({ serverIp: server_ip, callerIp: callerip, firewallRuleName: fwname });
});

app.get("/checkclaims", async (req, res) => {

  await firebaseCheckAuth(req, res);

  res.json({ status: 'OK' });
});

app.get("/stop", async (req, res) => {

  await firebaseCheckAuth(req, res);

  // Start the VM
  const zone = compute.zone("europe-west1-b");

  const vm = zone.vm("mc-bedrock-server");
  console.log("about to stop a VM");

  vm.stop((err, operation, apiResponse) => {
    if (err) {
      console.log(err.stack);
    }
    console.log("instance stopped successfully");
  });

  console.log("the server is stopping");
  /* eslint-disable */
  while (!(await check_if_server_is_ready())) {
    console.log("Server is not ready, waiting 1 second...");
    await sleep(1000);
    console.log("Checking server readiness again...");
  }
  /* eslint-enable */
  console.log("the server is stopped");

  res.json({ status: 'TERMINATED' });
});

app.get("/add-a-friend", async (req, res) => {

  //await firebaseCheckAuth(req, res);

  // Record the function caller's IPv4 address
  console.log(JSON.stringify(req.headers));
  let sourceIp = req.get("X-Forwarded-For");
  let callerip = req.query.message || req.body.message || sourceIp;

  // Set the Firewall configs
  const config = {
    protocols: {udp: [19132]},
    ranges: [callerip + "/32"],
    tags: ["minecraft-server"],
  };

  function callback(err, firewall, operation, apiResponse) {
    if (err) {
      console.log(err.stack);
    }
  }

  // Create the Firewall
  compute.createFirewall(fwname, config, callback);

  // Return a response
  res.status(200).send("Firewall rule created named " + fwname + " for IP address " + callerip);
});

app.get("/status", async (req, res) => {

  await firebaseCheckAuth(req, res);

  const zone = compute.zone("europe-west1-b");

  const vm = zone.vm("mc-bedrock-server");
  console.log("about to get status of a VM");

  const server_status = await get_server_status();

  if (server_status === "RUNNING") {
    res.json({ status: 'RUNNING' })
  } else if (server_status === "TERMINATED") {
    res.json({ status: 'TERMINATED' })
  }
});

// Expose Express API as a single Cloud Function:
exports.api = functions.region("europe-west1").https.onRequest(app);
