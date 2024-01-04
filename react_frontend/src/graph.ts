// Add an empty export statement to make 'graph.ts' a module
export {};

/**
 * This code has the MS Graph API call functionality completely removed.
 */

// You can remove the import statement for graphConfig as it's not needed anymore.
// import { graphConfig } from './authConfig';

// You can remove the callMsGraph function and its associated code.
/*
export async function callMsGraph(accessToken: string) {
    const headers = new Headers();
    const bearer = `Bearer ${accessToken}`;

    headers.append('Authorization', bearer);

    const options = {
        method: 'GET',
        headers: headers
    };

    return fetch(graphConfig.graphMeEndpoint, options)
        .then(response => response.json())
        .catch(error => console.log(error));
}
*/
