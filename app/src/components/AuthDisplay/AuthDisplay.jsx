import {
    auth,
    AuthComponent,
    uiConfig,
  } from "../../database/firebaseResources";
  
  
  
  // AuthDisplay Component
  export const AuthDisplay = () => {
    return (
      <AuthComponent
          id="firebaseui-auth-container"
          uiConfig={uiConfig}
          firebaseAuth={auth}
      />
    );
  };
  