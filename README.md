[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/entvex/Minecraft-bedrock-on-GCP">
    <img src="images/logo.png" alt="Logo" width="160" height="80">
  </a>

  <h3 align="center">Minecraft bedrock on GCP</h3>

  <p align="center">
    This project is an small application for managing a Minecraft bedrock on GCP
    <br />
    <a href="https://github.com/entvex/Minecraft-bedrock-on-GCP"><strong>Explore the docs »</strong></a>
    <br />
    <br /> 
    <a href="https://github.com/entvex/Minecraft-bedrock-on-GCP/issues">Report Bug</a>
    ·
    <a href="https://github.com/entvex/Minecraft-bedrock-on-GCP/issues">Request Feature</a>
  </p>
</p>

<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about-the-project)
  * [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
<!--* [Usage](#usage) -->
* [Roadmap](#roadmap)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)
<!-- [Acknowledgements](#acknowledgements) -->

<!-- ABOUT THE PROJECT -->
## About The Project   

The project here is something I was asked to do for the family, that was an easy to control minecraft bedrock server. That allows the kids to have a safe place to play minecraft. Therefore, this is not gold standard / best practise, nicely documented or in any way production ready code to be used for anything else but my own family.

The project is consists of
<ul>
  <li>
    Angular that control various firebase and GCP resources
    <ul>
      <li>GCP Compute engine</li>
      <li>GCP Firewall Rules</li>
      <li>Cloud Functions for Firebase</li>
      <li>Firebase Authentication</li>
      <li>Cloud Firestore</li>
    </ul>
  </li>
</ul>

[![Product Name Screen Shot][product-screenshot]](https://github.com/entvex/Minecraft-bedrock-on-GCP/blob/master/images/product-diagram.png)

### Built With

* [Angular](https://angular.io/)
* [AngularFire](https://github.com/angular/angularfire)
* [ng-bootstrap](https://ng-bootstrap.github.io)

<!-- GETTING STARTED -->
## Getting Started

To get a copy up and running on google cloud platform and firebase follow these simple steps.

### Prerequisites

This is a list things you need to use the software and how to install them.
* GCP project 
    https://cloud.google.com/

* Firebase project
    https://firebase.google.com/

* npm
```sh
npm install npm@latest -g
```

* Angular CLI
```sh
npm install -g @angular/cli
```

* Firebase CLI
```sh
npm install -g firebase-tools
```

### Installation
 
 1. On GCP to use Compute engine, and create an instance g1-small (1 vCPU, 1.7 GB memory), should be sufficient, but you can always scale it up later if needed.
 - SSH into the instance and download the latest minecraft bedrock server using curl.
 - Unzip the archive in your user home directory and name it "bedrock-server". Example ```console foo@bar:/home/foo# unzip bedrock-server-1.16.20.03.zip -d bedrock-server```
 - Get the startup script here, and change the user to match your user on the VM instance and use your cloudflare api key to register a A record on domain, delete if not needed.
 - Set startup script under Custom metadata, click Add item. Supply the provided startup script contents directly by using this key.
 
 2. Clone the repo
 ```console
 foo@bar:~$ git clone https://github.com/entvex/Minecraft-bedrock-on-GCP.git
 ```

 3. Install NPM packages for the Angular interface 
 ```console
 foo@bar:~minecraft-bedrock-on-GCP$ npm install
 ```
 4. Apply the Firebase SDK snippet config to the environment.prod.ts and set your API_URL and MINECRAFT_FQDM(a dns domain to configure) in the same file.
 
 5. Build the angular interface and deploy it to firebase
  ```console
  foo@bar:~minecraft-bedrock-on-GCP$ ng build --prod
  foo@bar:~minecraft-bedrock-on-GCP$ firebase deploy --only hosting
  ```
 6. Go into Firebase Authentication and add Google in the Sign-in providers.

 7. Create a Cloud Firestore with a collection with a Collection ID "users". Add a document with Use Auto-ID and make a Field type string and set the value as to an email that signed up via auth(This is how you give admin access to users).
 
 8. Install NPM packages for firebase cloud functions
  ```console
 foo@bar:~minecraft-bedrock-on-GCP$ cd functions
 foo@bar:~minecraft-bedrock-on-GCP/functions$ npm install
  ```
 9.  Deploy the Firebase Cloud Function
   ```console
  foo@bar:~minecraft-bedrock-on-GCP/functions$ firebase deploy --only functions
   ```
 10. Enjoy the minecraft bedrock control panel

## Roadmap

See the [open issues](https://github.com/entvex/Minecraft-bedrock-on-GCP/issues) for a list of proposed features (and known issues).

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.

<!-- CONTACT -->
## Contact

Project Link: [https://github.com/entvex/Minecraft-bedrock-on-GCP](https://github.com/entvex/Minecraft-bedrock-on-GCP)

<!-- ACKNOWLEDGEMENTS 
## Acknowledgements
* []()
-->

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/entvex/Minecraft-bedrock-on-GCP.svg?style=flat-square
[contributors-url]: https://github.com/entvex/Minecraft-bedrock-on-GCP/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/entvex/Minecraft-bedrock-on-GCP.svg?style=flat-square
[forks-url]: https://github.com/entvex/Minecraft-bedrock-on-GCP/network/members
[stars-shield]: https://img.shields.io/github/stars/entvex/Minecraft-bedrock-on-GCP.svg?style=flat-square
[stars-url]: https://github.com/entvex/Minecraft-bedrock-on-GCP/stargazers
[issues-shield]: https://img.shields.io/github/issues/entvex/Minecraft-bedrock-on-GCP.svg?style=flat-square
[issues-url]: https://github.com/entvex/Minecraft-bedrock-on-GCP/issues
[license-shield]: https://img.shields.io/github/license/entvex/Minecraft-bedrock-on-GCP.svg?style=flat-square
[license-url]: https://github.com/entvex/Minecraft-bedrock-on-GCP/blob/master/LICENSE.txt
[product-screenshot]: images/product-diagram.png