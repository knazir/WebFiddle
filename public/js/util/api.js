class Api {
  static _checkApiError(response) {
    return response.status >= 400 && response.status <= 500;
  }

  static _json(response) {
    return Api._checkApiError(response) ? Promise.reject(response) : response.json();
  }

  static _makeRequest(method, path, onSuccess, onFailure, body) {
    const opts = {
      method: method,
      credentials: "include",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(body)
    };

    const handleError = async function(response) {
      const error = await response.json();
      onFailure(error);
    };

    return fetch(`${window.location.origin}${path}`, opts)
      .then(Api._json)
      .then(onSuccess, handleError);
  }

  static _get(path, onSuccess, onFailure) {
    return Api._makeRequest("get", path, onSuccess, onFailure);
  }

  static _post(path, onSuccess, onFailure, body) {
    return Api._makeRequest("post", path, onSuccess, onFailure, body);
  }

  /*
   * TODO: Be more secure about passwords...
   */
  static getUser(username, password, onSuccess, onFailure) {
    return Api._get(`/users/${username}`, onSuccess, onFailure);
  }

  static getProject(username, projectName, onSuccess, onFailure) {
    return Api._get(`/users/${username}/projects/${encodeURIComponent(projectName)}`, onSuccess, onFailure);
  }

  static getFile(username, projectName, fileId, onSuccess, onFailure) {
    return Api._get(`/users/${username}/projects/${encodeURIComponent(projectName)}/files/${fileId}`,
      onSuccess, onFailure);
  }

  static createProject(username, projectName, useStarterCode, onSuccess, onFailure) {
    return Api._post(`/users/${username}/projects/create`, onSuccess, onFailure, { projectName, useStarterCode })
  }

  static deleteProject(username, projectName, onSuccess, onFailure) {
    return Api._post(`/users/${username}/projects/delete`, onSuccess, onFailure, { projectName });
  }

  static createFile(username, projectName, filename, type, onSuccess, onFailure) {
    return Api._post(`/users/${username}/projects/${projectName}/files/create`, onSuccess, onFailure,
      { filename, type })
  }

  static deleteFile(username, projectName, filename, onSuccess, onFailure) {
    return Api._post(`/users/${username}/projects/${projectName}/files/delete`, onSuccess, onFailure, { filename });
  }

  static updateFile(username, projectName, filename, contents, onSuccess, onFailure) {
    return Api._post(`/users/${username}/projects/${encodeURIComponent(projectName)}/files/${filename}/update`,
      onSuccess, onFailure, { contents });
  }

  static setProjectPublished(username, projectName, published, onSuccess, onFailure) {
    return Api._post(`/users/${username}/projects/${encodeURIComponent(projectName)}/publish`, onSuccess, onFailure,
      { published });
  }
}