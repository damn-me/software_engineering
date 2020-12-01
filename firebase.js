
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
apiKey: "AIzaSyAxskUF6tZKQJHG-z4gtl8jJKGXpzVULjk",
authDomain: "bloodforlife-a17ff.firebaseapp.com",
databaseURL: "https://bloodforlife-a17ff.firebaseio.com",
projectId: "bloodforlife-a17ff",
storageBucket: "bloodforlife-a17ff.appspot.com",
messagingSenderId: "482785331371",
appId: "1:482785331371:web:903dede70146d79af24fee",
measurementId: "G-B4NV63MGV1"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

window.onload = function() {
    const auth = firebase.auth();
    firebase.auth().useDeviceLanguage();
    if (location.pathname != "/user.html") {
      window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-up', {
        'size': 'invisible',
        'callback': function(response) {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          onSignInSubmit();
        }
      });
    } else {
      var user = firebase.auth().currentUser;

      if (user) {
        alert("User " + user.uid + " signed in!");
        // User is signed in.
      } else {
        alert("No user signed in");
        // window.open("http://localhost", "_self");
      }
    }
    // firebase.database().ref('Users/' + "useruid+").set({
    //   Name: "name.value",
    //   BloodGroup: "bloodgroup.value",
    //   Age: "age.value",
    //   City: "city.value",
    //   Phone: "phoneNumber.value"
    // });
    // var recaptchaResponse = grecaptcha.getResponse(window.recaptchaWidgetId);
}

function getOTP() {
  var phoneNumber = document.getElementById("mnum");
  var appVerifier = window.recaptchaVerifier;
  firebase.auth().signInWithPhoneNumber(phoneNumber.value, appVerifier)
      .then(function (confirmationResult) {
      // SMS sent. Prompt user to type the code from the message, then sign the
      // user in with confirmationResult.confirm(code).
      window.confirmationResult = confirmationResult;
      alert("SMS containing OTP sent!");
      }).catch(function (error) {
      alert("SMS not sent! Error: " + error.message);
      // ...
      });
}

function signUp() {
    var code = document.getElementById("otp").value;
    var name = document.getElementById("full_name");
    var city = document.getElementById("tb1");
    var age = document.getElementById("tb2");
    var bloodgroup = document.getElementById("blood-group");
    var phoneNumber = document.getElementById("mnum");

    var user;
    confirmationResult.confirm(code).then(function (result) {
      // User signed in successfully.
      user = result.user;
      firebase.database().ref('Users/' + user.uid).set({
        Name: name.value,
        BloodGroup: bloodgroup.value,
        Age: age.value,
        City: city.value,
        Phone: phoneNumber.value
      });
      firebase.database().ref('BloodAvailable/' + bloodgroup.value).set({
        UID: user.uid
      });
      }).catch(function (error) {
        alert("Error signing up! Error: " +  error.message);
        // User couldn't sign in (bad verification code?)
        // ...
      });
    alert("You have signed up for being contacted when any blood emergency needs you!");
    // firebase.auth().onAuthStateChanged(function(user) {
    //   if (user) {
    //     window.location = "user.html";
    //   } else {
    //     // No user is signed in.
    //   }
    // });
}

function pushEmergency() {
    var code = document.getElementById("tb1").value;
    var name = document.getElementById("patient_name");
    var city = document.getElementById("city");
    var hospital = document.getElementById("hospital");
    var bloodgroup = document.getElementById("blood-group");
    var phoneNumber = document.getElementById("mnum");

    confirmationResult.confirm(code).then(function (result) {
      // User signed in successfully.
      var user = result.user;
      firebase.database().ref('Emergencies/' + user.uid).set({
        Name: name.value,
        BloodGroup: bloodgroup.value,
        Hospital: hospital.value,
        City: city.value,
        Phone: phoneNumber.value
      });
      }).catch(function (error) {
        alert("Error signing up! Error: " +  error.message);
        // User couldn't sign in (bad verification code?)
        // ...
      });
      var ref = firebase.database().ref("/BloodAvailable");
      ref.once("value")
        .then(function(snapshot) {
          if(snapshot.hasChild(bloodgroup.value)) {
            alert("Blood Available. Blood Bank is on its way to help you.");
          } else {
            alert("No donor available for this blood type. Blood Bank will contact you.");
          }
        });
      
      // alert("The help is on its way!");
      // window.open("http://localhost", "_self");
}