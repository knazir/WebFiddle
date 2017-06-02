class Api {
  static _makeRequest(method, path, onSuccess, onFailure, body) {
    const opts = {
      method: method,
      credentials: "include",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(body)
    };

    return fetch(`${window.location.origin}${path}`, opts)
      .then(response => response.json())
      .then(onSuccess, onFailure);
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

  static updateFile(username, projectName, fileId, contents, onSuccess, onFailure) {
    return Api._post(`/users/${username}/projects/${encodeURIComponent(projectName)}/files/${fileId}/update`,
      onSuccess, onFailure, { contents });
  }

  static setProjectPublished(username, projectName, published, onSuccess, onFailure) {
    return Api._post(`/users/${username}/projects/${encodeURIComponent(projectName)}/publish`, onSuccess, onFailure,
      { published });
  }
}