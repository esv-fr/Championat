import React, { Fragment, Component, useState, useEffect} from 'react'
import Keycloak from 'keycloak-js';

export const Secured = () => {

  const [state, setState] = useState({keycloak: null, authenticated: false});

  useEffect(()=>{
/*    const keycloak = Keycloak(
          { "realm": "brd-u210001936-crmlkito", 
            "auth-server-url": "https://sso-tech-rhc-sso.apps.okd.techpark.local/auth",
            "ssl-required": "external",
            "resource": "brd-u210001936-crmlkito",
            "credentials": { 
                            "secret": "3ef3e94e-4c91-45d8-8bf8-fac41e3ac6b5"
                           },
            "confidential-port": 0
           }
          );

    const keycloak = Keycloak(
          { realm: "brd-u210001936-crmlkito", 
            clientId: "brd-u210001936-crmlkito", 
            url: "https://sso-sso74.apps.okd.techpark.local/auth/",
            'auth-server-url': "https://sso-sso74.apps.okd.techpark.local/auth/",
            'ssl-required': "external",
            "resource": "brd-u210001936-crmlkito",
            'verify-token-audience': true,
            credentials: { 
                            "secret": "59c38c6a-fc8c-43d1-a414-265fb6441f32"
                           },
            'confidential-port': 0,
            'policy-enforcer': {},
           }
          );

    const keycloak = Keycloak(
          {
            realm: "brd-u210001936-crmlkito",
            clientId: "brd-u210001936-crmlkito",
            'auth-server-url': "https://sso-sso74.apps.okd.techpark.local/auth/",
            url: "https://sso-sso74.apps.okd.techpark.local/auth/",
            'ssl-required': "external",
            resource: "brd-u210001936-crmlkito",
            'public-client': true,
            'confidential-port': 0
          }
         );*/

/*    const keycloak = Keycloak(
          {
           realm: "brd-u210001936-crmlkito",
           clientId: "brd-u210001936-crmlkito",
           'auth-server-url': "https://sso-sso74.apps.okd.techpark.local/auth/",
           'ssl-required': "external",
           resource: "brd-u210001936-crmlkito",
           'verify-token-audience': true,
           'credentials': {
                           'secret': "50c7d470-eb8c-4924-97f2-a9a7354582e2"
                          },
           'confidential-port': 0,
           'policy-enforcer': {},
          }
    );

    console.log('UseEffect Keycloak: ', keycloak)
    keycloak.init({onLoad: 'login-required'}).then( authenticated => { setState({ keycloak: keycloak, authenticated: authenticated }) })
*/
    const keycloak = Keycloak('/keycloak.json');
    console.log('UseEffect Keycloak: ', keycloak)
    keycloak.init({onLoad: 'login-required'}).then(authenticated => {
      this.setState({ keycloak: keycloak, authenticated: authenticated })
    })

  }, [])

  const outputMessage = () => {
      console.log('State: ', state.keycloak, 'Auth: ', state.authenticated)
      if(state.keycloak){
          if(state.authenticated) return(
                                         <div>
                                           <p>This is a Keycloak-secured component of your application. You shouldn't be able
                                              to see this unless you've authenticated with Keycloak.</p>
                                         </div>
                                  )
          else return( <div>Unable to authenticate!</div> )
     }
     else return(<div>Initializing Keycloak...</div>)
  }
return( 
  <Fragment>
    { outputMessage() } 
  </Fragment>
)
}
