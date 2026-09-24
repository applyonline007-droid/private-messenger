import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    onAuthStateChanged,
    signOut,
    updateProfile
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    setDoc,
    collection,
    getDocs,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";


/* =========================
   FIREBASE CONFIG
========================= */

const firebaseConfig = {

    apiKey: "AIzaSyAAJZCAuzyKS2KWjmv1wmq4egpokXFVjVk",

    authDomain:
        "whatsapp-messenger-31b72.firebaseapp.com",

    projectId:
        "whatsapp-messenger-31b72",

    storageBucket:
        "whatsapp-messenger-31b72.firebasestorage.app",

    messagingSenderId:
        "297782026224",

    appId:
        "1:297782026224:web:063b2bd9f584146ee74735",

    measurementId:
        "G-8RDX7YMKYC"
};


/* =========================
   INITIALIZE FIREBASE
========================= */

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();


/* =========================
   ELEMENTS
========================= */

const authScreen =
    document.getElementById("authScreen");

const mainApp =
    document.getElementById("mainApp");

const loginBox =
    document.getElementById("loginBox");

const registerBox =
    document.getElementById("registerBox");

const loginBtn =
    document.getElementById("loginBtn");

const registerBtn =
    document.getElementById("registerBtn");

const googleLoginBtn =
    document.getElementById("googleLoginBtn");

const logoutBtn =
    document.getElementById("logoutBtn");

const showRegister =
    document.getElementById("showRegister");

const showLogin =
    document.getElementById("showLogin");

const currentUser =
    document.getElementById("currentUser");

const userList =
    document.getElementById("userList");

const searchUsers =
    document.getElementById("searchUsers");


/* =========================
   SHOW REGISTER
========================= */

showRegister.addEventListener("click", () => {

    loginBox.classList.add("hidden");

    registerBox.classList.remove("hidden");

});


/* =========================
   SHOW LOGIN
========================= */

showLogin.addEventListener("click", () => {

    registerBox.classList.add("hidden");

    loginBox.classList.remove("hidden");

});


/* =========================
   REGISTER
========================= */

registerBtn.addEventListener("click", async () => {

    const name =
        document.getElementById("registerName").value.trim();

    const email =
        document.getElementById("registerEmail").value.trim();

    const password =
        document.getElementById("registerPassword").value.trim();

    const message =
        document.getElementById("registerMessage");


    if (!name || !email || !password) {

        message.textContent =
            "Please fill all fields.";

        return;
    }


    if (password.length < 6) {

        message.textContent =
            "Password must be at least 6 characters.";

        return;
    }


    try {

        message.textContent = "Creating account...";


        const userCredential =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );


        const user =
            userCredential.user;


        await updateProfile(user, {
            displayName: name
        });


        await setDoc(
            doc(db, "users", user.uid),
            {
                uid: user.uid,
                name: name,
                email: email,
                createdAt: serverTimestamp()
            }
        );


        message.textContent =
            "Account created successfully!";


    } catch (error) {

        console.error(error);

        message.textContent =
            getFirebaseError(error);

    }

});


/* =========================
   LOGIN
========================= */

loginBtn.addEventListener("click", async () => {

    const email =
        document.getElementById("loginEmail").value.trim();

    const password =
        document.getElementById("loginPassword").value.trim();

    const message =
        document.getElementById("loginMessage");


    if (!email || !password) {

        message.textContent =
            "Please enter email and password.";

        return;
    }


    try {

        message.textContent = "Logging in...";


        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );


        message.textContent = "";


    } catch (error) {

        console.error(error);

        message.textContent =
            getFirebaseError(error);

    }

});


/* =========================
   GOOGLE LOGIN
========================= */

googleLoginBtn.addEventListener("click", async () => {

    try {

        const result =
            await signInWithPopup(
                auth,
                googleProvider
            );


        const user =
            result.user;


        await setDoc(
            doc(db, "users", user.uid),
            {
                uid: user.uid,
                name: user.displayName || "User",
                email: user.email,
                createdAt: serverTimestamp()
            },
            {
                merge: true
            }
        );


    } catch (error) {

        console.error(error);

        document.getElementById("loginMessage")
            .textContent =
            getFirebaseError(error);

    }

});


/* =========================
   AUTH STATE
========================= */

onAuthStateChanged(auth, async (user) => {

    if (user) {

        authScreen.classList.add("hidden");

        mainApp.classList.remove("hidden");


        currentUser.textContent =
            `${user.displayName || user.email} (${user.email})`;


        await loadUsers();

    } else {

        authScreen.classList.remove("hidden");

        mainApp.classList.add("hidden");

    }

});


/* =========================
   LOAD USERS
========================= */

let allUsers = [];


async function loadUsers() {

    try {

        const snapshot =
            await getDocs(
                collection(db, "users")
            );


        allUsers = [];


        snapshot.forEach((document) => {

            const user =
                document.data();


            if (user.uid !== auth.currentUser.uid) {

                allUsers.push(user);

            }

        });


        displayUsers(allUsers);


    } catch (error) {

        console.error(error);

        userList.innerHTML =
            "<p>Unable to load users.</p>";

    }

}


/* =========================
   DISPLAY USERS
========================= */

function displayUsers(users) {

    userList.innerHTML = "";


    if (users.length === 0) {

        userList.innerHTML =
            "<p class='loading'>No other users found.</p>";

        return;
    }


    users.forEach((user) => {

        const card =
            document.createElement("div");


        card.className =
            "user-card";


        const firstLetter =
            (user.name || "U")
                .charAt(0)
                .toUpperCase();


        card.innerHTML = `

            <div class="user-avatar">
                ${firstLetter}
            </div>

            <div>
                <div class="user-name">
                    ${escapeHtml(user.name || "User")}
                </div>

                <div class="user-email">
                    ${escapeHtml(user.email || "")}
                </div>
            </div>

        `;


        card.addEventListener("click", () => {

            alert(
                "Chat feature STEP 8 में आएगा."
            );

        });


        userList.appendChild(card);

    });

}


/* =========================
   SEARCH USERS
========================= */

searchUsers.addEventListener("input", () => {

    const search =
        searchUsers.value
            .toLowerCase()
            .trim();


    const filtered =
        allUsers.filter(user =>

            (user.name || "")
                .toLowerCase()
                .includes(search)

            ||

            (user.email || "")
                .toLowerCase()
                .includes(search)

        );


    displayUsers(filtered);

});


/* =========================
   LOGOUT
========================= */

logoutBtn.addEventListener("click", async () => {

    await signOut(auth);

});


/* =========================
   FIREBASE ERROR MESSAGE
========================= */

function getFirebaseError(error) {

    switch (error.code) {

        case "auth/email-already-in-use":
            return "This email is already registered.";

        case "auth/invalid-email":
            return "Invalid email address.";

        case "auth/weak-password":
            return "Password is too weak.";

        case "auth/invalid-credential":
            return "Invalid email or password.";

        case "auth/popup-closed-by-user":
            return "Google login was cancelled.";

        default:
            return error.message || "Something went wrong.";

    }

}


/* =========================
   HTML SECURITY
========================= */

function escapeHtml(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}
