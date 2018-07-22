![alt text](https://github.com/Alepacox/ChromeExtension_PasswordManager_UnicamWebProject/blob/master/logo/dominKey_logo.png)

# DominKey Frontend
Frontend side of Dominkey, website developed with the purpose of generating and storing password securely for each site you want to.
Conceived and developed by Riccardo Amadio and Alessandro Pacini at the University of Camerino.
Realized with AngulaJS 6.0 and Bootstrap 4.1.
## Install
```
npm install
```
## Launch on localhost
```
npm start
```
## Launch on 0.0.0.0
```
npm run global
```
Useful for testing purpose on other devices on the same subnet. Remember to launch the backend too in global mode and modify here the server const in global.ts with its address.

Requires at least Dominkey's Backend to run (link above).

### DominKey repo
* [Backend](https://github.com/rokity/PasswordManager_UnicamWebProject/)
  Made with NodeJS, Hapi and Sqlite.
* [Chrome Extension](https://github.com/Alepacox/ChromeExtension_PasswordManager_UnicamWebProject)

#### Notes :
* [Generate Password Library Angular](https://github.com/xama5/generate-password-browser)
