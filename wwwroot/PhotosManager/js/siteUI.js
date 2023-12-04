let contentScrollPosition = 0;
Init_UI();
console.log("Allo");
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Views rendering
function showWaitingGif() {
  eraseContent();
  $("#content").append(
    $(
      "<div class='waitingGifcontainer'><img class='waitingGif' src='images/Loading_icon.gif' /></div>'"
    )
  );
}
function isUser(loggedUser) {
  return (
    loggedUser.Authorizations.readAccess == 1 &&
    loggedUser.Authorizations.writeAccess == 1
  );
}
function isAdmin(loggedUser) {
  return (
    loggedUser.Authorizations.readAccess == 2 &&
    loggedUser.Authorizations.writeAccess == 2
  );
}
function getUserById(usersArray, userId) {
  return usersArray.find(user => user.Id === userId);
}

function eraseContent() {
  $("#content").empty();
}
function renderError(message) {
  eraseContent();
  $("#content").append(
    $(`
          <div class="errorContainer">
              ${message}
          </div>
          <hr>
          <div class="cancel">
        <button class="form-control btn-primary" id="loginCmd">Annuler</button>
        </div>

      `)
  );
  $("#loginCmd").on("click", function () {
    renderLoginForm();
  });
}
function saveContentScrollPosition() {
  contentScrollPosition = $("#content")[0].scrollTop;
}
function restoreContentScrollPosition() {
  $("#content")[0].scrollTop = contentScrollPosition;
}
function updateHeader(titre = "", header = "", loggedUser = null) {
  $("#header").empty();
  if (loggedUser == null) {
    $("#header").append(
      $(`<img src="favicon.ico" class="appLogo" alt="" title="Gestionnaire de favoris">
              <h4 id="actionTitle">${titre}</h4>
              <div class="dropdown ms-auto">
                  <div data-bs-toggle="dropdown" aria-expanded="false">
                      <i class="cmdIcon fa fa-ellipsis-vertical"></i>
                  </div>
                  <div class="dropdown-menu noselect" id="DDMenu">
                  <div class="dropdown-item menuItemLayout" id="aboutCmd">
                      <i class="menuIcon fa fa-info-circle mx-2"></i> À propos...
                  </div>
              </div>
          </div>`)
    );
  } else {
    let menuAdmin = isAdmin(loggedUser)
      ? `<span class="dropdown-item" id="manageUserCmd">
    <i class="menuIcon fas fa-user-cog mx-2"></i>
    Gestion des usagers
    </span>
    <div class="dropdown-divider"></div>`
      : ``;
    let newPhotoCmd =
      header == `mainPage`
        ? `<div class="cmdIcon fa fa-plus" id="newPhotoCmd" title="Ajouter une photo"></div>`
        : ``;
    $("#header").append(
      $(`<span title="Liste des photos" id="listPhotosCmd">
          <img src="images/PhotoCloudLogo.png" class="appLogo">
           </span>
          <span class="viewTitle">${titre}
          ${newPhotoCmd}
          </span>
          <div class="headerMenusContainer">
          <span>&nbsp;</span> <!--filler-->
          <i title="Modifier votre profil">
          <div class="UserAvatarSmall" userid="${loggedUser.Id}" id="editProfilCmd"
          style="background-image:url('${loggedUser.Avatar}')"
          title="Nicolas Chourot"></div>
          </i>
          <div class="dropdown ms-auto dropdownLayout">
          <!-- Articles de menu -->
          
    <div data-bs-toggle="dropdown" aria-expanded="false">
    <i class="cmdIcon fa fa-ellipsis-vertical"></i>
    </div>
    <div class="dropdown-menu noselect">
    ${menuAdmin}
    <span class="dropdown-item" id="logoutCmd">
    <i class="menuIcon fa fa-sign-out mx-2"></i>
    Déconnexion
    </span>
    <span class="dropdown-item" id="editProfilMenuCmd">
    <i class="menuIcon fa fa-user-edit mx-2"></i>
    Modifier votre profil
    </span>
    <div class="dropdown-divider"></div>
    <span class="dropdown-item" id="listPhotosMenuCmd">
    <i class="menuIcon fa fa-image mx-2"></i>
    Liste des photos
    </span>
    <div class="dropdown-divider"></div>
    <span class="dropdown-item" id="sortByDateCmd">
    <i class="menuIcon fa fa-check mx-2"></i>
    <i class="menuIcon fa fa-calendar mx-2"></i>
    Photos par date de création
    </span>
    <span class="dropdown-item" id="sortByOwnersCmd">
    <i class="menuIcon fa fa-fw mx-2"></i>
    <i class="menuIcon fa fa-users mx-2"></i>
    Photos par créateur
    </span>
    <span class="dropdown-item" id="sortByLikesCmd">
    <i class="menuIcon fa fa-fw mx-2"></i>
    <i class="menuIcon fa fa-user mx-2"></i>
    Photos les plus aiméés
    </span>
    <span class="dropdown-item" id="ownerOnlyCmd">
    <i class="menuIcon fa fa-fw mx-2"></i>
    <i class="menuIcon fa fa-user mx-2"></i>
    Mes photos
    </span>
    <div class="dropdown-divider"></div>
    <span class="dropdown-item" id="aboutCmd">
    <i class="menuIcon fa fa-info-circle mx-2"></i>
    À propos...
    </span>
    </div>
          </div>
          </div>`)
    );
    $("#manageUserCmd").on("click", function () {
      renderAdminPage();
    });
    $("#editProfilMenuCmd").on("click", function () {
      renderEditProfil(loggedUser);
    });
    $("#logoutCmd").on("click", function () {
      API.logout();
      renderLoginForm();
    });
  }
}
function renderLoginForm(
  Email = "",
  EmailError = "",
  passwordError = "",
  expiredSessionMessage = "",
  newContactMessage = "",
) {
  noTimeout();
  saveContentScrollPosition();
  eraseContent();
  updateHeader("Connexion", "login");
  $("#content").append(
    $(`<div class="content" style="text-align:center">
        <h3 class="errorContainer">${expiredSessionMessage}</h3>
        <h3 class="errorContainer">${newContactMessage}</h3>
        <form class="form" id="loginForm">
            <input type='email'
                name='Email'
                class="form-control"
                required
                RequireMessage = 'Veuillez entrer votre courriel'
                InvalidMessage = 'Courriel invalide'
                placeholder="adresse de courriel"
                value='${Email}'>
            <span style='color:red'>${EmailError}</span>
            <input type='password'
                name='Password'
                placeholder='Mot de passe'
                class="form-control"
                required
                RequireMessage = 'Veuillez entrer votre mot de passe'>
            <span style='color:red'>${passwordError}</span>
            <input type='submit' name='submit' value="Entrer" class="form-control btn-primary">
        </form>
        <div class="form">
            <hr>
            <button class="form-control btn-info" id="createProfilCmd">Nouveau compte</button>
        </div>
    </div>`)
  );
  initFormValidation();

  $("#aboutCmd").on("click", function () {
    renderAbout();
  });
  $("#createProfilCmd").on("click", function () {
    renderCreateProfil();
  });
  $("#loginForm").on("submit", async function (event) {
    event.preventDefault();
    let profil = getFormData($("#loginForm"));
    // showWaitingGif();
    await API.login(profil.Email, profil.Password);
    if (API.error) {
      switch (API.currentStatus) {
        case 481:
          renderLoginForm(profil.Email, "Courriel introuvable");
          break;
        case 482:
          renderLoginForm(profil.Email, "", "Mot de passe incorrect");
          break;
        default:
          renderError("Le serveur ne répond pas");
      }
    }
  });
}
function getFormData($form) {
  const removeTag = new RegExp("(<[a-zA-Z0-9]+>)|(</[a-zA-Z0-9]+>)", "g");
  var jsonObject = {};
  $.each($form.serializeArray(), (index, control) => {
    jsonObject[control.name] = control.value.replace(removeTag, "");
  });
  return jsonObject;
}
function renderCreateProfil() {
  noTimeout(); // ne pas limiter le temps d’inactivité
  eraseContent(); // effacer le conteneur #content
  updateHeader("Inscription", "createProfil"); // mettre à jour l’entête et menu
  $("#newPhotoCmd").hide(); // camouffler l’icone de commande d’ajout de photo
  //J'ai rajouter un newProfil
  //let createProfil = NewProfile();
  $("#content").append(
    `<form class="form" id="createProfilForm"'>
      <fieldset>
        <legend>Adresse ce courriel</legend>
        <input type="email"
           class="form-control Email"
           name="Email"
           id="Email"
           placeholder="Courriel"
           required
           RequireMessage = 'Veuillez entrer votre courriel'
           InvalidMessage = 'Courriel invalide'
           CustomErrorMessage ="Ce courriel est déjà utilisé"
           
           />
        <input class="form-control MatchedInput"
           type="text"
           matchedInputId="Email"
           name="matchedEmail"
           id="matchedEmail"
           placeholder="Vérification"
           required
           RequireMessage = 'Veuillez entrez de nouveau votre courriel'
           InvalidMessage="Les courriels ne correspondent pas" />
    </fieldset>
    <fieldset>
      <legend>Mot de passe</legend>
      <input type="password"
        class="form-control"
        name="Password"
        id="Password"
        placeholder="Mot de passe"
        required
        RequireMessage = 'Veuillez entrer un mot de passe'
        InvalidMessage = 'Mot de passe trop court'/>
      <input class="form-control MatchedInput"
        type="password"
        matchedInputId="Password"
        name="matchedPassword"
        id="matchedPassword"
        placeholder="Vérification" required
        InvalidMessage="Ne correspond pas au mot de passe" />
    </fieldset>
    <fieldset>
      <legend>Nom</legend>
      <input type="text"
        class="form-control Alpha"
        name="Name"
        id="Name"
        placeholder="Nom"
        required
        RequireMessage = 'Veuillez entrer votre nom'
        InvalidMessage = 'Nom invalide'/>
    </fieldset>
    <fieldset>
      <legend>Avatar</legend>
      <div class='imageUploader'
        newImage='true'
        controlId='Avatar'
        imageSrc='images/no-avatar.png'
        waitingImage="images/Loading_icon.gif">
      </div>
    </fieldset>
     <input type='submit' name='submit' id='saveUserCmd' value="Enregistrer" class="form-control btn-primary">
    </form>
    <div class="cancel">
      <button class="form-control btn-secondary" id="abortCmd">Annuler</button>
    </div>`
  );
  $("#loginCmd").on("click", function () {
    renderLoginForm();
  });
  initFormValidation();
  initImageUploaders();
  $("#abortCmd").on("click", function () {
    renderLoginForm();
  }); // ajouter le mécanisme de vérification de doublon de courriel
  addConflictValidation(API.checkConflictURL(), "Email", "saveUserCmd");// il vérifie si c'est un type courriel
  //Vérifie si le courriel existe déjà dans la base de donnée
  // call back la soumission du formulaire
  $("#createProfilForm").on("submit", function (event) {
    let profil = getFormData($("#createProfilForm"));
    delete profil.matchedPassword;
    delete profil.matchedEmail;
    event.preventDefault(); // empêcher le fureteur de soumettre une requête de soumission
    showWaitingGif(); // afficher GIF d’attente
    createProfil(profil); // commander la création au service API
  });
}



function createProfil(profil) {
  if (profil != null) {
    API.register(profil);//rajouter une fonction qui amène au menu avec le message de confirmation de cération?
    renderLoginForm( "", "", "", "", `
          Votre compte à été créé. Veillez prendre vos courriel¸
          pour récupérer votre code de vérification qui vous sera demandé lors de votre prochaine conexion`);
  }
  else {
    renderError("Profil pas créer");
  }
}

function renderMainPage(user) {
  initTimeout(300, function () {
    API.logout();
    renderLoginForm(
      "",
      "",
      "",
      "Votre session est expirée. Veuillez vous reconnecter."
    );
  });

  timeout();
  eraseContent();
  updateHeader("Liste des photos", "mainPage", user); // mettre à jour l’entête et menu
}

function renderEditProfil(loggedUser) {
  eraseContent(); // effacer le conteneur #content
  updateHeader("Profil", "editProfil", loggedUser); // mettre à jour l’entête et menu
  $("#newPhotoCmd").hide(); // camouffler l’icone de commande d’ajout de photo
  $("#content").append(
    `<form class="form" id="editProfilForm"'>
      <input type="hidden" name="Id" id="Id" value="${loggedUser.Id}"/>
      <fieldset>
        <legend>Adresse ce courriel</legend>
        <input type="email"
          class="form-control Email"
          name="Email"
          id="Email"
          placeholder="Courriel"
          required
          RequireMessage = 'Veuillez entrer votre courriel'
          InvalidMessage = 'Courriel invalide'
          CustomErrorMessage ="Ce courriel est déjà utilisé"
          value="${loggedUser.Email}" >
        <input class="form-control MatchedInput"
          type="text"
          matchedInputId="Email"
          name="matchedEmail"
          id="matchedEmail"
          placeholder="Vérification"
          required
          RequireMessage = 'Veuillez entrez de nouveau votre courriel'
          InvalidMessage="Les courriels ne correspondent pas"
          value="${loggedUser.Email}" >
      </fieldset>
      <fieldset>
        <legend>Mot de passe</legend>
        <input type="password"
          class="form-control"
          name="Password"
          id="Password"
          placeholder="Mot de passe"
          InvalidMessage = 'Mot de passe trop court' >
        <input class="form-control MatchedInput"
          type="password"
          matchedInputId="Password"
          name="matchedPassword"
          id="matchedPassword"
          placeholder="Vérification"
          InvalidMessage="Ne correspond pas au mot de passe" >
    </fieldset>
    <fieldset>
      <legend>Nom</legend>
      <input type="text"
        class="form-control Alpha"
        name="Name"
        id="Name"
        placeholder="Nom"
        required
        RequireMessage = 'Veuillez entrer votre nom'
        InvalidMessage = 'Nom invalide'
        value="${loggedUser.Name}" >
    </fieldset>
    <fieldset>
      <legend>Avatar</legend>
      <div class='imageUploader'
        newImage='false'
        controlId='Avatar'
        imageSrc='${loggedUser.Avatar}'
         waitingImage="images/Loading_icon.gif">
      </div>
    </fieldset>
       <input type='submit'
         name='submit'
         id='saveUserCmd'
         value="Enregistrer"
         class="form-control btn-primary">
    </form>
    <div class="cancel">
      <button class="form-control btn-secondary" id="abortCmd">Annuler</button>
    </div>
    <div class="cancel"> <hr>
      <button class="form-control btn-warning" id="deleteCmd">Effacer le compte</button>
    </div>`
  );
  $("#abortCmd").on("click", function () {
    renderMainPage(loggedUser);
  });
  $("#deleteCmd").on("click", function () {
    renderDeleteProfil(loggedUser);
  });
}

function renderDeleteProfil(user) {
  initTimeout(300, function () {
    API.logout();
    renderLoginForm(
      "",
      "",
      "",
      "Votre session est expirée. Veuillez vous reconnecter."
    );
  });
  updateHeader("Retrait de compte", "deleteProfil", user); // mettre à jour l’entête et menu
  eraseContent();
  $("#content").append(
    $(`
        <form class="UserdeleteForm" id="deleteUserForm">
          <div class="cancel">
          <h3>Voulez-vous vraiment effacer votre compte?</h3>
          </div>
          <div class="cancel">
        <button class="form-control btn-primary" id="deleteCmd">Effacer mon compte</button>
        <br>
        <button class="form-control btn-secondary" id="abortCmd">Annuler</button>
        </div>
        </form>
      `)
  );
  $("#abortCmd").on("click", function () {
    renderEditProfil(user);
  });
  $("#deleteUserForm").on("submit", async function (event) {
    event.preventDefault();
    await API.unsubscribeAccount(user.Id);
    API.logout();
    renderLoginForm();
  });
}

function renderAdminPage() {
  let loggedUser = API.retrieveLoggedUser();
  if (!isAdmin(loggedUser)) {
    renderMainPage(loggedUser);
  } else {
    initTimeout(300, function () {
      API.logout();
      renderLoginForm(
        "",
        "",
        "",
        "Votre session est expirée. Veuillez vous reconnecter."
      );
    });
    updateHeader("Gestion des usagers", "admin", loggedUser); // mettre à jour l’entête et menu
    eraseContent();
    $("#content").append(`<div class="UserContainer">`);
    API.GetAccounts()
      .then((result) => {
        result.data.forEach((user) => {
          console.log(user);
          let promoIcon = ``;
          let verifiedIcon = ``;
          if (isAdmin(user)) {
            promoIcon = `<i class="fas fa-user-cog dodgerblueCmd" userid="${user.Id}"></i>`;
          } else if (isUser(user)) {
            promoIcon = `<i class="fas fa-user-alt dodgerblueCmd" userid="${user.Id}"></i>`;
          }
          if(user.VerifyCode == "verified"){
            verifiedIcon = `<i class="fa-regular fa-circle greenCmd" userid="${user.Id}"></i>`;
          }
          else if (user.VerifyCode == "blocked"){
            verifiedIcon = `<i class="fa fa-ban redCmd" userid="${user.Id}"></i>`;
          }
          $("#content").append(
            $(`
              <div class="UserRow">
                <div class="UserLayout">
                <span class="UserInfo">
                  <i>
                    <div class="UserAvatar" userid="${user.Id}"
                    style="background-image:url('${user.Avatar}')"
                    title="${user.Name}"></div>
                  </i>
                  <span class="UserName">${user.Name}</span>
                  <span class="UserEmail">${user.Email}</span>
                </span>
                </div>
                <span class="UserCommandPanel">
                  ${promoIcon}
                  ${verifiedIcon}
                  <i class="fas fa-user-slash goldenrodCmd" userid="${user.Id}"></i>
                </span>
              </div>
              </div>
            `)
          );
        });
      $('#content').on('click', '.fas.fa-user-cog', async function() {
          var userId = $(this).attr('userid'); // Get the userid from the clicked icon
          $(this).addClass('fa-user-alt');
          $(this).removeClass('fa-user-cog');
      });
  
      $('#content').on('click', '.fas.fa-user-alt', async function() {
        var userId = $(this).attr('userid'); // Get the userid from the clicked icon
        await API.promoteAccount(userId);
        $(this).addClass('fa-user-cog');
        $(this).removeClass('fa-user-alt');

      });
  
      $('#content').on('click', '.fa-regular.fa-circle, .fa.fa-ban', function() {
          var userId = $(this).attr('userid'); // Get the userid from the clicked icon
      });
  
      $('#content').on('click', '.fas.fa-user-slash', function() {
          var userId = $(this).attr('userid'); // Get the userid from the clicked icon
          let user = getUserById(result.data, userId);
          renderRemoveUser(user);
      });
      })
      .catch((error) => {
        // Handle any errors that might occur during the Promise execution
        console.error("Error:", error);
      });
      $("#content").append(`</div>`);
    
  }
}

function renderRemoveUser(userToRemove){
  initTimeout(300, function () {
    API.logout();
    renderLoginForm(
      "",
      "",
      "",
      "Votre session est expirée. Veuillez vous reconnecter."
    );
  });
  updateHeader("Retrait de compte", "deleteProfil", userToRemove); // mettre à jour l’entête et menu
  eraseContent();
  $("#content").append(
    $(`
        <form class="UserdeleteForm" id="deleteUserForm">
          <div class="cancel">
          <h3>Voulez-vous vraiment effacer cet usager et toutes ses photos?</h3>
          </div>
          <div class="UserRow">
                <div class="UserLayout">
                <span class="UserInfo">
                  <i title="Modifier votre profil">
                    <div class="UserAvatar" userid="${userToRemove.Id}" id="editProfilCmd"
                    style="background-image:url('${userToRemove.Avatar}')"
                    title="${userToRemove.Name}"></div>
                  </i>
                  <span class="UserName">${userToRemove.Name}</span>
                  <span class="UserEmail">${userToRemove.Email}</span>
                </span>
                </div>
          </div>
          <div class="cancel">
        <button class="form-control btn-primary" id="deleteCmd">Effacer mon compte</button>
        <br>
        <button class="form-control btn-secondary" id="abortCmd">Annuler</button>
        </div>
        </form>
      `)
  );
  $("#abortCmd").on("click", function () {
    renderAdminPage();
  });
  $("#deleteUserForm").on("submit", async function (event) {
    event.preventDefault();
    await API.unsubscribeAccount(userToRemove.Id);
    renderAdminPage();
  });
}

function renderAbout() {
  timeout();
  saveContentScrollPosition();
  eraseContent();
  updateHeader("À propos...", "about");

  $("#content").append(
    $(`
            <div class="aboutContainer">
                <h2>Gestionnaire de photos</h2>
                <hr>
                <p>
                    Petite application de gestion de photos multiusagers à titre de démonstration
                    d'interface utilisateur monopage réactive.
                </p>
                <p>
                    Auteur: Nicolas Chourot
                </p>
                <p>
                    Collège Lionel-Groulx, automne 2023
                </p>
            </div>
        `)
  );
}

function Init_UI() {
  let user = API.retrieveLoggedUser();
  if (user == null) {
    renderLoginForm();
  } else {
    renderMainPage(user);
  }
}
